import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    ImageBackground,
    Image,
    RefreshControl,
    Animated,
    Button,
    StyleSheet,
    TextInput,
    FlatList,
    ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native';
import {
    faSolid,
    faFlagCheckered,
    faSliders,
    faX,
    faArrowRight,
    faArrowLeft,
    faPlus,
    faBars,
    faCheck,
    faChartSimple,
    faStar,
    faTriangleExclamation,
    faArrowsRotate
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Styling, windowHeight, windowWidth, HeightRatio, WidthRatio } from '../../Styling';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import moment from 'moment'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import { Navbar } from '../../components/Navbar';
import { MainStateContext } from '../../App';
import { convertDateFormat } from './auxilliary/ConvertDateFormat';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_ENTRY, ADD_SUB_USER, DELETE_SUB_USER, UPDATE_PREMIUM } from '../../utils/mutations';
import { GET_USER_BY_ID } from '../../utils/queries';
// import { DailySchedule } from './auxilliary/DailySchedule';
import { Loading } from '../../components/Loading';
import { Calendar } from 'react-native-calendars';
import { usePullDailyContent } from './auxilliary/PullDailyContent';
import { useCheckUserTop100 } from './auxilliary/CheckUserTop100';
import {
    THEME_COLOR_POSITIVE,
    THEME_COLOR_POSITIVE_LOW_OPACITY,
    THEME_COLOR_NEGATIVE,
    THEME_COLOR_BACKDROP_DARK,
    THEME_COLOR_BACKDROP_LIGHT,
    THEME_COLOR_BLACK_LOW_OPACITY,
    THEME_COLOR_BLACK_HIGH_OPACITY,
    THEME_FONT_COLOR_WHITE,
    THEME_FONT_COLOR_WHITE_LOW_OPACITY,
    THEME_FONT_COLOR_BLACK,
    THEME_COLOR_ATTENTION,
    THEME_TRANSPARENT,
    THEME_COLOR_PURPLE,
    THEME_COLOR_PURPLE_LOW_OPACITY,
    THEME_COLOR_BLACKOUT,
    THEME_FONT_GREY
} from '../../COLOR.js';
import { DailyScheduleSimplified } from './auxilliary/DailyScheduleSimplified';
import { Metrics_Primary } from './auxilliary/metrics/Metrics_Primary';
import { Calories_Primary } from './auxilliary/calories/Calories_Primary';
import { Add_Primary } from './auxilliary/add/Add_Primary';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { GLOBAL_GRAPHQL_API_URL } from '../../App';


const resetActionKey = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Key', params: {} }]
});

const APIKeys = {
    google: "goog_caDqiYZPHvJIwlqyFoZDgTqOywO",
};

