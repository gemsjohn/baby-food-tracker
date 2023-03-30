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
    faTriangleExclamation
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
import { GLOBAL_GRAPHQL_API_URL } from '../../App'
import { convertDateFormat } from './auxilliary/ConvertDateFormat';
import { SelectedFoodDetails } from './auxilliary/SelectedFoodDetails';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_ENTRY } from '../../utils/mutations';
import { GET_USER_BY_ID } from '../../utils/queries';
import { DailySchedule } from './auxilliary/DailySchedule';
import { Loading } from '../../components/Loading';
import { Calendar } from 'react-native-calendars';
import { usePullDailyContent } from './auxilliary/PullDailyContent';
import { top_100 } from './auxilliary/TOP_100';
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
import { FoodGroupMetrics } from './auxilliary/metrics/FoodGroupMetrics';
import { AllergyTracking } from './auxilliary/metrics/AllergyTracking';
import { SwipeableViews } from './auxilliary/metrics';
import { Metrics_Primary } from './auxilliary/metrics/Metrics_Primary';
import { Calories_Primary } from './auxilliary/calories/Calories_Primary';
import { Add_Primary } from './auxilliary/add/Add_Primary';
import { Add_Subuser_Modal } from './auxilliary/add/Add_Subuser_Modal';

export const HomeScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    const [loading, setLoading] = useState(false);
    const [displayUsername, setDisplayUsername] = useState(false);
    const authState = useRef(false);
    const userID = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshing_Nutrition, setRefreshing_Nutrition] = useState(false);
    const [recentFoodData, setRecentFoodData] = useState([])
    const [clearSuggestions, setClearSuggestions] = useState(false)
    const [selectRecentlyUsed, setSelectRecentlyUsed] = useState(null)
    const [totalCalorieCount, setTotalCalorieCount] = useState(null)
    const [selectRecentlyUsedData, setSelectRecentlyUsedData] = useState(null)
    const [selectedFoodDataEntrered, setSelectedFoodDataEntrered] = useState(false);
    const [displayTop100Foods, setDisplayTop100Foods] = useState(false)
    const [metricsModalVisible, setMetricsModalVisible] = useState(false)
    const [displayChooseAnotherOptionModal, setDisplayChooseAnotherOptionModal] = useState(false)

    const onRefresh = useCallback(() => {
        setLoading(true)
        refetch();
        setRefreshing(true);
        setRefreshing_Nutrition(true)
        setTimeout(() => {
            setRefreshing(false);
            setRefreshing_Nutrition(false)
        }, 2000);
    }, []);

    const [addEntry] = useMutation(ADD_ENTRY);


    // # - DATE
    const formatString = 'DD/MM/YYYY';
    const [currentDate, setCurrentDate] = useState(moment().format(formatString));
    const [currentDateReadable, setCurrentDateReadable] = useState('')

    //  # - Calendar
    const [calendarModalVisible, setCalendarModalVisible] = useState(false);
    const [selectedCalendarModalDate, setSelectedCalendarModalDate] = useState('');
    const [selectedDateFromCalendar, setSelectedDateFromCalendar] = useState(null)

    const onDateSelect = (day) => {
        const selectedDate = moment(day.dateString).format(formatString); // convert date to desired format
        setSelectedCalendarModalDate(day.dateString);
        setSelectedDateFromCalendar(selectedDate);
        // setCurrentDate(selectedDate); // update current date with formatted date
    };

    const { calendarModalCalorieTotal, calendarModalDate, calendarModalFoods, calendarModalEmotion } = usePullDailyContent(`${convertDateFormat(selectedDateFromCalendar)}`);
    const { top_100_Filtered } = useCheckUserTop100(userByID?.user);


    // # - ADD FOOD
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [foodData, setFoodData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [displayDetails, setDisplayDetails] = useState(false);
    const [displayLoading, setDisplayLoading] = useState(false);

    const handlePreviousDay = () => {
        setCurrentDate(moment(currentDate, formatString).subtract(1, 'days').format(formatString));
    }

    const handleNextDay = () => {
        setCurrentDate(moment(currentDate, formatString).add(1, 'days').format(formatString));
    }

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            authState.current = mainState.current.authState
            userID.current = mainState.current.userID;

            setTimeout(() => {
                setLoading(false)
            }, 500)
        }, 500)

        setInterval(() => {
            // getTotalCalorieCount()

            if (mainState.current.triggerRefresh) {
                setRefreshing(true)
                refetch()
            } else {
                setRefreshing(false)
            }

            if (
                mainState.current.selectedFood_Quantity != null &&
                mainState.current.selectedFood_Measurement != null &&
                mainState.current.selectedFood_Schedule != null &&
                mainState.current.selectedFood_Schedule_Base != null &&
                mainState.current.selectedFood_Emotion != null &&
                mainState.current.selectedFood_Allergy != null
            ) {
                if (
                    mainState.current.selectedFood_Schedule_Base == 'Custom' &&
                    mainState.current.selectedFood_Schedule_Hour != null &&
                    mainState.current.selectedFood_Schedule_Minute != null &&
                    mainState.current.selectedFood_Schedule_AMPM != null &&
                    mainState.current.selectedFood_Schedule_Custom_Time != null
                ) {
                    setSelectedFoodDataEntrered(true)
                } else if (mainState.current.selectedFood_Schedule_Base != 'Custom') {
                    setSelectedFoodDataEntrered(true)
                }
            } else {
                setSelectedFoodDataEntrered(false)

            }
        }, 200)
    }, [])


    useEffect(() => {
        setCurrentDateReadable(convertDateFormat(currentDate));
    }, [currentDate])





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

    const storeCustomScheduleTime = async () => {
        try {
            const jsonValue = JSON.stringify(null);
            await AsyncStorage.setItem('@storeCustomScheduleTime', jsonValue)
        } catch (e) {
            // saving error
        }
    }

    return (
        <>
            {!loading ?
                <>
                    {refreshing || refreshing_Nutrition &&
                        <View style={styles.updatingScreen_Container}>
                            <Text
                                style={styles.updatingScreen_Container_Text}
                                allowFontScaling={false}
                            >
                                Updating...
                            </Text>
                        </View>
                    }
                    {modalVisible && <View style={styles.modalVisible_Blackout} />}
                    {calendarModalVisible && <View style={styles.modalVisible_Blackout} />}
                    {metricsModalVisible && <View style={styles.modalVisible_Blackout} />}
                    <View
                        style={styles.homePrimary_Container}
                        onLayout={onLayoutRootView}
                    >
                        <View style={styles.homePrimary_Date}>
                            <TouchableOpacity
                                onPress={() => {
                                    handlePreviousDay();
                                    // setLoading(true);
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
                                    onPress={() => setCalendarModalVisible(true)}
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
                                            // setLoading(true)
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
                                    // setLoading(true);
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

                        {/* / */}
                        {userByID?.user.subuser &&
                            <Text
                                style={{
                                    color: THEME_FONT_COLOR_BLACK,
                                    textAlign: 'center',
                                    fontSize: HeightRatio(20),
                                    fontFamily: "SofiaSansSemiCondensed-ExtraBold",
                                    marginTop: HeightRatio(10)
                                }}
                                allowFontScaling={false}
                            >
                                {userByID?.user.subuser[0].subusername}
                            </Text>
                        }

                        {!refreshing && !refreshing_Nutrition ?
                            <>
                                <Image
                                    source={require('../../assets/pattern_1.png')}
                                    style={styles.homePrimary_Pattern_1}
                                />


                                <View style={{ flexDirection: 'row', marginTop: HeightRatio(30) }}>
                                    <Calories_Primary />

                                    {userByID?.user.premium &&
                                        <Metrics_Primary
                                            subuser={userByID?.user.subuser[0]}
                                            currentDateReadable={currentDateReadable}
                                        />
                                    }

                                    <Add_Primary
                                        date={currentDateReadable}
                                        subuser={userByID?.user.subuser[0]}
                                    />
                                </View>
                                <DailyScheduleSimplified
                                    date={currentDateReadable}
                                    userID={mainState.current.userID}
                                    containerHeight={HeightRatio(450)}
                                    from={"main"}
                                    subuser={userByID?.user.subuser[0]}
                                />
                                <View style={{ flexDirection: 'row' }}>


                                </View>

                            </>
                            :
                            <View style={styles.updatingScreen_Container}>
                                <Text
                                    style={styles.updatingScreen_Container_Text}
                                    allowFontScaling={false}
                                >
                                    Updating...
                                </Text>
                            </View>
                        }
                    </View>


                    <Add_Subuser_Modal
                        subuser={userByID?.user.subuser[0]}
                    />



                    {/* <Modal
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
                                        setSelectedCalendarModalDate('')
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
                                        <View style={{ ...styles.homePrimary_TotalCalories, backgroundColor: THEME_TRANSPARENT, }}>
                                            <Text
                                                style={{ ...styles.homePrimary_TotalCalories_Text, fontSize: HeightRatio(20), color: THEME_FONT_COLOR_WHITE }}
                                                allowFontScaling={false}
                                            >
                                                {calendarModalCalorieTotal} CALORIES
                                            </Text>
                                        </View>
                                    </View>
                                    <DailyScheduleSimplified
                                        date={calendarModalDate}
                                        userID={mainState.current.userID}
                                        from={"modal"}
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
                    </Modal> */}

                    {/* <Modal
                        visible={displayChooseAnotherOptionModal}
                        animationType="slide"
                        transparent={true}
                        style={{
                            width: windowWidth,
                        }}
                    >
                        <View style={styles.modalVisible_Container}>
                            <View
                                style={{
                                    flexDirection: 'column',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faTriangleExclamation}
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        marginRight: HeightRatio(20)
                                    }}
                                    size={30}
                                />
                                <Text
                                    style={{ ...styles.modalVisible_Button_Text, color: THEME_FONT_COLOR_WHITE, margin: HeightRatio(20) }}
                                    allowFontScaling={false}
                                >
                                    Nutritional details for that item cannot be found. Choose another similar option.
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    setDisplayChooseAnotherOptionModal(false);
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

                        </View>
                    </Modal> */}




                </>
                :
                <View style={styles.loading_Container}>
                    <Loading />
                </View>
            }
            {!modalVisible &&
                <Navbar nav={navigation} auth={mainState.current.authState} position={'absolute'} from={'home'} />
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
        fontFamily: 'SofiaSansSemiCondensed-Regular',
        marginLeft: HeightRatio(10),
        marginRight: HeightRatio(10)
    },
    homePrimary_Date_Return_Button: {
        backgroundColor: THEME_COLOR_NEGATIVE,
        borderRadius: HeightRatio(10),
        position: 'absolute',
        alignSelf: 'center',
        top: HeightRatio(65),
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
        backgroundColor: THEME_COLOR_BLACKOUT,
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
    }
});