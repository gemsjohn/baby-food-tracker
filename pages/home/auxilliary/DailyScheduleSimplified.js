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
    faBars,
    faGlasses,
    faFileExport
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeightRatio, windowWidth, WidthRatio } from "../../../Styling"
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_ENTRY } from '../../../utils/mutations';
import { GET_USER_BY_ID } from '../../../utils/queries';
import { MainStateContext } from '../../../App';
import { CommonActions } from '@react-navigation/native';
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
    THEME_FONT_GREY,
    THEME_LIGHT_GREEN
} from '../../../COLOR';
import { usePullDailyContent } from './PullDailyContent';
import { convertDateFormat } from './ConvertDateFormat';
import { LinearGradient } from 'expo-linear-gradient';
import { PDFGenerator } from '../pdf/PDFGenerator';
import { Purchases } from 'react-native-purchases';

const APIKeys = {
    google: "goog_caDqiYZPHvJIwlqyFoZDgTqOywO",
};

const resetActionPremium = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Premium', params: {} }]
});

const resetActionExport = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Export', params: {} }]
});

let localContainerHeight;

export const DailyScheduleSimplified = (props) => {

    const { mainState, setMainState } = useContext(MainStateContext);
    const [matchingDate, setMatchingDate] = useState([]);
    const { calendarModalCalorieTotal, calendarModalDate, calendarModalFoods, calendarModalEmotion } = usePullDailyContent(props.date, props.subuser);
    const [displayTop100Foods, setDisplayTop100Foods] = useState(false)

    localContainerHeight = props.containerHeight;

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

    const [custom, setCustom] = useState([]);
    const [customCalTotal, setCustomCalTotal] = useState(null)
    const [customData, setCustomData] = useState([]);

    const [deleteID, setDeleteID] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [uniqueEmotionArray, setUniqueEmotionArray] = useState([])
    const [dailyEntries, setDailyEntries] = useState([])
    const [entryKey, setEntryKey] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const [premiumServiceModalVisible, setPremiumServiceModalVisible] = useState(false)
    const [displaySubscriptionModal, setDisplaySubscriptionModal] = useState(false)


    const [deleteEntry] = useMutation(DELETE_ENTRY)
    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    const getTrackerEntryByDate = (date) => {
        refetch()
        setMatchingDate([])

        if (props.subuser && props.subuser.tracker) {
            for (let i = 0; i < props.subuser.tracker.length; i++) {
                if (props.subuser.tracker[i].date == date) {
                    setMatchingDate(prev => [...prev, props.subuser.tracker[i]]);
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
        setCustom([])
        setFirstThingData([])
        setBreakfastData([])
        setMidmorningData([])
        setLunchData([])
        setAfternoonData([])
        setDinnerData([])
        setBeforeBedData([])
        setCustomData([])
        getTrackerEntryByDate(props.date)

    }, [props.date])

    useEffect(() => {
        if (props.subuser != undefined) {
            getTrackerEntryByDate(props.date)
        }
    }, [props.subuser])

    const breakDownMatchingDate = (tracker) => {
        setFirstThing([])
        setBreakfast([])
        setMidmorning([])
        setLunch([])
        setAfternoon([])
        setDinner([])
        setBeforeBed([])
        setCustom([])
        for (let i = 0; i < tracker.length; i++) {
            let entry = tracker[i].entry[0]

            if (entry.schedule == "First Thing") {
                setFirstThing(prev => [...prev, entry.nutrients.calories.amount])
            }
            if (entry.schedule == "Breakfast") {
                setBreakfast(prev => [...prev, entry.nutrients.calories.amount])
            }
            if (entry.schedule == "Midmorning") {
                setMidmorning(prev => [...prev, entry.nutrients.calories.amount])
            }
            if (entry.schedule == "Lunch") {
                setLunch(prev => [...prev, entry.nutrients.calories.amount])
            }
            if (entry.schedule == "Afternoon") {
                setAfternoon(prev => [...prev, entry.nutrients.calories.amount])
            }
            if (entry.schedule == "Dinner") {
                setDinner(prev => [...prev, entry.nutrients.calories.amount])
            }
            if (entry.schedule == "Before Bed") {
                setBeforeBed(prev => [...prev, entry.nutrients.calories.amount])
            }
            if (entry.schedule == "Custom") {
                setCustom(prev => [...prev, entry.nutrients.calories.amount])
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

    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < custom.length; i++) {
            sum += custom[i];
        }

        setCustomCalTotal(sum)
    }, [custom])

    // TOTAL ALL SCHEDULE SECTIONS
    useEffect(() => {
        let total = firstThingCalTotal + breakfastCalTotal + midmorningCalTotal + lunchCalTotal + afternoonCalTotal + dinnerCalTotal + beforeBedCalTotal + customCalTotal;
        const storeTotalCalorieCount = async (value) => {
            try {
                const jsonValue = JSON.stringify(value)
                await AsyncStorage.setItem('@TotalCalorieCount', jsonValue)
            } catch (e) {
                // saving error
            }
        }
        storeTotalCalorieCount(total)

        // setMainState({

        // })
    }, [firstThingCalTotal, breakfastCalTotal, midmorningCalTotal, lunchCalTotal, afternoonCalTotal, dinnerCalTotal, beforeBedCalTotal, customCalTotal])

    useEffect(() => {
        // console.log(displayLunchNutrients)

    }, [displayLunchNutrients])

    const bg_color = [
        "#ffab81",
        "#dde9ba",
        "#c1fec3",
        "#febbbc",
        "#9bd4cc",
        "#e9ad50",
        "#d5b280",
        "#fc8383",
        "#bfa9ef",
        "#84f0aa",
        "#8fdfec",
        "#ffab81",
        "#dde9ba",
        "#c1fec3",
        "#febbbc",
        "#9bd4cc",
        "#e9ad50",
        "#d5b280",
        "#fc8383",
        "#bfa9ef",
        "#84f0aa",
        "#8fdfec",
    ]


    const displaySimplifiedEntries = (data, emotions) => {
        const options_time = [
            "First Thing",
            "Breakfast",
            "Midmorning",
            "Lunch",
            "Afternoon",
            "Dinner",
            "Before Bed",
            "Custom"
        ];

        // console.log("# ----------- CHECK --------------")
        // console.log(data)
        // console.log(emotions[0])
        // console.log(emotions[0].nutrients.calories)


        // Define a function to generate a nutrition details container
        function NutritionDetailsContainer({ title, amount, unit }) {
            return (
                <View style={styles.scheduleButton_subContent_NutritionDetails_Map_Container}>
                    <View style={{ width: WidthRatio(140) }}>
                        <Text
                            style={{ ...styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text, width: WidthRatio(120) }}
                            allowFontScaling={false}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {title}
                        </Text>
                    </View>
                    <Text
                        style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                        allowFontScaling={false}
                    >
                        {amount} {unit}
                    </Text>
                </View>
            );
        }


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
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayLunchNutrients(current => !current);
                                        setEntryKey({ index: index, name: data[i].name })
                                        setMainState({ userTouch: true })
                                    }}
                                    style={{
                                        ...styles.renderItem_Search_Results,
                                        ...styles.button_Drop_Shadow,
                                        justifyContent: 'space-between',
                                        backgroundColor: `${bg_color[i]}`,

                                    }}
                                    disabled={props.from === "export" ? true : false}
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
                                                width: WidthRatio(145),
                                                // backgroundColor: 'red'
                                            }}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                            allowFontScaling={false}
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
                                                    color: THEME_FONT_COLOR_BLACK,
                                                    fontFamily: "SofiaSansSemiCondensed-Regular",
                                                }}
                                                allowFontScaling={false}
                                            >
                                                {schedule} {schedule.includes("Custom") ? emotions[j].time : null}

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
                                                    allowFontScaling={false}
                                                >
                                                    TOP 100
                                                </Text>
                                            </View>
                                        }
                                    </View>
                                </TouchableOpacity>
                                {displayLunchNutrients && entryKey.index == index && entryKey.name == data[i].name &&
                                    <>
                                        <View style={{ ...styles.scheduleButton_subContent_NutritionDetails_Container_0, padding: HeightRatio(10) }}>
                                            <Text
                                                style={{
                                                    fontSize: HeightRatio(20),
                                                    color: THEME_FONT_COLOR_BLACK,
                                                    fontFamily: "SofiaSansSemiCondensed-ExtraBold",
                                                }}
                                                allowFontScaling={false}
                                            >
                                                {data[i].name}
                                            </Text>
                                        </View>
                                        {data[i].name == 'BREAST MILK' &&
                                            <View style={{ ...styles.scheduleButton_subContent_NutritionDetails_Container_0, padding: HeightRatio(10) }}>
                                                <Text
                                                    style={{
                                                        fontSize: HeightRatio(20),
                                                        color: THEME_FONT_COLOR_BLACK,
                                                        fontFamily: "SofiaSansSemiCondensed-ExtraBold",
                                                    }}
                                                    allowFontScaling={false}
                                                >
                                                    Note: Breast milk values are approximate and can vary based on several factors.
                                                </Text>
                                            </View>
                                        }
                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>


                                            <View style={styles.scheduleButton_subContent_NutritionDetails_Container_0}>
                                                <View style={{ backgroundColor: THEME_LIGHT_GREEN, height: '100%', width: WidthRatio(140), position: 'absolute', zIndex: -10, borderTopLeftRadius: HeightRatio(4), borderBottomLeftRadius: HeightRatio(4) }} />
                                                <View style={{ backgroundColor: '#ffcc42', height: '100%', width: WidthRatio(80), position: 'absolute', left: WidthRatio(140), zIndex: -10, borderTopRightRadius: HeightRatio(4), borderBottomRightRadius: HeightRatio(4) }} />

                                                <NutritionDetailsContainer
                                                    title="Calories"
                                                    amount={emotions[j].nutrients.calories.amount}
                                                    unit={emotions[j].nutrients.calories.unit}
                                                />
                                                <NutritionDetailsContainer
                                                    title="Carbohydrates"
                                                    amount={emotions[j].nutrients.carbohydrates.amount}
                                                    unit={emotions[j].nutrients.carbohydrates.unit}
                                                />
                                                <NutritionDetailsContainer
                                                    title="Fat"
                                                    amount={emotions[j].nutrients.fat.amount}
                                                    unit={emotions[j].nutrients.fat.unit}
                                                />
                                                <NutritionDetailsContainer
                                                    title="Fiber"
                                                    amount={emotions[j].nutrients.fiber.amount}
                                                    unit={emotions[j].nutrients.fiber.unit}
                                                />
                                                <NutritionDetailsContainer
                                                    title="Protein"
                                                    amount={emotions[j].nutrients.protein.amount}
                                                    unit={emotions[j].nutrients.protein.unit}
                                                />
                                                <NutritionDetailsContainer
                                                    title="Sugar"
                                                    amount={emotions[j].nutrients.sugar.amount}
                                                    unit={emotions[j].nutrients.sugar.unit}
                                                />

                                                {props.premium &&
                                                    <>
                                                        <NutritionDetailsContainer
                                                            title="Iron"
                                                            amount={emotions[j].nutrients.iron.amount}
                                                            unit={emotions[j].nutrients.iron.unit}
                                                        />
                                                        <NutritionDetailsContainer
                                                            title="Zinc"
                                                            amount={emotions[j].nutrients.zinc.amount}
                                                            unit={emotions[j].nutrients.zinc.unit}
                                                        />
                                                        <NutritionDetailsContainer
                                                            title="Omega-3"
                                                            amount={emotions[j].nutrients.omega3.amount}
                                                            unit={emotions[j].nutrients.omega3.unit}
                                                        />
                                                        <NutritionDetailsContainer
                                                            title="Vitamin D"
                                                            amount={emotions[j].nutrients.vitaminD.amount}
                                                            unit={emotions[j].nutrients.vitaminD.unit}
                                                        />
                                                    </>
                                                }

                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'column',
                                                    display: 'flex',
                                                    // alignItems: 'center',
                                                    // justifyContent: 'center'
                                                }}
                                            >
                                                {/* '#ec546d', '#d05bb6' */}
                                                <View style={{ ...styles.scheduleButton_subContent_Container_Button_DataAmount_Container, backgroundColor: '#102f52' }}>
                                                    <Text
                                                        style={{
                                                            ...styles.scheduleButton_subContent_Container_Button_Text,
                                                        }}
                                                        allowFontScaling={false}
                                                    >
                                                        {emotions[j].foodGroup.toUpperCase()}
                                                    </Text>
                                                </View>
                                                <View style={{ ...styles.scheduleButton_subContent_Container_Button_DataAmount_Container }}>
                                                    <Text
                                                        style={{
                                                            ...styles.scheduleButton_subContent_Container_Button_Text,
                                                        }}
                                                        allowFontScaling={false}
                                                    >
                                                        {emotions[j].measurement}
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setModalVisible(true);
                                                        setDeleteID(emotions[j].id);
                                                        setMainState({ userTouch: true })


                                                    }}
                                                    style={{
                                                        ...styles.scheduleButton_subContent_NutritionDetails_Remove_Button,
                                                        ...styles.button_Drop_Shadow

                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            ...styles.scheduleButton_subContent_NutritionDetails_Remove_Button_Text,
                                                        }}
                                                        allowFontScaling={false}
                                                    >
                                                        Remove
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </>
                                }

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
    }, [calendarModalFoods, calendarModalEmotion, displayLunchNutrients])

    const handleDeleteEntry = async () => {
        await deleteEntry({
            variables: {
                deleteEntryId: deleteID,
                subuserid: props.subuser._id,
                userid: props.userID
            }
        })
        // refetch()
        setMainState({
            triggerRefresh: true
        })
    }

    return (
        <>

            {/* {calendarModalFoods && */}
            <SafeAreaView
                style={{
                    ...styles.container,
                    height: props.from === "main" ? HeightRatio(450) : HeightRatio(250),
                }}

            >
                <ScrollView
                    style={styles.scrollView}

                >
                    {dailyEntries.length > 0 ?
                        <>
                            <View style={{}}>
                                {dailyEntries.map((data, index) => (
                                    <View key={index}>
                                        {data}
                                    </View>
                                ))}
                            </View>
                            <View style={{ height: HeightRatio(50) }} />
                        </>
                        :
                        <>
                            <Image
                                source={require('../../../assets/favicon_0.png')}
                                style={{
                                    height: HeightRatio(200),
                                    width: HeightRatio(200),
                                    alignSelf: 'center'
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: HeightRatio(50),
                                    color: props.from == 'main' ? THEME_FONT_COLOR_BLACK : THEME_FONT_COLOR_WHITE,
                                    fontFamily: "GochiHand_400Regular",
                                    textAlign: 'center'
                                }}
                                allowFontScaling={false}
                            >
                                Welcome!
                            </Text>
                            <Text
                                style={{
                                    fontSize: HeightRatio(30),
                                    color: props.from == 'main' ? THEME_FONT_COLOR_BLACK : THEME_FONT_COLOR_WHITE,
                                    fontFamily: "SofiaSansSemiCondensed-Regular",
                                    textAlign: 'center'
                                }}
                                allowFontScaling={false}
                            >
                                Select `ADD` to get started.
                            </Text>
                            <View style={{ height: HeightRatio(50) }} />
                        </>

                    }
                </ScrollView>
            </SafeAreaView>

            {props.from === "main" &&
                <View style={{ width: windowWidth, height: HeightRatio(140) }}>

                    {props.premium ?
                        <>
                            {props.subuser &&
                                <View style={{flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            backgroundColor: '#1f1f27',
                                            width: '70%',
                                            height: HeightRatio(100),
                                            alignSelf: 'center',
                                            borderRadius: HeightRatio(10),
                                            display: 'flex',
                                            // alignItems: 'center',
                                            // justifyContent: 'center',
                                            // padding: HeightRatio(20),
                                            // marginTop: HeightRatio(8),
                                            padding: HeightRatio(10),
                                            margin: HeightRatio(5)
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginBottom: HeightRatio(10)
                                            }}
                                        >
                                            <Image
                                                source={require('../../../assets/favicon_0.png')}
                                                style={{
                                                    height: HeightRatio(30),
                                                    width: HeightRatio(30),
                                                    // alignSelf: 'center'
                                                }}
                                            />
                                            <Text
                                                style={{
                                                    color: THEME_FONT_COLOR_WHITE,
                                                    // textAlign: 'center',
                                                    fontSize: HeightRatio(20),
                                                    fontFamily: "SofiaSansSemiCondensed-ExtraBold",
                                                    // marginTop: HeightRatio(20)
                                                    marginLeft: HeightRatio(10)
                                                }}
                                                allowFontScaling={false}
                                            >
                                                {props.subuser.subusername}
                                            </Text>
                                        </View>
                                        <Text
                                            style={{
                                                color: THEME_FONT_COLOR_WHITE,
                                                fontSize: HeightRatio(18),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                                marginLeft: HeightRatio(10)
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Personalized insight's are under development and will populate here!
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setMainState({ userTouch: true });
                                            props.nav.dispatch(resetActionExport)
                                        }}
                                        style={{
                                            margin: HeightRatio(5)
                                        }}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: '#8bccde',
                                                width: windowWidth*0.25,
                                                height: HeightRatio(100),
                                                alignSelf: 'center',
                                                borderRadius: HeightRatio(10),
                                                display: 'flex',
                                                padding: HeightRatio(20),
                                                // marginTop: HeightRatio(8),
                                                flexDirection: 'column',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                ...styles.button_Drop_Shadow,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: HeightRatio(5)
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faSolid, faFileExport}
                                                    style={{ color: THEME_FONT_COLOR_BLACK }}
                                                    size={25}
                                                />
                                            </View>
                                            <Text
                                                style={{
                                                    fontSize: HeightRatio(16),
                                                    color: THEME_FONT_COLOR_BLACK,
                                                }}
                                                allowFontScaling={false}
                                            >
                                                Export
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                            }
                        </>
                        :
                        <>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setMainState({ userTouch: true });
                                        props.nav.dispatch(resetActionPremium)
                                    }}
                                    style={{
                                        margin: HeightRatio(5)
                                    }}
                                >
                                    <LinearGradient
                                        colors={['#ec546d', '#d05bb6']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={{
                                            backgroundColor: '#1f1f27',
                                            width: windowWidth*0.65,
                                            height: HeightRatio(100),
                                            alignSelf: 'center',
                                            borderRadius: HeightRatio(10),
                                            display: 'flex',
                                            padding: HeightRatio(20),
                                            marginTop: HeightRatio(8),
                                            flexDirection: 'row',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            ...styles.button_Drop_Shadow,
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: HeightRatio(50),
                                                width: HeightRatio(50),
                                                borderRadius: HeightRatio(100),
                                                borderWidth: 3,
                                                borderColor: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faSolid, faGlasses}
                                                style={{ color: THEME_FONT_COLOR_WHITE }}
                                                size={25}
                                            />
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: HeightRatio(22),
                                                color: THEME_FONT_COLOR_WHITE,
                                                marginLeft: HeightRatio(20)
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Premium Service
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setMainState({ userTouch: true });
                                        props.nav.dispatch(resetActionExport)
                                    }}
                                    style={{
                                        margin: HeightRatio(5)
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: '#8bccde',
                                            width: windowWidth*0.25,
                                            height: HeightRatio(100),
                                            alignSelf: 'center',
                                            borderRadius: HeightRatio(10),
                                            display: 'flex',
                                            padding: HeightRatio(20),
                                            marginTop: HeightRatio(8),
                                            flexDirection: 'column',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            ...styles.button_Drop_Shadow,
                                        }}
                                    >
                                        <View
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: HeightRatio(5)
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faSolid, faFileExport}
                                                style={{ color: THEME_FONT_COLOR_BLACK }}
                                                size={25}
                                            />
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: HeightRatio(16),
                                                color: THEME_FONT_COLOR_BLACK,
                                            }}
                                            allowFontScaling={false}
                                        >
                                            Export
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </>

                    }

                </View>

            }

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer_0}>
                    <View style={{ ...styles.modalContainer_1, alignItems: null }}>

                        <View
                            style={{
                                margin: HeightRatio(20),
                                // alignSelf: 'center'
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    display: 'flex',
                                    alignItems: 'center',
                                    // justifyContent: 'center'
                                }}
                            >
                                <Image
                                    source={require('../../../assets/favicon_0.png')}
                                    style={{
                                        height: HeightRatio(40),
                                        width: HeightRatio(40),
                                        // alignSelf: 'center'
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
                                    Are you sure that you want to delete this food entry?
                                </Text>
                            </View>
                        </View>
                        <View style={styles.modalContainer_1_B}>
                            <TouchableOpacity onPress={() => { setModalVisible(false); setMainState({ userTouch: true }); }}>
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
                                    handleDeleteEntry()
                                    setMainState({ userTouch: true })
                                    setModalVisible(false);
                                }}
                            >
                                <View style={{ ...styles.modalButton, backgroundColor: THEME_COLOR_NEGATIVE }}>
                                    <Text
                                        style={styles.modalButton_Text}
                                        allowFontScaling={false}
                                    >
                                        Delete
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        // marginTop: HeightRatio(10),
        height: HeightRatio(450),
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: THEME_COLOR_POSITIVE
    },
    scrollView: {
        // backgroundColor: THEME_COLOR_BACKDROP_DARK,
        width: windowWidth - HeightRatio(20),
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
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
        fontSize: HeightRatio(16),
        fontFamily: "SofiaSansSemiCondensed-Regular",
        textAlign: 'center'
    },
    scheduleButton_subContent_Container_Button_DataAmount_Container: {
        margin: HeightRatio(5),
        // marginLeft: HeightRatio(10),
        padding: HeightRatio(5),
        borderRadius: HeightRatio(4),
        backgroundColor: '#583a86',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: WidthRatio(90)
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
        // padding: 10,
        marginTop: HeightRatio(4),
        marginBottom: HeightRatio(4),
        alignSelf: 'center',
        backgroundColor: THEME_TRANSPARENT,
        borderRadius: HeightRatio(10)

    },
    scheduleButton_subContent_NutritionDetails_Remove_Button: {
        backgroundColor: THEME_COLOR_NEGATIVE,
        margin: HeightRatio(5),
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
        // width: '80%',
    },
    scheduleButton_subContent_NutritionDetails_Remove_Button_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(20),
        fontFamily: "SofiaSansSemiCondensed-Regular",
        textAlign: 'center'
    },
    scheduleButton_subContent_NutritionDetails_Map_Container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        width: windowWidth - HeightRatio(160),
        // backgroundColor: 'red',
        margin: HeightRatio(2),
        padding: HeightRatio(10),
        borderRadius: HeightRatio(50)
    },
    scheduleButton_subContent_NutritionDetails_Map_Container_Text: {
        flex: 1,
        textAlign: 'left',
        fontSize: HeightRatio(20),
        fontFamily: "SofiaSansSemiCondensed-Regular"
    },
    modalContainer_0: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
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
        color: THEME_FONT_COLOR_BLACK,
        fontSize: HeightRatio(20),
        fontFamily: "SofiaSansSemiCondensed-ExtraBold",
        display: 'flex',
        flexWrap: 'wrap',
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
