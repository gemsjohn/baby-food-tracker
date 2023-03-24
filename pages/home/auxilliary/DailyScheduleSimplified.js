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
    THEME_COLOR_BLACKOUT
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

    let emotionIndex = [];

    const displayScheduleData = (input) => {
        setFirstThingData([])
        setBreakfastData([])
        setMidmorningData([])
        setLunchData([])
        setAfternoonData([])
        setDinnerData([])
        setBeforeBedData([])

        setDeleteID(null)

        if (input != null) {
            console.log("# - Display schedule data for: " + input)

            for (let i = 0; i < matchingDate.length; i++) {
                const jsonString = JSON.stringify(matchingDate[i].entry[0].schedule);
                let item = JSON.stringify(matchingDate[i].entry[0].item);
                let emotion = JSON.stringify(matchingDate[i].entry[0].emotion);


                function removeBackslashes(str) {
                    let pattern = /(?<!\\)\\(?!\\)/g;
                    let replacement = '';
                    let updatedStr = str.replace(pattern, replacement);

                    return updatedStr;
                }

                const removeQuotes = (str) => {
                    return str.replace(/^"(.*)"$/, '$1');
                }

                // EMOJI
                emotion = removeQuotes(emotion)
                const codePoints = emotion
                    .split('')
                    .map(char => char.charCodeAt(0).toString(16).padStart(4, '0'));
                const unicodeEscape = '\\u' + codePoints.join('\\u');
                item = removeBackslashes(item);
                item = removeQuotes(item)

                emotionIndex.push({ item: item, emoji: unicodeEscape })


                let sample_v1 = removeBackslashes(`${jsonString}`);
                let sample_v2 = removeQuotes(sample_v1)


                if (sample_v2 == input) {
                    let item = JSON.stringify(matchingDate[i].entry[0].item);
                    item = removeQuotes(item);
                    let amount = JSON.stringify(matchingDate[i].entry[0].amount);
                    amount = removeQuotes(amount)
                    let nutrients = JSON.stringify(matchingDate[i].entry[0].nutrients);
                    nutrients = removeBackslashes(nutrients)
                    nutrients = removeQuotes(nutrients)
                    nutrients = JSON.parse(nutrients)
                    let id = matchingDate[i]._id;

                    let item_amount = { item: item, amount: amount, nutrients: nutrients, id: id }

                    if (sample_v2 == "First Thing") {
                        setFirstThingData(prev => [...prev, item_amount])
                    }
                    if (sample_v2 == "Breakfast") {
                        setBreakfastData(prev => [...prev, item_amount])
                    }
                    if (sample_v2 == "Midmorning") {
                        setMidmorningData(prev => [...prev, item_amount])
                    }
                    if (sample_v2 == "Lunch") {
                        setLunchData(prev => [...prev, item_amount])
                    }
                    if (sample_v2 == "Afternoon") {
                        setAfternoonData(prev => [...prev, item_amount])
                    }
                    if (sample_v2 == "Dinner") {
                        setDinnerData(prev => [...prev, item_amount])
                    }
                    if (sample_v2 == "Before Bed") {
                        setBeforeBedData(prev => [...prev, item_amount])
                    }
                }
            }
            console.log(emotionIndex)
            setUniqueEmotionArray(emotionIndex)
        }
    }

    const handleDeleteEntry = async () => {
        setMainState({
            triggerRefresh: true
        })
        await deleteEntry({
            variables: {
                deleteEntryId: deleteID
            }
        })
        refetch()
        setTimeout(() => {
            setMainState({
                triggerRefresh: false
            })
        }, 100)
    }


    return (
        <>
            {/* <TouchableOpacity
                onPress={() => {
                    setDisplayTop100Foods(true);
                }}
            >
                <View
                    style={{
                        ...styles.modalVisible_Container,
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
            </TouchableOpacity> */}
            {calendarModalFoods &&
                <SafeAreaView
                    style={{
                        ...styles.container,
                    }}
                >
                    <ScrollView
                        style={styles.scrollView}
                    >
                        <View style={{}}>
                            {calendarModalFoods.map((data, index) => (
                                <View
                                    style={{
                                        ...styles.renderItem_Search_Results,
                                        justifyContent: 'space-between',
                                    }}
                                    key={index}
                                >
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text
                                            style={{
                                                ...styles.renderItem_Search_Result_Container_Text,
                                                width: WidthRatio(200)
                                            }}
                                            allowFontScaling={false}

                                        >
                                            {data.name}
                                        </Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            {calendarModalEmotion.map((data_emotion, index) => (
                                                <>
                                                    {data.name == data_emotion.item &&
                                                        <Text
                                                            style={{
                                                                fontSize: HeightRatio(20)
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            {unescape(data_emotion != null ? data_emotion.emoji.replace(/\\u/g, '%u') : null)}
                                                        </Text>
                                                    }
                                                </>
                                            ))}
                                        </View>
                                    </View>
                                    {data.tried &&
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
                            ))}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            }

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer_0}>
                    <View style={styles.modalContainer_1}>
                        <View style={styles.modalContainer_1_A}>
                            <Text
                                style={styles.modalContainer_1_A_Text}
                                allowFontScaling={false}
                            >
                                Are you sure that you want to delete this entry?
                            </Text>
                        </View>
                        <View style={styles.modalContainer_1_B}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <View style={{ ...styles.modalButton, backgroundColor: THEME_COLOR_POSITIVE }}>
                                    <Text
                                        style={styles.modalButton_Text}
                                        allowFontScaling={false}
                                    >
                                        Close
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    handleDeleteEntry()

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
        marginTop: HeightRatio(10),
        height: HeightRatio(320),
        backgroundColor: THEME_COLOR_POSITIVE
    },
    scrollView: {
        backgroundColor: THEME_COLOR_BACKDROP_DARK,
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
    renderItem_Search_Result_Container_Text: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(25),
        fontFamily: "SofiaSansSemiCondensed-Regular",
        display: 'flex',
        flexWrap: 'wrap',
    },
});