export const HomeScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    // # - ESTABLISH USER DETAILS
    const [premiumStatus, setPremiumStatus] = useState(null);
    const [premiumExpiration, setPremiumExpiration] = useState(null);
    const [subuserLength, setSubuserLength] = useState(null);
    // const [firstSubuser, setFirstSubuser] = useState(null)
    const [networkConnected, setNetworkConnected] = useState(true);

    // # - DATE
    const formatString = 'DD/MM/YYYY';
    const [currentDate, setCurrentDate] = useState(moment().format(formatString));
    const [currentDateReadable, setCurrentDateReadable] = useState('')


    useEffect(() => {
        console.log("#CHECK 1")
        if (userByID?.user) {
            console.log("#CHECK 2")

            setPremiumStatus(userByID?.user.premium.status)
            setPremiumExpiration(userByID?.user.premium.expiration)
            setSubuserLength(userByID.user.subuser.length)
            // if (userByID?.user.subuser.length > 0) {
            //     setFirstSubuser(userByID?.user.subuser[0])
            // }
        }


    }, [userByID])

    useEffect(() => {
        // Check to see if the stored expiration date the same as the current date
        function isIncluded(str1, str2) {
            if (typeof str1 == 'string' && typeof str2 == 'string') {
                return str1.includes(str2);
            }
        }

        // Convert Date.now() to UTC
        function convertToReadableTime(timestamp) {
            const utcTime = moment.utc(timestamp);
            const localTime = utcTime.local();
            return localTime.format('MMMM Do YYYY, h:mm:ss a');
        }

        const test = isIncluded(premiumExpiration, currentDateReadable)
        const test_2 = convertToReadableTime(Date.now())
        console.log(test_2)

    }, [premiumExpiration])


    const [updatePremium] = useMutation(UPDATE_PREMIUM);
    const intervalID = useRef(null);

    const [loading, setLoading] = useState(false);
    const [totalCalorieCount, setTotalCalorieCount] = useState(null)
    const subuserIndex = useRef(userByID?.user && userByID?.user.subuser.length > 0 && !userByID?.user.premium.status ? 0 : null)
    const [deleteSubuserModalVisible, setDeleteSubuserModalVisible] = useState(false);
    const [deleteSubuserIndex, setDeleteSubuserIndex] = useState(null)
    const [addSubUserModalVisible, setAddSubUserModalVisible] = useState(true) //userByID?.user && userByID?.user.subuser.length > 0 && !userByID?.user.premium ? false : true
    const [addSubUser] = useMutation(ADD_SUB_USER);
    const [deleteSubUser] = useMutation(DELETE_SUB_USER);


    const [subuserInput, setSubuserInput] = useState('')
    const handleTimeout = useRef(false)



    //  # - Calendar
    const [calendarModalVisible, setCalendarModalVisible] = useState(false);
    const [selectedCalendarModalDate, setSelectedCalendarModalDate] = useState('');
    const [selectedDateFromCalendar, setSelectedDateFromCalendar] = useState(null)

    const pingServer = async () => {
        console.log("# - Ping Server: " + GLOBAL_GRAPHQL_API_URL)
        try {
            const response = await fetch(`${GLOBAL_GRAPHQL_API_URL}/ping`, {
                method: 'GET',
            });
            if (response.ok) {
                setNetworkConnected(true)
                return true;
            } else {
                setNetworkConnected(false)
                return false;
            }
        } catch (error) {
            setNetworkConnected(false)
            return false;
        }
    }

    const onRefresh = useCallback(() => {
        setLoading(true)
        pingServer()
        refetch();
        setTimeout(() => {
            setLoading(false)
        }, 100);
    }, []);


    const { calendarModalCalorieTotal, calendarModalDate, calendarModalFoods, calendarModalEmotion } = usePullDailyContent(`${convertDateFormat(selectedDateFromCalendar)}`);


    const onDateSelect = (day) => {
        const selectedDate = moment(day.dateString).format(formatString); // convert date to desired format
        setSelectedCalendarModalDate(day.dateString);
        setSelectedDateFromCalendar(selectedDate);
    };


    const handlePreviousDay = () => {
        setCurrentDate(moment(currentDate, formatString).subtract(1, 'days').format(formatString));
    }

    const handleNextDay = () => {
        setCurrentDate(moment(currentDate, formatString).add(1, 'days').format(formatString));
    }

    useEffect(() => {
        setCurrentDateReadable(convertDateFormat(currentDate));
    }, [currentDate])

    const lastTouchTimeRef = useRef(Date.now());
    const touchTimerRef = useRef(null);

    const handleTouch = () => {
        console.log("handleTouch");
        lastTouchTimeRef.current = Date.now();

        clearTimeout(touchTimerRef.current);
        handleTimeout.current = false;

        touchTimerRef.current = setTimeout(() => {
            console.log("CHECK 1")
            async function getValueFor(key) {
                console.log("CHECK 2")

                let result = await SecureStore.getItemAsync(key);
                console.log("CHECK 3")

                if (!handleTimeout.current) {
                    console.log("# - GET VALUE FOR COSMIC KEY  - FROM HOME")

                    if (result && !handleTimeout.current) {
                        handleTimeout.current = true;
                        console.log("# - Result True")
                        navigation.dispatch(resetActionKey);
                    } else {
                        console.log("# - Result False")
                        null
                    }
                }

            }
            getValueFor('cosmicKey')

        }, 120000);
    };

    const checkCustomerInfo = async () => {
        let localUserID = await SecureStore.getItemAsync('userID');
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        Purchases.configure({ apiKey: APIKeys.google, appUserID: localUserID });

        const customerInfo = await Purchases.getCustomerInfo();
        // console.log(customerInfo)

        if (typeof customerInfo.entitlements.active["Premium"] !== "undefined") {
            // console.log(customerInfo.entitlements.active["Premium"])
            console.log("# - Premium service access granted.")
            await updatePremium({
                variables: {
                    status: true,
                    expiration: `${customerInfo.allExpirationDates.baby_food_tracker_premium_month}`
                }
            });

        } else {
            console.log("# - Premium service access revoked.")
            await updatePremium({
                variables: {
                    status: false,
                    expiration: ''
                }
            });
        }
    }

    const getTotalCalorieCount = async () => {
        try {
            const value = await AsyncStorage.getItem('@TotalCalorieCount')
            if (value !== null) {
                setTotalCalorieCount(value)
            }
        } catch (e) {
            // error reading value
        }
    }

    useEffect(() => {
        setLoading(true)
        checkCustomerInfo()
        getTotalCalorieCount()

        const interval_0 = setInterval(() => {
            getTotalCalorieCount()

            if (mainState.current.triggerRefresh) {
                console.log("# - TRIGGER REFRESH")
                refetch()
                setLoading(true)
                setCalendarModalVisible(false)
                setTimeout(() => {
                    setMainState({
                        triggerRefresh: false
                    })
                }, 1000)
            }
            if (!mainState.current.triggerRefresh) {
                setLoading(false)
                setMainState({
                    triggerRefresh: null
                })
            }

        }, 200)

        const interval_1 = setInterval(() => {
            checkCustomerInfo()
        }, 60000)

        return () => {
            clearInterval(interval_0)
            clearInterval(interval_1)
        }
    }, [])

    const handleAddSubuser = async () => {
        setMainState({ triggerRefresh: true })
        await addSubUser({
            variables: {
                subusername: subuserInput
            }
        });
        setMainState({ triggerRefresh: false })
    }

    const handleDeleteSubuser = async () => {
        await deleteSubUser({
            variables: {
                userid: userByID?.user._id,
                subuserid: userByID?.user.subuser[deleteSubuserIndex]._id
            }
        });
        setMainState({
            triggerRefresh: true
        })
        setTimeout(() => {
            setMainState({
                triggerRefresh: false
            })
        }, 300)
    }


    const [fontsLoaded] = useFonts({
        'GochiHand_400Regular': require('../../assets/fonts/GochiHand-Regular.ttf'),
        'SofiaSansSemiCondensed-Regular': require('../../assets/fonts/SofiaSansSemiCondensed-Regular.ttf'),
        'SofiaSansSemiCondensed-ExtraBold': require('../../assets/fonts/SofiaSansSemiCondensed-ExtraBold.ttf')
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }





    return (
        <>
            {!loading ?
                <>
                    {calendarModalVisible && <View style={styles.modalVisible_Blackout} />}
                    {addSubUserModalVisible &&
                        <LinearGradient
                            colors={['#8bccde', '#d05bb6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.homePrimary_Container}
                        />
                    }

                    <View
                        style={styles.homePrimary_Container}
                        onLayout={onLayoutRootView}
                    >
                        <LinearGradient
                            colors={['#8bccde', '#d05bb6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.homePrimary_Container}
                        >
                            <View style={{ ...styles.homePrimary_Date }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        handlePreviousDay();
                                        setMainState({ userTouch: true })
                                    }}
                                    style={styles.homePrimary_Date_Arrow}
                                >
                                    <FontAwesomeIcon
                                        icon={faSolid, faArrowLeft}
                                        style={{ color: THEME_FONT_COLOR_BLACK }}
                                        size={25}
                                    />
                                </TouchableOpacity>
                                <View style={styles.homePrimary_Date_Current}>
                                    <TouchableOpacity
                                        onPress={() => { setCalendarModalVisible(true); setMainState({ userTouch: true }) }}
                                    >
                                        <Text
                                            style={styles.homePrimary_Date_Current_Text}
                                            allowFontScaling={false}
                                        >
                                            {currentDateReadable}
                                        </Text>
                                    </TouchableOpacity>
                                    {currentDate != moment().format(formatString) &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                setCurrentDate(moment().format(formatString));
                                                setMainState({ userTouch: true })
                                            }}
                                            style={{
                                                ...styles.homePrimary_Date_Return_Button,
                                                ...styles.button_Drop_Shadow
                                            }}
                                        >
                                            <Text
                                                style={styles.homePrimary_Date_Return_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                Return to Today
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                </View>


                                <TouchableOpacity
                                    onPress={() => {
                                        handleNextDay();
                                        setMainState({ userTouch: true })
                                    }}
                                    style={styles.homePrimary_Date_Arrow}
                                >
                                    <FontAwesomeIcon
                                        icon={faSolid, faArrowRight}
                                        style={{ color: THEME_FONT_COLOR_BLACK }}
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: HeightRatio(20) }}>
                                <Calories_Primary
                                    totalCalorieCount={totalCalorieCount}
                                />

                                {premiumStatus &&
                                    <Metrics_Primary
                                        subuser={userByID?.user.subuser[subuserIndex.current]}
                                        currentDateReadable={currentDateReadable}
                                    />
                                }

                                <Add_Primary
                                    date={currentDateReadable}
                                    subuser={userByID?.user.subuser[subuserIndex.current]}
                                />
                            </View>

                            <DailyScheduleSimplified
                                date={currentDateReadable}
                                userID={userByID?.user._id}
                                containerHeight={HeightRatio(450)}
                                from={"main"}
                                subuser={userByID?.user.subuser[subuserIndex.current]}
                                premium={premiumStatus}
                                nav={navigation}
                            />
                            <View style={{ flexDirection: 'row' }}>


                            </View>


                        </LinearGradient>
                    </View>


                    <Modal
                        visible={calendarModalVisible}
                        animationType="slide"
                        transparent={true}
                        style={{
                            width: windowWidth,
                        }}
                    >
                        <View style={styles.modalVisible_Container}>
                            <Calendar
                                onDayPress={(day) => onDateSelect(day)}
                                markedDates={{ [selectedCalendarModalDate]: { selected: true } }}
                                theme={{
                                    calendarBackground: 'rgba(31, 31, 39, 1.00)',
                                    textMonthFontSize: HeightRatio(20),
                                    monthTextColor: THEME_FONT_COLOR_WHITE,
                                    arrowColor: THEME_FONT_COLOR_WHITE,
                                    selectedDayBackgroundColor: THEME_COLOR_POSITIVE,
                                    selectedDayTextColor: THEME_FONT_COLOR_BLACK,
                                    todayTextColor: THEME_COLOR_POSITIVE,
                                    dayTextColor: THEME_COLOR_POSITIVE_LOW_OPACITY,
                                    textDisabledColor: THEME_FONT_COLOR_WHITE_LOW_OPACITY,
                                    textDayFontFamily: 'SofiaSansSemiCondensed-Regular',
                                    textDayFontSize: HeightRatio(15),

                                }}
                                style={{
                                    width: windowWidth - HeightRatio(40)
                                }}
                            />
                            {!selectedCalendarModalDate &&
                                <TouchableOpacity
                                    onPress={() => {
                                        setCalendarModalVisible(false);
                                        setSelectedCalendarModalDate('');
                                        setMainState({ userTouch: true })
                                    }}
                                >
                                    <View style={{ ...styles.modalVisible_FullButton, ...styles.button_Drop_Shadow }}>
                                        <Text
                                            style={{ ...styles.modalVisible_Button_Text, color: THEME_FONT_COLOR_WHITE }}
                                            allowFontScaling={false}
                                        >
                                            Close
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                        {selectedCalendarModalDate &&
                            <View style={styles.modalVisible_Container}>
                                <View
                                    style={{
                                        height: HeightRatio(300)
                                    }}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.homePrimary_TotalCalories}>
                                            <Text
                                                style={{
                                                    ...styles.homePrimary_TotalCalories_Text,
                                                    fontSize: HeightRatio(20),
                                                }}
                                                allowFontScaling={false}
                                            >
                                                {calendarModalDate}
                                            </Text>
                                        </View>
                                    </View>
                                    <DailyScheduleSimplified
                                        date={calendarModalDate}
                                        userID={userByID?.user._id}
                                        containerHeight={HeightRatio(250)}
                                        from={"calendar"}
                                        subuser={userByID?.user.subuser[subuserIndex.current]}
                                        premium={premiumStatus}
                                        nav={navigation}
                                    />


                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setCalendarModalVisible(false);
                                            setSelectedCalendarModalDate('');
                                            setLoading(true)
                                            setTimeout(() => {
                                                setLoading(false)
                                            }, 500)
                                            setMainState({ userTouch: true })
                                        }}
                                    >
                                        <View style={{ ...styles.modalVisible_HalfButton, ...styles.button_Drop_Shadow, backgroundColor: THEME_COLOR_NEGATIVE }}>
                                            <Text
                                                style={{ ...styles.modalVisible_Button_Text, color: THEME_FONT_COLOR_WHITE }}
                                                allowFontScaling={false}
                                            >
                                                Close
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setCurrentDate(selectedDateFromCalendar);
                                            setCalendarModalVisible(false);
                                            setSelectedCalendarModalDate('');
                                            setMainState({ userTouch: true })
                                        }}
                                    >
                                        <View style={{ ...styles.modalVisible_HalfButton, ...styles.button_Drop_Shadow, backgroundColor: THEME_COLOR_POSITIVE }}>
                                            <Text
                                                style={styles.modalVisible_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                Go
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </Modal>

                    <Modal
                        visible={addSubUserModalVisible}
                        animationType="slide"
                        transparent={true}
                        style={{
                            ...styles.homePrimary_Container
                        }}
                    >
                        <View
                            style={{
                                ...styles.homePrimary_Container,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <LinearGradient
                                colors={['#8bccde', '#d05bb6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    ...styles.homePrimary_Container,
                                    display: 'flex',
                                }}
                            >
                                <>
                                    <View style={{ backgroundColor: '#1f1f27', borderRadius: HeightRatio(20), padding: HeightRatio(20) }}>
                                        <Text
                                            style={{
                                                color: THEME_FONT_COLOR_WHITE,
                                                alignSelf: 'center',
                                                fontSize: HeightRatio(50),
                                                margin: 20,
                                                fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Add a Child
                                        </Text>
                                        <TextInput
                                            type="text"
                                            name="subuser"
                                            placeholder="Child's name"
                                            placeholderTextColor='white'
                                            value={subuserInput}
                                            onChangeText={setSubuserInput}
                                            style={{
                                                ...Styling.textInputStyle
                                            }}
                                            disableFullscreenUI={true}
                                            allowFontScaling={false}
                                        />


                                        {subuserInput != "" &&
                                            <>
                                                {premiumStatus &&
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            handleAddSubuser()
                                                        }}
                                                    >
                                                        <View style={{
                                                            backgroundColor: THEME_COLOR_POSITIVE,
                                                            ...styles.button_Drop_Shadow,
                                                            display: 'flex',
                                                            justifyContent: 'flex-start',
                                                            padding: HeightRatio(20),
                                                            borderRadius: HeightRatio(10),
                                                            alignSelf: 'center',
                                                            width: windowWidth - WidthRatio(50),
                                                            marginTop: HeightRatio(10)
                                                        }}>
                                                            <Text
                                                                style={{
                                                                    color: THEME_FONT_COLOR_BLACK,
                                                                    fontSize: HeightRatio(30),
                                                                    alignSelf: 'center',
                                                                    fontFamily: 'SofiaSansSemiCondensed-Regular'
                                                                }}
                                                                allowFontScaling={false}
                                                            >
                                                                ADD
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                }
                                                {!premiumStatus && subuserLength <= 0 &&
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            handleAddSubuser()
                                                        }}
                                                    >
                                                        <View style={{
                                                            backgroundColor: THEME_COLOR_POSITIVE,
                                                            ...styles.button_Drop_Shadow,
                                                            display: 'flex',
                                                            justifyContent: 'flex-start',
                                                            padding: HeightRatio(20),
                                                            borderRadius: HeightRatio(10),
                                                            alignSelf: 'center',
                                                            width: windowWidth - WidthRatio(50),
                                                            marginTop: HeightRatio(10)
                                                        }}>
                                                            <Text
                                                                style={{
                                                                    color: THEME_FONT_COLOR_BLACK,
                                                                    fontSize: HeightRatio(30),
                                                                    alignSelf: 'center',
                                                                    fontFamily: 'SofiaSansSemiCondensed-Regular'
                                                                }}
                                                                allowFontScaling={false}
                                                            >
                                                                ADD
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                }
                                                {!premiumStatus &&

                                                    <View style={{ margin: HeightRatio(10) }}>
                                                        <Text
                                                            style={{
                                                                color: THEME_COLOR_ATTENTION,
                                                                fontSize: HeightRatio(20),
                                                                textAlign: 'center',
                                                                fontFamily: 'SofiaSansSemiCondensed-Regular'
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            Premium users can add additional children.
                                                        </Text>
                                                    </View>
                                                }
                                            </>

                                        }


                                    </View>
                                    <View style={{ borderBottomWidth: 2, borderBottomColor: 'white', width: '90%', margin: 20, }} />
                                </>

                                <>
                                    {!networkConnected &&
                                        <View style={{
                                            // position: 'absolute',
                                            // top: HeightRatio(-40),
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: THEME_COLOR_NEGATIVE,
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(10),
                                            margin: HeightRatio(10)

                                        }}>
                                            <Text 
                                                style={{
                                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                                    color: THEME_FONT_COLOR_WHITE,
                                                    fontSize: HeightRatio(20),
                                                    alignSelf: 'center',
                                                }}
                                                allowFontScaling={false}
                                            >
                                                Network Error
                                            </Text>
                                        </View>
                                    }
                                    <View 
                                        style={{
                                            flexDirection: 'row',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            alignSelf: 'center'
                                        }}
                                    >
                                        {/* refetch */}
                                        <TouchableOpacity
                                            onPress={() => onRefresh()}
                                            style={{
                                                height: HeightRatio(50),
                                                width: HeightRatio(50),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                                borderRadius: HeightRatio(10),
                                                margin: HeightRatio(10)
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faSolid, faArrowsRotate}
                                                style={{ color: THEME_FONT_COLOR_WHITE }}
                                                size={25}
                                            />
                                        </TouchableOpacity>
                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                                padding: HeightRatio(10),
                                                borderRadius: HeightRatio(10)
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    margin: HeightRatio(4)

                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: HeightRatio(20),
                                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                                        color: THEME_FONT_COLOR_WHITE
                                                    }}
                                                    allowFontScaling={false}
                                                >
                                                    PREMIUM: &nbsp;
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: HeightRatio(20),
                                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                                        color: premiumStatus ? THEME_COLOR_POSITIVE : THEME_COLOR_NEGATIVE
                                                    }}
                                                    allowFontScaling={false}
                                                >
                                                    {premiumStatus ? 'ACTIVE' : 'INACTIVE'}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    margin: HeightRatio(4)
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: HeightRatio(20),
                                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                                        color: THEME_FONT_COLOR_WHITE
                                                    }}
                                                    allowFontScaling={false}
                                                >
                                                    EXPIRATION: {premiumExpiration}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <SafeAreaView
                                        style={{
                                            ...styles.container,
                                            height: HeightRatio(430),
                                        }}
                                    >
                                        <ScrollView style={styles.scrollView}>
                                            <>
                                                {userByID?.user.subuser.map((data, index) => (
                                                    <View style={{ flexDirection: 'row', margin: HeightRatio(10) }} key={index}>
                                                        {index === 0 ? (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setAddSubUserModalVisible(false);
                                                                    setMainState({ userTouch: true })
                                                                    subuserIndex.current = index;
                                                                    onRefresh();
                                                                }}

                                                                style={{
                                                                    backgroundColor: '#1f1f27',
                                                                    ...styles.button_Drop_Shadow,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    borderRadius: HeightRatio(20),
                                                                    padding: HeightRatio(25),
                                                                    alignSelf: 'center',
                                                                    width: (windowWidth - WidthRatio(50)),
                                                                    flexDirection: 'row'
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        flexDirection: 'row',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    <Image
                                                                        source={require('../../assets/favicon_0.png')}
                                                                        style={{
                                                                            height: HeightRatio(40),
                                                                            width: HeightRatio(40),
                                                                            marginLeft: HeightRatio(10)
                                                                        }}
                                                                    />
                                                                </View>
                                                                <View style={{ flexDirection: 'column' }}>
                                                                    <Text
                                                                        style={{
                                                                            color: THEME_FONT_COLOR_WHITE,
                                                                            fontSize: HeightRatio(20),
                                                                            marginLeft: HeightRatio(20),
                                                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                                                                            width: '90%'

                                                                        }}
                                                                        allowFontScaling={false}
                                                                        numberOfLines={1}
                                                                        ellipsizeMode={'tail'}
                                                                    >
                                                                        {data.subusername}
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: THEME_FONT_COLOR_WHITE,
                                                                            fontSize: HeightRatio(15),
                                                                            marginLeft: HeightRatio(20),
                                                                            fontFamily: 'SofiaSansSemiCondensed-Regular',

                                                                        }}
                                                                        allowFontScaling={false}
                                                                        numberOfLines={1}
                                                                        ellipsizeMode={'tail'}
                                                                    >
                                                                        Update food tracker.
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        ) : (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setAddSubUserModalVisible(false);
                                                                    setMainState({ userTouch: true })
                                                                    subuserIndex.current = index;
                                                                    onRefresh();
                                                                }}
                                                                disabled={index != 0 && premiumStatus ? false : true}
                                                                style={{
                                                                    backgroundColor: index != 0 && premiumStatus ? '#1f1f27' : '#4d4d56',
                                                                    ...styles.button_Drop_Shadow,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    borderRadius: HeightRatio(20),
                                                                    padding: HeightRatio(25),
                                                                    alignSelf: 'center',
                                                                    width: (windowWidth - WidthRatio(50)),
                                                                    flexDirection: 'row'
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        flexDirection: 'row',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    <Image
                                                                        source={require('../../assets/favicon_0.png')}
                                                                        style={{
                                                                            height: HeightRatio(40),
                                                                            width: HeightRatio(40),
                                                                            marginLeft: HeightRatio(10)
                                                                        }}
                                                                    />
                                                                </View>
                                                                <View style={{ flexDirection: 'column' }}>
                                                                    <Text
                                                                        style={{
                                                                            color: THEME_FONT_COLOR_WHITE,
                                                                            fontSize: HeightRatio(20),
                                                                            marginLeft: HeightRatio(20),
                                                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                                                                            width: '90%'

                                                                        }}
                                                                        allowFontScaling={false}
                                                                        numberOfLines={1}
                                                                        ellipsizeMode={'tail'}
                                                                    >
                                                                        {data.subusername}
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: THEME_FONT_COLOR_WHITE,
                                                                            fontSize: HeightRatio(15),
                                                                            marginLeft: HeightRatio(20),
                                                                            fontFamily: 'SofiaSansSemiCondensed-Regular',

                                                                        }}
                                                                        allowFontScaling={false}
                                                                        numberOfLines={1}
                                                                        ellipsizeMode={'tail'}
                                                                    >
                                                                        Update food tracker.
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                ))}
                                            </>

                                        </ScrollView>
                                    </SafeAreaView>


                                </>
                            </LinearGradient>
                        </View>
                    </Modal>

                    <Modal
                        visible={deleteSubuserModalVisible}
                        animationType="slide"
                        transparent={true}
                    >
                        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
                            <View
                                style={{
                                    backgroundColor: '#1f1f27',
                                    margin: 20,
                                    zIndex: 999,
                                    borderRadius: 10,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    position: 'absolute', bottom: HeightRatio(30), left: 0, right: 0
                                }}
                            >
                                <View
                                    style={{
                                        margin: HeightRatio(20),
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Image
                                            source={require('../../assets/favicon_0.png')}
                                            style={{
                                                height: HeightRatio(40),
                                                width: HeightRatio(40),
                                            }}
                                        />
                                        <Text
                                            style={{ color: 'white', fontFamily: 'SofiaSansSemiCondensed-ExtraBold', fontSize: HeightRatio(14) }}
                                            allowFontScaling={false}
                                        >
                                            Baby Food Tracker
                                        </Text>
                                    </View>
                                    <View style={{ height: HeightRatio(10) }}></View>
                                    <View
                                        style={{
                                            padding: HeightRatio(10)
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: THEME_FONT_COLOR_WHITE,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                                marginTop: HeightRatio(10)
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Are you sure you want to remove this child from the list?
                                        </Text>

                                    </View>

                                    <View style={styles.modalContainer_1_B}>
                                        <TouchableOpacity onPress={() => { setDeleteSubuserModalVisible(false); setMainState({ userTouch: true }); }}>
                                            <View style={{ ...styles.modalButton, backgroundColor: THEME_COLOR_POSITIVE }}>
                                                <Text
                                                    style={{ ...styles.modalButton_Text, color: THEME_FONT_COLOR_BLACK }}
                                                    allowFontScaling={false}
                                                >
                                                    Close
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setDeleteSubuserModalVisible(false);
                                                handleDeleteSubuser()
                                                setMainState({ userTouch: true })

                                            }}
                                        >
                                            <View style={{ ...styles.modalButton, backgroundColor: THEME_COLOR_NEGATIVE }}>
                                                <Text
                                                    style={styles.modalButton_Text}
                                                    allowFontScaling={false}
                                                >
                                                    Remove
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>


                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Navbar nav={navigation} auth={mainState.current.authState} position={'absolute'} from={'home'} />

                </>
                :
                <View
                    style={styles.homePrimary_Container}
                >
                    <Loading />
                </View>
            }

            <StatusBar
                barStyle="default"
                hidden={true}
                backgroundColor="transparent"
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
        </>

    )
}

