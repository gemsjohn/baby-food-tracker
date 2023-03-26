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

export const HomeScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);
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
    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

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
    const { top_100_Filtered } = useCheckUserTop100();


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
            getTotalCalorieCount()

            if (mainState.current.triggerRefresh) {
                setRefreshing(true)
                refetch()
            } else {
                setRefreshing(false)
            }

            if (mainState.current.selectedFood_Quantity != null && mainState.current.selectedFood_Measurement != null && mainState.current.selectedFood_Schedule != null && mainState.current.selectedFood_Emotion != null) {
                setSelectedFoodDataEntrered(true)
            } else {
                setSelectedFoodDataEntrered(false)

            }
        }, 200)
    }, [])


    useEffect(() => {
        setCurrentDateReadable(convertDateFormat(currentDate));
    }, [currentDate])

    const handleSearch = async (input) => {
        setClearSuggestions(true)
        console.log(`Searching for: ${searchQuery}`);
        console.log(`Searching for: ${input}`);

        setDisplayLoading(true)
        const data = {
            search: input ? input : searchQuery
        };

        const prompt = encodeURIComponent(JSON.stringify(data));

        const config = {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            url: `${GLOBAL_GRAPHQL_API_URL}/query-usda/${prompt}`
        }

        axios(config)
            .then((response) => {
                if (response.data.result[0] === "ERROR") {
                    console.log("ERROR")
                } else {
                    setFoodData(response.data.result);
                    setDisplayLoading(false)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getNutritionValue = async (input) => {
        setRefreshing_Nutrition(true)
        console.log('# - INPUT: ')
        console.log(input)
        console.log(typeof input)

        const data = {
            search: input,
            quantity: mainState.current.selectedFood_Quantity,
            measurement: mainState.current.selectedFood_Measurement,
            emotion: mainState.current.selectedFood_Emotion
        };

        if (recentFoodData != [] && selectRecentlyUsed != null && recentFoodData[selectRecentlyUsed].number == data.quantity && recentFoodData[selectRecentlyUsed].measurement == data.measurement) {
            console.log("# - getNutritionValue / recentFoodData[selectRecentlyUsed]")
            const nutrients_JSON = JSON.stringify(recentFoodData[selectRecentlyUsed].nutrients);
            console.log(input)
            console.log(data.search)
            const updateUserEntry = async () => {
                await addEntry({
                    variables: {
                        date: `${currentDateReadable}`,
                        schedule: `${mainState.current.selectedFood_Schedule}`,
                        item: `${recentFoodData[selectRecentlyUsed].item}`,
                        amount: `${mainState.current.selectedFood_Quantity} ${mainState.current.selectedFood_Measurement}`,
                        emotion: `${mainState.current.selectedFood_Emotion}`,
                        nutrients: `${nutrients_JSON}`
                    }
                });
                onRefresh();
            }
            updateUserEntry();
        } else {
            console.log("# - getNutritionValue / newFoodData")

            const prompt = encodeURIComponent(JSON.stringify(data));

            const config = {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                url: `${GLOBAL_GRAPHQL_API_URL}/api/npc/${prompt}`
            }

            axios(config)
                .then((response) => {
                    if (response.data.result[0] === "ERROR") {
                        console.log("ERROR")
                    } else {
                        const removeQuotes = (str) => {
                            return str.replace(/^"(.*)"$/, '$1');
                        }
                        console.log("# - getNutritionvalue:")
                        console.log(mainState.current.selectedFood_Quantity)
                        console.log(mainState.current.selectedFood_Measurement)
                        console.log(mainState.current.selectedFood_Schedule)
                        console.log(mainState.current.selectedFood_Emotion)
                        console.log("# --------------------------------------")

                        let nutrients_JSON = JSON.stringify(response.data.result);
                        console.log(nutrients_JSON)
                        
                        nutrients_JSON = removeQuotes(nutrients_JSON)
                        if (nutrients_JSON == "not found") {
                            setDisplayChooseAnotherOptionModal(true)
                            console.log("Choose Another Option!!")
                            onRefresh();
                        } else {
                            const updateUserEntry = async () => {

                                let itemData = input.description;
    
                                if (input.description == undefined && recentFoodData[selectRecentlyUsed].item != '') {
                                    itemData = recentFoodData[selectRecentlyUsed].item;
                                }
    
                                await addEntry({
                                    variables: {
                                        date: `${currentDateReadable}`,
                                        schedule: `${mainState.current.selectedFood_Schedule}`,
                                        item: `${itemData}`,
                                        amount: `${mainState.current.selectedFood_Quantity} ${mainState.current.selectedFood_Measurement}`,
                                        emotion: `${mainState.current.selectedFood_Emotion}`,
                                        nutrients: `${nutrients_JSON}`
                                    }
                                });
                                onRefresh();
                            }
                            updateUserEntry();
                        }
                        
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

        }



    };

    const RecentFood = () => {
        setRecentFoodData([])
        setSelectRecentlyUsed(null)
        const data = userByID?.user.tracker;
        const data_array = data.slice(-5);

        for (let i = 0; i < data_array.length; i++) {
            function removeBackslashes(str) {
                let pattern = /(?<!\\)\\(?!\\)/g;
                let replacement = '';
                let updatedStr = str.replace(pattern, replacement);

                return updatedStr;
            }

            const removeQuotes = (str) => {
                return str.replace(/^"(.*)"$/, '$1');
            }

            let item = JSON.stringify(data_array[i].entry[0].item);
            item = removeQuotes(item);
            let amount = JSON.stringify(data_array[i].entry[0].amount);
            amount = removeQuotes(amount)
            let emotion = JSON.stringify(data_array[i].entry[0].emotion);
            emotion = removeQuotes(emotion)
            // console.log(emotion)

            const codePoints = emotion
                .split('')
                .map(char => char.charCodeAt(0).toString(16).padStart(4, '0'));
            const unicodeEscape = '\\u' + codePoints.join('\\u');
            // console.log(unicodeEscape); // should output '\uD83D\uDE00'




            let nutrients = JSON.stringify(data_array[i].entry[0].nutrients);
            nutrients = removeBackslashes(nutrients)
            nutrients = removeQuotes(nutrients)
            nutrients = JSON.parse(nutrients)
            let id = data_array[i]._id;

            function separateMeasurement(inputString) {
                const regex = /(\d+\.\d+|\d+)\s*(\w+)/;
                const matches = inputString.match(regex);

                if (matches && matches.length === 3) {
                    const number = parseFloat(matches[1]);
                    const measurement = matches[2];

                    return { number, measurement };
                }

                return null;
            }

            const result = separateMeasurement(amount);

            let item_amount = { item: item, amount: amount, number: result.number, measurement: result.measurement, emotion: unicodeEscape, nutrients: nutrients, id: id }
            setRecentFoodData(prev => [...prev, item_amount])
        }
    }

    const renderItem = ({ item }) => {
        return (
            <>

                {item.description != '' &&
                    <View
                        style={styles.renderItem_Search_Results}
                        key={item.fdcId}
                    >
                        {displayDetails ?
                            <SelectedFoodDetails />
                            :
                            <>
                                <View style={styles.renderItem_Search_Result_Container}>
                                    <Text
                                        style={styles.renderItem_Search_Result_Container_Text}
                                        allowFontScaling={false}
                                    >
                                        {item.description}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedItem(item);
                                        setDisplayDetails(true)
                                    }}
                                    style={{ ...styles.renderItem_Search_Result_Container_Plus, ...styles.button_Drop_Shadow }}
                                >
                                    <Text style={styles.renderItem_Search_Result_Container_Plus_Text}>
                                        +
                                    </Text>
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                }
            </>
        );
    };

    const getTotalCalorieCount = async () => {
        try {
            const value = await AsyncStorage.getItem('@TotalCalorieCount')
            if (value !== null) {
                // value previously stored
                setTotalCalorieCount(value)
                setTimeout(() => {
                    setLoading(false)
                }, 100)
            }
        } catch (e) {
            // error reading value
        }
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
                                    setLoading(true);
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
                                            setLoading(true)
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
                                    setLoading(true);
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

                        {!refreshing && !refreshing_Nutrition ?
                            <>
                                <Image
                                    source={require('../../assets/pattern_1.png')}
                                    style={styles.homePrimary_Pattern_1}
                                />


                                <View style={{ flexDirection: 'row', marginTop: HeightRatio(30) }}>
                                    <View
                                        style={{
                                            ...styles.homePrimary_TotalCalories,
                                            width: windowWidth / 5,
                                            height: windowWidth / 5,
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Text style={styles.homePrimary_TotalCalories_Text}>
                                            {totalCalorieCount}
                                        </Text>
                                        <Text
                                            style={{
                                                ...styles.homePrimary_TotalCalories_Text,
                                                fontSize: HeightRatio(15),
                                            }}
                                            allowFontScaling={false}
                                        >
                                            CALORIES
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setMetricsModalVisible(true);
                                        }}
                                    >
                                        <View
                                            style={{
                                                ...styles.homePrimary_Add_Button,
                                                ...styles.button_Drop_Shadow,
                                                width: windowWidth / 5,
                                                height: windowWidth / 5

                                            }}
                                        >
                                            <View
                                                style={{ flexDirection: 'column' }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faSolid, faChartSimple}
                                                    style={{ color: THEME_FONT_COLOR_BLACK, alignSelf: 'center' }}
                                                    size={25}
                                                />
                                                <Text
                                                    style={{
                                                        ...styles.renderItem_Search_Result_Container_Text,
                                                        color: THEME_FONT_COLOR_BLACK,
                                                        fontSize: HeightRatio(20),
                                                        fontFamily: "SofiaSansSemiCondensed-Regular",
                                                        marginTop: HeightRatio(10)
                                                    }}
                                                    allowFontScaling={false}
                                                >
                                                    Metrics
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setDisplayTop100Foods(true);
                                            setClearSuggestions(false)
                                            RecentFood()
                                            setModalVisible(true);
                                            setSearchQuery('');
                                            setSelectedItem(null);
                                            setDisplayDetails(false);
                                            setFoodData([]);
                                            setMainState({
                                                selectedFood_Quantity: null,
                                                selectedFood_Measurement: null,
                                                selectedFood_Schedule: null,
                                                selectedFood_Emotion: null
                                            })
                                        }}
                                    >
                                        <View
                                            style={{
                                                ...styles.homePrimary_Add_Button,
                                                ...styles.button_Drop_Shadow,
                                                width: windowWidth / 5,
                                                height: windowWidth / 5

                                            }}
                                        >
                                            <View
                                                style={{ flexDirection: 'column' }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faSolid, faStar}
                                                    style={{ color: THEME_FONT_COLOR_BLACK, alignSelf: 'center' }}
                                                    size={25}
                                                />
                                                <Text
                                                    style={{
                                                        ...styles.renderItem_Search_Result_Container_Text,
                                                        color: THEME_FONT_COLOR_BLACK,
                                                        fontSize: HeightRatio(20),
                                                        fontFamily: "SofiaSansSemiCondensed-Regular",
                                                        textAlign: 'center',
                                                        marginTop: HeightRatio(10)
                                                    }}
                                                    allowFontScaling={false}
                                                >
                                                    Top 100
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {/* Add Button */}
                                    <TouchableOpacity
                                        onPress={() => {
                                            setClearSuggestions(false)
                                            RecentFood()
                                            setModalVisible(true);
                                            setSearchQuery('');
                                            setSelectedItem(null);
                                            setDisplayDetails(false);
                                            setFoodData([]);
                                            setMainState({
                                                selectedFood_Quantity: null,
                                                selectedFood_Measurement: null,
                                                selectedFood_Schedule: null,
                                                selectedFood_Emotion: null
                                            })
                                        }}
                                        style={{
                                            ...styles.homePrimary_Add_Button,
                                            ...styles.button_Drop_Shadow,
                                            width: windowWidth / 5,
                                            height: windowWidth / 5
                                        }}
                                    >
                                        <View
                                            style={{ flexDirection: 'column' }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faSolid, faPlus}
                                                style={{ color: THEME_FONT_COLOR_BLACK, alignSelf: 'center' }}
                                                size={25}
                                            />
                                            <Text
                                                style={{
                                                    ...styles.homePrimary_Add_Button_Text,
                                                    marginTop: HeightRatio(10)
                                                }}
                                                allowFontScaling={false}
                                            >
                                                ADD
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/* <DailySchedule date={currentDateReadable} userID={mainState.current.userID} /> */}
                                <DailyScheduleSimplified
                                    date={currentDateReadable}
                                    userID={mainState.current.userID}
                                    containerHeight={HeightRatio(450)}
                                    from={"main"}
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


                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        style={{
                            width: windowWidth,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setDisplayTop100Foods(true);
                            }}
                        >
                            <View
                                style={{
                                    ...styles.modalVisible_Container,
                                    ...styles.button_Drop_Shadow,
                                    backgroundColor: THEME_COLOR_ATTENTION,
                                    margin: HeightRatio(5),
                                    width: windowWidth - HeightRatio(30),

                                }}
                            >
                                <View
                                    style={{}}
                                >
                                    {!displayTop100Foods ?
                                        <Text
                                            style={{
                                                ...styles.renderItem_Search_Result_Container_Text,
                                                color: THEME_FONT_COLOR_BLACK,
                                                fontSize: HeightRatio(30),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                            }}
                                        >
                                            See Top 100 Foods!
                                        </Text>
                                        :
                                        <Text
                                            style={{
                                                ...styles.renderItem_Search_Result_Container_Text,
                                                color: THEME_FONT_COLOR_BLACK,
                                                fontSize: HeightRatio(30),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                            }}
                                        >
                                            Top 100 Foods
                                        </Text>
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                        {!displayTop100Foods &&
                            <View style={styles.modalVisible_Container}>
                                <Image
                                    source={require('../../assets/pattern_1.png')}
                                    style={{
                                        ...styles.homePrimary_Pattern_1,
                                        margin: HeightRatio(20),
                                        borderRadius: HeightRatio(10)
                                    }}
                                />
                                <TextInput
                                    type="text"
                                    name="search"
                                    placeholder="Search for food"
                                    placeholderTextColor="white"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    onSubmitEditing={handleSearch}
                                    style={styles.modalVisible_TextInput}
                                    disableFullscreenUI={true}
                                    allowFontScaling={false}
                                />
                                <TouchableOpacity onPress={() => { handleSearch() }}>
                                    <View style={{ ...styles.modalVisible_Search_Button, ...styles.button_Drop_Shadow }}>
                                        <Text
                                            style={styles.modalVisible_Search_Button_Text}
                                            allowFontScaling={false}
                                        >
                                            Search
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }

                        {displayTop100Foods &&
                            <View
                                style={{
                                    ...styles.modalVisible_Container,
                                    height: windowHeight / 1.2
                                }}
                            >
                                <Image
                                    source={require('../../assets/pattern_1.png')}
                                    style={{
                                        ...styles.homePrimary_Pattern_1,
                                        margin: HeightRatio(20),
                                        alignSelf: 'center'
                                    }}
                                />
                                <SafeAreaView
                                    style={{
                                        alignSelf: 'center',
                                        height: '80%',
                                    }}
                                >
                                    <ScrollView
                                        style={{
                                            alignSelf: 'center',
                                        }}
                                    >
                                        <View>
                                            {top_100_Filtered.map((data, index) => (
                                                <View
                                                    style={{
                                                        ...styles.renderItem_Search_Results,
                                                        justifyContent: 'space-between',
                                                    }}
                                                    key={index}
                                                >

                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text
                                                            style={{
                                                                ...styles.renderItem_Search_Result_Container_Text,
                                                                color: data.tried ? THEME_FONT_COLOR_WHITE_LOW_OPACITY : THEME_FONT_COLOR_WHITE,
                                                            }}
                                                        >
                                                            {data.name}

                                                        </Text>
                                                        {data.tried &&
                                                            <FontAwesomeIcon
                                                                icon={faSolid, faCheck}
                                                                style={{ color: THEME_COLOR_POSITIVE, marginLeft: HeightRatio(10) }}
                                                                size={20}
                                                            />
                                                        }
                                                    </View>
                                                    <TouchableOpacity
                                                        // onPress={() => { setSelectRecentlyUsed(index); setSelectRecentlyUsedData(data); }}
                                                        onPress={() => {
                                                            setSearchQuery(data.name)
                                                            setDisplayTop100Foods(false)
                                                            handleSearch(data.name);
                                                        }}
                                                        style={{ ...styles.modalVisible_recentFoodData_Map_Plus, ...styles.button_Drop_Shadow }}
                                                    >
                                                        <Text style={styles.modalVisible_recentFoodData_Map_Plus_Text}>
                                                            +
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ))}

                                        </View>
                                    </ScrollView>
                                </SafeAreaView>
                                <TouchableOpacity onPress={() => setDisplayTop100Foods(false)}>
                                    <View
                                        style={{
                                            ...styles.modalVisible_FullButton,
                                            ...styles.button_Drop_Shadow,
                                            marginTop: HeightRatio(30)
                                        }}
                                    >
                                        <Text
                                            style={{ ...styles.modalVisible_Button_Text, color: THEME_FONT_COLOR_WHITE }}
                                            allowFontScaling={false}
                                        >
                                            Back
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }

                        {!displayTop100Foods &&
                            <View
                                style={{
                                    ...styles.modalVisible_Container,
                                    height: windowHeight / 1.7,
                                    margin: HeightRatio(0)
                                }}
                            >
                                <Image
                                    source={require('../../assets/pattern_1.png')}
                                    style={{
                                        ...styles.homePrimary_Pattern_1,
                                        margin: HeightRatio(20),
                                        alignSelf: 'center'
                                    }}
                                />

                                {!clearSuggestions && !searchQuery &&
                                    <>
                                        <View style={styles.modalVisible_Title_Container}>
                                            <Text
                                                style={styles.modalVisible_Title_Container_Text}
                                                allowFontScaling={false}
                                            >
                                                Recently Used
                                            </Text>
                                        </View>
                                        <SafeAreaView style={styles.container}>
                                            <ScrollView style={styles.scrollView}>
                                                <View>
                                                    {recentFoodData.map((data, index) => (
                                                        <View key={index}>
                                                            {selectRecentlyUsed == null ?

                                                                <View style={styles.modalVisible_recentFoodData_Map_Container_0}>
                                                                    <View style={styles.modalVisible_recentFoodData_Map_Container_1}>
                                                                        <View style={styles.modalVisible_recentFoodData_Map_Container_2}>
                                                                            <View style={{ flexDirection: 'column' }}>
                                                                                <View>
                                                                                    <Text style={styles.modalVisible_recentFoodData_Map_Text_Bold}>
                                                                                        {data.item}
                                                                                    </Text>
                                                                                </View>
                                                                                <View style={{ marginLeft: HeightRatio(5) }}>
                                                                                    <Text style={styles.modalVisible_recentFoodData_Map_Text_Regular}>
                                                                                        {data.amount}
                                                                                    </Text>
                                                                                </View>
                                                                            </View>
                                                                            <TouchableOpacity
                                                                                onPress={() => { setSelectRecentlyUsed(index); setSelectRecentlyUsedData(data); }}
                                                                                style={{ ...styles.modalVisible_recentFoodData_Map_Plus, ...styles.button_Drop_Shadow }}
                                                                            >
                                                                                <Text style={styles.modalVisible_recentFoodData_Map_Plus_Text}>
                                                                                    +
                                                                                </Text>
                                                                            </TouchableOpacity>
                                                                        </View>

                                                                    </View>
                                                                </View>
                                                                :
                                                                <>
                                                                    {selectRecentlyUsed == index &&
                                                                        <>
                                                                            <View style={styles.modalVisible_recentFoodData_Map_Container_0}>
                                                                                <Text
                                                                                    style={styles.modalVisible_recentFoodData_Map_Container_0_RecentlyUsed_Text}
                                                                                    allowFontScaling={false}
                                                                                >
                                                                                    {data.item}
                                                                                </Text>
                                                                                <SelectedFoodDetails textInputValue={`${data.number}`} selectedItem={`${data.measurement}`} selectedEmotion={`${data.emotion}`} />
                                                                            </View>
                                                                            <TouchableOpacity
                                                                                onPress={() => {
                                                                                    setSelectRecentlyUsed(null)
                                                                                    setSelectRecentlyUsedData(null)
                                                                                }}
                                                                                style={{ ...styles.modalVisible_faX, ...styles.button_Drop_Shadow }}
                                                                            >
                                                                                <FontAwesomeIcon
                                                                                    icon={faSolid, faX}
                                                                                    style={{ color: THEME_FONT_COLOR_WHITE }}
                                                                                    size={20}
                                                                                />
                                                                            </TouchableOpacity>
                                                                        </>
                                                                    }
                                                                </>
                                                            }
                                                        </View>
                                                    ))}
                                                </View>
                                            </ScrollView>
                                        </SafeAreaView>
                                    </>
                                }

                                {foodData != [] &&
                                    <View style={{ flex: 1 }}>
                                        {displayLoading ?
                                            <ActivityIndicator size={200} />
                                            :
                                            <>
                                                {displayDetails &&
                                                    <>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setSelectedItem(null);
                                                                setDisplayDetails(false)
                                                            }}
                                                            style={{
                                                                ...styles.modalVisible_faX,
                                                                ...styles.button_Drop_Shadow,
                                                                right: HeightRatio(-25),
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faSolid, faX}
                                                                style={{ color: THEME_FONT_COLOR_WHITE }}
                                                                size={20}
                                                            />
                                                        </TouchableOpacity>
                                                    </>
                                                }

                                                <FlatList
                                                    data={selectedItem ? [selectedItem] : foodData}
                                                    renderItem={renderItem}
                                                    keyExtractor={(item) => item.fdcId.toString()}
                                                />
                                            </>
                                        }
                                    </View>
                                }

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignSelf: 'center'
                                    }}
                                >
                                    {selectedFoodDataEntrered ?
                                        <>
                                            <TouchableOpacity onPress={() => { setModalVisible(false); }}>
                                                <View
                                                    style={{
                                                        ...styles.modalVisible_HalfButton,
                                                        ...styles.button_Drop_Shadow,
                                                        backgroundColor: THEME_COLOR_NEGATIVE
                                                    }}
                                                >
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
                                                    getNutritionValue(selectedItem == null && selectRecentlyUsedData.item != null ? selectRecentlyUsedData.item : selectedItem); // selectedItem == null && recentFoodData.item != null ? recentFoodData.item : selectedItem
                                                    setModalVisible(false);
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        ...styles.modalVisible_HalfButton,
                                                        ...styles.button_Drop_Shadow,
                                                        backgroundColor: THEME_COLOR_POSITIVE
                                                    }}
                                                >
                                                    <Text
                                                        style={styles.modalVisible_Button_Text}
                                                        allowFontScaling={false}
                                                    >
                                                        Save
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <TouchableOpacity onPress={() => setModalVisible(false)}>
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

                            </View>
                        }

                    </Modal>

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
                                    {/* calendarModalFoods */}
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
                    </Modal>

                    <Modal
                        visible={metricsModalVisible}
                        animationType="slide"
                        transparent={true}
                        style={{
                            width: windowWidth,
                        }}
                    >
                        <View style={styles.modalVisible_Container}>
                            <View 
                                style={{
                                    flexDirection: 'row',
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
                                    style={{ ...styles.modalVisible_Button_Text, color: THEME_FONT_COLOR_WHITE }}
                                    allowFontScaling={false}
                                >
                                    Metrics: Under Construction
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    setMetricsModalVisible(false);
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
                    </Modal>

                    {/* displayChooseAnotherOptionModal */}

                    <Modal
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
                    </Modal>




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
        padding: HeightRatio(10),
        alignSelf: 'center',
        width: windowWidth - WidthRatio(100),
        marginTop: HeightRatio(10),
    },
    modalVisible_Title_Container_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(30),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular'
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
        fontSize: HeightRatio(25),
        fontFamily: "SofiaSansSemiCondensed-ExtraBold"
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