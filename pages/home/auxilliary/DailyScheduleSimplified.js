import { useEffect, useState, useContext, useRef, useCallback, useLayoutEffect } from 'react';
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
    StatusBar
} from 'react-native';
import {
    faSolid,
    faFlagCheckered,
    faSliders,
    faX,
    faArrowRight,
    faArrowLeft,
    faPlus,
    faBars
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeightRatio, windowWidth, WidthRatio } from "../../../Styling"
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_ENTRY } from '../../../utils/mutations';
import { GET_USER_BY_ID } from '../../../utils/queries';
import { MainStateContext } from '../../../App';
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
} from '../../../COLOR';
import { usePullDailyContent } from './PullDailyContent';
import { convertDateFormat } from './ConvertDateFormat';


export const DailyScheduleSimplified = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [matchingDate, setMatchingDate] = useState([]);
    const { calendarModalCalorieTotal, calendarModalDate, calendarModalFoods, calendarModalEmotion } = usePullDailyContent(props.date);
    const [displayTop100Foods, setDisplayTop100Foods] = useState(false)


    // Schedule Arrays
    const [firstThing, setFirstThing] = useState([]);
    const [firstThingCalTotal, setFirstThingCalTotal] = useState(null)
    const [firstThingData, setFirstThingData] = useState([]);
    const [displayFirstThingNutrients, setDisplayFirstThingNutrients] = useState(false);
    const [displayFirstThingNutrientsForIndex, setDisplayFirstThingNutrientsForIndex] = useState(null)
    const [displaBool_FirstThing, setDisplaBool_FirstThing] = useState(false);

    const [breakfast, setBreakfast] = useState([]);
    const [breakfastCalTotal, setBreakfastCalTotal] = useState(null)
    const [breakfastData, setBreakfastData] = useState([]);
    const [displayBreakfastNutrients, setDisplayBreakfastNutrients] = useState(false);
    const [displayBreakfastNutrientsForIndex, setDisplayBreakfastNutrientsForIndex] = useState(null)
    const [displaBool_Breakfast, setDisplaBool_Breakfast] = useState(false);

    const [midmorning, setMidmorning] = useState([]);
    const [midmorningCalTotal, setMidmorningCalTotal] = useState(null)
    const [midmorningData, setMidmorningData] = useState([]);
    const [displayMidmorningNutrients, setDisplayMidmorningNutrients] = useState(false);
    const [displayMidmorningNutrientsForIndex, setDisplayMidmorningNutrientsForIndex] = useState(null)
    const [displaBool_Midmorning, setDisplaBool_Midmorning] = useState(false);

    const [lunch, setLunch] = useState([]);
    const [lunchCalTotal, setLunchCalTotal] = useState(null)
    const [lunchData, setLunchData] = useState([]);
    const [displayLunchNutrients, setDisplayLunchNutrients] = useState(false);
    const [displayLunchNutrientsForIndex, setDisplayLunchNutrientsForIndex] = useState(null)
    const [displaBool_Lunch, setDisplaBool_Lunch] = useState(false);

    const [afternoon, setAfternoon] = useState([]);
    const [afternoonCalTotal, setAfternoonCalTotal] = useState(null)
    const [afternoonData, setAfternoonData] = useState([]);
    const [displayAfternoonNutrients, setDisplayAfternoonNutrients] = useState(false);
    const [displayAfternoonNutrientsForIndex, setDisplayAfternoonNutrientsForIndex] = useState(null)
    const [displaBool_Afternoon, setDisplaBool_Afternoon] = useState(false);

    const [dinner, setDinner] = useState([]);
    const [dinnerCalTotal, setDinnerCalTotal] = useState(null)
    const [dinnerData, setDinnerData] = useState([]);
    const [displayDinnerNutrients, setDisplayDinnerNutrients] = useState(false);
    const [displayDinnerNutrientsForIndex, setDisplayDinnerNutrientsForIndex] = useState(null)
    const [displaBool_Dinner, setDisplaBool_Dinner] = useState(false);

    const [beforeBed, setBeforeBed] = useState([]);
    const [beforeBedCalTotal, setBeforeBedCalTotal] = useState(null)
    const [beforeBedData, setBeforeBedData] = useState([]);
    const [displayBeforeBedNutrients, setDisplayBeforeBedNutrients] = useState(false);
    const [displayBeforeBedNutrientsForIndex, setDisplayBeforeBedNutrientsForIndex] = useState(null)
    const [displaBool_BeforeBed, setDisplaBool_BeforeBed] = useState(false);

    const [deleteID, setDeleteID] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [uniqueEmotionArray, setUniqueEmotionArray] = useState([])
    const [dailyEntries, setDailyEntries] = useState([])

    const [deleteEntry] = useMutation(DELETE_ENTRY)
    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    const getTrackerEntryByDate = (date) => {
        refetch()
        setMatchingDate([])

        if (userByID?.user.tracker != []) {
            for (let i = 0; i < userByID?.user.tracker.length; i++) {
                if (userByID?.user.tracker[i].date == date) {
                    setMatchingDate(prev => [...prev, userByID?.user.tracker[i]]);
                }
            }
        }

    }
    useEffect(() => {
        console.log('# --------------------------------------')
        console.log('# - Date: ' + props.date)
        console.log("# - Clear everything")
        setFirstThing([])
        setBreakfast([])
        setMidmorning([])
        setLunch([])
        setAfternoon([])
        setDinner([])
        setBeforeBed([])
        setFirstThingData([])
        setBreakfastData([])
        setMidmorningData([])
        setLunchData([])
        setAfternoonData([])
        setDinnerData([])
        setBeforeBedData([])
        getTrackerEntryByDate(props.date)

    }, [props.date])

    useEffect(() => {
        if (userByID?.user != undefined) {
            getTrackerEntryByDate(props.date)
        }
    }, [userByID?.user])

    const breakDownMatchingDate = (input) => {
        setFirstThing([])
        setBreakfast([])
        setMidmorning([])
        setLunch([])
        setAfternoon([])
        setDinner([])
        setBeforeBed([])
        for (let i = 0; i < input.length; i++) {
            const schedule = JSON.stringify(input[i].entry[0].schedule);
            const jsonString = JSON.stringify(input[i].entry[0].nutrients);

            function removeBackslashes(str) {
                let pattern = /(?<!\\)\\(?!\\)/g;
                let replacement = '';
                let updatedStr = str.replace(pattern, replacement);

                return updatedStr;
            }

            const removeQuotes = (str) => {
                return str.replace(/^"(.*)"$/, '$1');
            }

            let sampleSchedule_v1 = removeBackslashes(`${schedule}`);
            let sampleSchedule_v2 = removeQuotes(sampleSchedule_v1)

            let sample_v1 = removeBackslashes(`${jsonString}`);
            let sample_v2 = removeQuotes(sample_v1)
            sample_v2 = removeBackslashes(sample_v2)
            sample_v2 = removeQuotes(sample_v2)
            sample_v2 = JSON.parse(sample_v2)
            sample_v2 = sample_v2.calories.amount


            if (sampleSchedule_v2 == "First Thing") {
                setFirstThing(prev => [...prev, sample_v2])
            }
            if (sampleSchedule_v2 == "Breakfast") {
                setBreakfast(prev => [...prev, sample_v2])
            }
            if (sampleSchedule_v2 == "Midmorning") {
                setMidmorning(prev => [...prev, sample_v2])
            }
            if (sampleSchedule_v2 == "Lunch") {
                setLunch(prev => [...prev, sample_v2])
            }
            if (sampleSchedule_v2 == "Afternoon") {
                setAfternoon(prev => [...prev, sample_v2])
            }
            if (sampleSchedule_v2 == "Dinner") {
                setDinner(prev => [...prev, sample_v2])
            }
            if (sampleSchedule_v2 == "Before Bed") {
                setBeforeBed(prev => [...prev, sample_v2])
            }
        }

    }

    useEffect(() => {
        breakDownMatchingDate(matchingDate)
    }, [matchingDate])


    // UPDATE SCHEDULE SECTION TOTAL CAL's
    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < firstThing.length; i++) {
            sum += firstThing[i];
        }

        setFirstThingCalTotal(sum)
    }, [firstThing])

    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < breakfast.length; i++) {
            sum += breakfast[i];
        }

        setBreakfastCalTotal(sum)
    }, [breakfast])

    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < midmorning.length; i++) {
            sum += midmorning[i];
        }

        setMidmorningCalTotal(sum)
    }, [midmorning])

    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < lunch.length; i++) {
            sum += lunch[i];
        }

        setLunchCalTotal(sum)
    }, [lunch])

    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < afternoon.length; i++) {
            sum += afternoon[i];
        }

        setAfternoonCalTotal(sum)
    }, [afternoon])

    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < dinner.length; i++) {
            sum += dinner[i];
        }

        setDinnerCalTotal(sum)
    }, [dinner])

    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < beforeBed.length; i++) {
            sum += beforeBed[i];
        }

        setBeforeBedCalTotal(sum)
    }, [beforeBed])

    // TOTAL ALL SCHEDULE SECTIONS
    useEffect(() => {
        let total = firstThingCalTotal + breakfastCalTotal + midmorningCalTotal + lunchCalTotal + afternoonCalTotal + dinnerCalTotal + beforeBedCalTotal;
        const storeTotalCalorieCount = async (value) => {
            try {
                const jsonValue = JSON.stringify(value)
                await AsyncStorage.setItem('@TotalCalorieCount', jsonValue)
            } catch (e) {
                // saving error
            }
        }
        storeTotalCalorieCount(total)
    }, [firstThingCalTotal, breakfastCalTotal, midmorningCalTotal, lunchCalTotal, afternoonCalTotal, dinnerCalTotal, beforeBedCalTotal])



    const displaySimplifiedEntries = (data, emotions) => {
        const options_time = [
            "First Thing",
            "Breakfast",
            "Midmorning",
            "Lunch",
            "Afternoon",
            "Dinner",
            "Before Bed"
        ];

        const textComponents = [];
        const textComponentsBySchedule = {};

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < emotions.length; j++) {
                if (data[i].name == emotions[j].item) {
                    const schedule = emotions[j].schedule;
                    const index = options_time.indexOf(schedule);
                    if (index !== -1) {
                        const textComponent = (
                            <>
                                <View
                                    style={{
                                        ...styles.renderItem_Search_Results,
                                        justifyContent: 'space-between',
                                    }}
                                    key={index}
                                >
                                    <View
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: HeightRatio(20),
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {unescape(emotions[j] != null ? emotions[j].emoji.replace(/\\u/g, '%u') : null)}
                                        </Text>
                                        <Text
                                            style={{
                                                ...styles.renderItem_Search_Result_Container_Text,
                                                width: WidthRatio(160),
                                                // backgroundColor: 'red'
                                            }}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"

                                        >
                                            {data[i].name}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            // backgroundColor: 'red', 
                                            width: WidthRatio(120),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        <View
                                            style={{
                                                marginRight: HeightRatio(10)
                                            }}
                                        >
                                            <Text
                                                key={`${schedule}_${i}_${j}`}
                                                style={{
                                                    fontSize: HeightRatio(14),
                                                    color: THEME_FONT_COLOR_WHITE,
                                                }}
                                                allowFontScaling={false}
                                            >
                                                {schedule}
                                            </Text>
                                        </View>
                                        {data[i].tried &&
                                            <View
                                                style={{
                                                    backgroundColor: THEME_COLOR_ATTENTION,
                                                    borderRadius: HeightRatio(5),
                                                    padding: HeightRatio(4)
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        ...styles.renderItem_Search_Result_Container_Text,
                                                        color: THEME_FONT_COLOR_BLACK,
                                                        fontSize: HeightRatio(18),
                                                        fontFamily: "GochiHand_400Regular",
                                                    }}
                                                >
                                                    TOP 100
                                                </Text>
                                            </View>
                                        }
                                    </View>
                                </View>
                                
                            </>
                        );
                        if (!textComponentsBySchedule[schedule]) {
                            textComponentsBySchedule[schedule] = [];
                        }
                        textComponentsBySchedule[schedule].push(textComponent);
                    }
                }
            }
        }

        for (let i = 0; i < options_time.length; i++) {
            const schedule = options_time[i];
            if (textComponentsBySchedule[schedule]) {
                textComponents.push(...textComponentsBySchedule[schedule]);
            }
        }

        // console.log(textComponents);
        setDailyEntries(textComponents)
    }


    useEffect(() => {
        if (calendarModalFoods && calendarModalEmotion) {
            displaySimplifiedEntries(calendarModalFoods, calendarModalEmotion)
        }
    }, [calendarModalFoods, calendarModalEmotion])

    return (
        <>

            {calendarModalFoods &&
                <SafeAreaView
                    style={{
                        ...styles.container,
                        // backgroundColor: 'red'
                    }}
                >
                    <ScrollView
                        style={styles.scrollView}
                    >
                        <View style={{}}>
                            {dailyEntries.map((data, index) => (
                                <View key={index}>
                                    { data }
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            }


        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: HeightRatio(10),
        height: HeightRatio(450),
        // backgroundColor: THEME_COLOR_POSITIVE
    },
    scrollView: {
        // backgroundColor: THEME_COLOR_BACKDROP_DARK,
        width: windowWidth - HeightRatio(20),
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10)
    },
    scheduleButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: 'center',
        flexDirection: 'row',
        width: '90%',
        margin: HeightRatio(4),
        borderRadius: HeightRatio(10),
    },
    scheduleButton_Pattern_0: {
        width: '100%',
        height: '100%',
        opacity: 0.05,
        borderRadius: HeightRatio(10),
        position: 'absolute'
    },
    scheduleButton_Text: {
        fontSize: HeightRatio(30),
        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
        marginRight: HeightRatio(10),
        margin: HeightRatio(15)
    },
    scheduleButton_Calorie_Container: {
        backgroundColor: THEME_COLOR_BLACK_LOW_OPACITY,
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
        height: HeightRatio(40),
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
    },
    scheduleButton_Calorie_Container_Text: {
        fontSize: HeightRatio(20),
        fontFamily: 'SofiaSansSemiCondensed-Regular',
    },
    scheduleButton_faBars: {
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
        height: HeightRatio(40),
        width: HeightRatio(40),
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
    },
    scheduleButton_subContent: {
        borderBottomWidth: 1,
        borderBottomColor: THEME_COLOR_ATTENTION,
        margin: HeightRatio(10),
        width: windowWidth - HeightRatio(80),
        alignSelf: 'center'
    },
    scheduleButton_subContent_Container: {
        width: windowWidth - HeightRatio(120),
        alignSelf: 'center',
    },
    scheduleButton_subContent_Container_Button: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: 'row',
        padding: HeightRatio(5),
        paddingTop: HeightRatio(10)
    },
    scheduleButton_subContent_Container_Button_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(20),
        fontFamily: "SofiaSansSemiCondensed-Regular"
    },
    scheduleButton_subContent_Container_Button_DataAmount_Container: {
        margin: HeightRatio(5),
        padding: HeightRatio(4),
        paddingLeft: HeightRatio(20),
        paddingRight: HeightRatio(20),
        borderRadius: HeightRatio(10)
    },
    scheduleButton_subContent_NutritionDetails_Title_Container_0: {
        width: windowWidth - HeightRatio(120),
        alignSelf: 'center',
        padding: HeightRatio(5)
    },
    scheduleButton_subContent_NutritionDetails_Title_Container_1: {
        borderBottomWidth: 1,
        borderBottomColor: THEME_FONT_COLOR_WHITE
    },
    scheduleButton_subContent_NutritionDetails_Title_Container_1_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(25),
        fontFamily: "SofiaSansSemiCondensed-Regular"
    },
    scheduleButton_subContent_NutritionDetails_Container_0: {
        padding: 10,
        marginBottom: HeightRatio(4),
        alignSelf: 'center'
    },
    scheduleButton_subContent_NutritionDetails_Remove_Button: {
        backgroundColor: THEME_COLOR_NEGATIVE,
        margin: HeightRatio(10),
        padding: HeightRatio(10),
        paddingLeft: HeightRatio(20),
        paddingRight: HeightRatio(20),
        borderRadius: HeightRatio(10),
        width: '80%',
        alignSelf: 'center'
    },
    scheduleButton_subContent_NutritionDetails_Remove_Button_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(25),
        fontFamily: "SofiaSansSemiCondensed-Regular",
        textAlign: 'center'
    },
    scheduleButton_subContent_NutritionDetails_Map_Container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        width: windowWidth - HeightRatio(130),
        backgroundColor: THEME_FONT_COLOR_WHITE_LOW_OPACITY,
        margin: HeightRatio(2),
        padding: HeightRatio(10),
        borderRadius: HeightRatio(4)
    },
    scheduleButton_subContent_NutritionDetails_Map_Container_Text: {
        flex: 1,
        textAlign: 'left',
        fontSize: HeightRatio(20),
        fontFamily: "SofiaSansSemiCondensed-Regular"
    },
    modalContainer_0: {
        flex: 1,
        backgroundColor: THEME_COLOR_BLACKOUT
    },
    modalContainer_1: {
        backgroundColor: THEME_COLOR_BACKDROP_DARK,
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
        width: (windowWidth - WidthRatio(100)),
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
    modalVisible_Container: {
        backgroundColor: THEME_COLOR_BACKDROP_DARK,
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
    renderItem_Search_Results: {
        backgroundColor: THEME_COLOR_BLACK_LOW_OPACITY,
        borderRadius: HeightRatio(50),
        margin: HeightRatio(4),
        width: windowWidth - HeightRatio(50),
        alignSelf: 'center',
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        padding: HeightRatio(10)
    },
    renderItem_Search_Result_Container_Text: {
        color: THEME_FONT_GREY,
        fontSize: HeightRatio(20),
        fontFamily: "SofiaSansSemiCondensed-Regular",
        display: 'flex',
        flexWrap: 'wrap',
    },
});