const styles = StyleSheet.create({
    table: {
        padding: 10,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        width: windowWidth - HeightRatio(100)
    },
    cell: {
        flex: 1,
        textAlign: 'left',

    },
    container: {
        height: '80%'

    },
    scrollView: {
        width: '80%',
        alignSelf: 'center'
    },
    renderItem_Search_Results: {
        backgroundColor: THEME_COLOR_BLACK_LOW_OPACITY,
        borderRadius: HeightRatio(10),
        margin: HeightRatio(4),
        width: windowWidth - HeightRatio(80),
        alignSelf: 'center',
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        padding: HeightRatio(10)
    },
    renderItem_Search_Result_Container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: 'row',
        padding: HeightRatio(8),
        width: windowWidth - HeightRatio(140),
    },
    renderItem_Search_Result_Container_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(25),
        fontFamily: "SofiaSansSemiCondensed-Regular",
        display: 'flex',
        flexWrap: 'wrap',
    },
    renderItem_Search_Result_Container_Plus: {
        backgroundColor: THEME_COLOR_ATTENTION,
        borderRadius: HeightRatio(10),
        // height: HeightRatio(40),
        // width: HeightRatio(40),
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
    },
    renderItem_Search_Result_Container_Plus_Text: {
        color: THEME_FONT_COLOR_BLACK,
        fontSize: HeightRatio(30),
        fontFamily: "SofiaSansSemiCondensed-ExtraBold"
    },
    updatingScreen_Container: {
        backgroundColor: THEME_COLOR_BLACK_HIGH_OPACITY,
        position: 'absolute',
        zIndex: 100,
        height: windowHeight,
        width: windowWidth,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    updatingScreen_Container_Text: {
        color: THEME_COLOR_ATTENTION,
        textAlign: 'center',
        fontSize: HeightRatio(50),
        fontFamily: "SofiaSansSemiCondensed-ExtraBold",
        marginTop: HeightRatio(10)
    },
    homePrimary_Container: {
        flex: 1,
        backgroundColor: THEME_COLOR_BACKDROP_DARK,
        display: 'flex',
        alignItems: 'center',
        width: windowWidth
    },
    homePrimary_Date: {
        width: windowWidth,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: HeightRatio(80)
    },
    homePrimary_Date_Arrow: {
        height: '100%',
        width: HeightRatio(90),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth * 0.2,
        // backgroundColor: THEME_COLOR_PURPLE_LOW_OPACITY,
    },
    homePrimary_Date_Current: {
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: windowWidth / 1.5,
        // backgroundColor: THEME_COLOR_PURPLE_LOW_OPACITY,
    },
    homePrimary_Date_Current_Text: {
        color: THEME_FONT_COLOR_BLACK,
        fontSize: HeightRatio(30),
        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
        marginLeft: HeightRatio(10),
        marginRight: HeightRatio(10)
    },
    homePrimary_Date_Return_Button: {
        backgroundColor: THEME_COLOR_NEGATIVE,
        borderRadius: HeightRatio(10),
        position: 'absolute',
        alignSelf: 'center',
        top: HeightRatio(60),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: HeightRatio(4),
        paddingLeft: HeightRatio(10),
        paddingRight: HeightRatio(10)
    },
    homePrimary_Date_Return_Button_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(20),
        fontFamily: 'SofiaSansSemiCondensed-Regular',
    },
    homePrimary_Pattern_1: {
        height: '100%',
        width: '100%',
        opacity: 0.02,
        position: 'absolute',
        zIndex: -10
    },
    homePrimary_TotalCalories: {
        alignSelf: 'center',
        backgroundColor: THEME_COLOR_ATTENTION,
        margin: HeightRatio(5),
        borderRadius: 10,
        padding: HeightRatio(10),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    homePrimary_TotalCalories_Text: {
        color: THEME_FONT_COLOR_BLACK,
        fontSize: HeightRatio(30),
        textAlign: 'center',
        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
    },
    homePrimary_Add_Button: {
        backgroundColor: THEME_COLOR_POSITIVE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // padding: HeightRatio(20),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        margin: HeightRatio(4)
    },
    homePrimary_Add_Button_Text: {
        color: THEME_FONT_COLOR_BLACK,
        fontSize: HeightRatio(20),
        textAlign: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular',
    },
    modalVisible_Blackout: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        height: '100%', width: '100%',
        position: 'absolute', zIndex: 10
    },
    modalVisible_Container: {
        backgroundColor: 'rgba(31, 31, 39, 1.00)',
        zIndex: 999,
        width: windowWidth - HeightRatio(10),
        padding: HeightRatio(20),
        borderRadius: HeightRatio(10),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: HeightRatio(10)
    },
    modalVisible_TextInput: {
        ...Styling.textInputStyle,
        marginTop: HeightRatio(20),
        height: HeightRatio(70),
        fontSize: HeightRatio(30),
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    },
    modalVisible_Search_Button: {
        backgroundColor: THEME_COLOR_POSITIVE,
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        width: windowWidth - WidthRatio(100),
        margin: HeightRatio(10)
    },
    modalVisible_Search_Button_Text: {
        color: THEME_FONT_COLOR_BLACK,
        fontSize: HeightRatio(25),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    },
    modalVisible_Title_Container: {
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(5),
        alignSelf: 'center',
        width: windowWidth - WidthRatio(100),
        // marginTop: HeightRatio(10),
    },
    modalVisible_Title_Container_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(25),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-ExtraBold'
    },
    modalVisible_recentFoodData_Map_Container_0: {
        backgroundColor: THEME_COLOR_BLACK_LOW_OPACITY,
        borderRadius: HeightRatio(10),
        margin: HeightRatio(4),
        width: windowWidth - HeightRatio(80),
        alignSelf: 'center',
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
    },
    modalVisible_recentFoodData_Map_Container_1: {
        width: windowWidth - HeightRatio(120),
        alignSelf: 'center'
    },
    modalVisible_recentFoodData_Map_Container_2: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: 'row',
        padding: HeightRatio(8),
    },
    modalVisible_recentFoodData_Map_Text_Bold: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(20),
        fontFamily: "SofiaSansSemiCondensed-ExtraBold",
        width: WidthRatio(200)
    },
    modalVisible_recentFoodData_Map_Text_Regular: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(20),
        fontFamily: "SofiaSansSemiCondensed-Regular"
    },
    modalVisible_recentFoodData_Map_Plus: {
        backgroundColor: THEME_COLOR_ATTENTION,
        borderRadius: HeightRatio(10),
        // height: HeightRatio(40),
        // width: HeightRatio(40),
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
    },
    modalVisible_recentFoodData_Map_Plus_Text: {
        color: THEME_FONT_COLOR_BLACK,
        fontSize: HeightRatio(30),
        fontFamily: "SofiaSansSemiCondensed-ExtraBold"
    },
    modalVisible_recentFoodData_Map_Container_0_RecentlyUsed_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(25),
        fontFamily: "SofiaSansSemiCondensed-Regular",
        textAlign: 'center',
        width: '80%',
        display: 'flex',
        flexWrap: 'wrap',
        margin: HeightRatio(5)
    },
    modalVisible_faX: {
        height: HeightRatio(30),
        width: HeightRatio(30),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1000,
        top: HeightRatio(5),
        right: HeightRatio(5),
        borderRadius: HeightRatio(10),
        backgroundColor: THEME_COLOR_NEGATIVE
    },
    modalVisible_FullButton: {
        backgroundColor: THEME_COLOR_NEGATIVE,
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        width: (windowWidth - WidthRatio(100)),
        // marginBottom: HeightRatio(10)
    },
    modalVisible_HalfButton: {
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        width: (windowWidth - WidthRatio(100)) / 2,
        margin: HeightRatio(10)
    },
    modalVisible_Button_Text: {
        color: THEME_FONT_COLOR_BLACK,
        fontSize: HeightRatio(25),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    },
    loading_Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: HeightRatio(505),
        backgroundColor: THEME_COLOR_BACKDROP_DARK
    },
    button_Drop_Shadow: {
        padding: 10,
        borderRadius: 5,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    modalContainer_0: {
        flex: 1,
        backgroundColor: THEME_COLOR_BLACKOUT
    },
    modalContainer_1: {
        backgroundColor: 'rgba(31, 31, 39, 1.00)',
        margin: 20,
        zIndex: 999,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: HeightRatio(30),
        left: 0,
        right: 0
    },
    modalContainer_1_A: {
        margin: HeightRatio(20),
        alignSelf: 'center'
    },
    modalContainer_1_A_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(30),
    },
    modalContainer_1_B: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    modalButton: {
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        width: (windowWidth - WidthRatio(100)) / 2,
        margin: HeightRatio(10)
    },
    modalButton_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(25),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    },
});