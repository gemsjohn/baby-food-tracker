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
import { HeightRatio, windowWidth } from "../../../Styling"
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../../utils/queries';
import { MainStateContext } from '../../../App';



export const DailySchedule = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [matchingDate, setMatchingDate] = useState([]);

    // Schedule Arrays
    const [firstThing, setFirstThing] = useState([]);
    const [firstThingCalTotal, setFirstThingCalTotal] = useState(null)
    const [firstThingData, setFirstThingData] = useState([]);

    const [breakfast, setBreakfast] = useState([]);
    const [breakfastCalTotal, setBreakfastCalTotal] = useState(null)
    const [breakfastData, setBreakfastData] = useState([]);
    const [displayBreakfastNutrients, setDisplayBreakfastNutrients] = useState(false);

    const [midmorning, setMidmorning] = useState([]);
    const [midmorningCalTotal, setMidmorningCalTotal] = useState(null)
    const [midmorningData, setMidmorningData] = useState([]);

    const [lunch, setLunch] = useState([]);
    const [lunchCalTotal, setLunchCalTotal] = useState(null)
    const [lunchData, setLunchData] = useState([]);

    const [midafternoon, setMidafternoon] = useState([]);
    const [midafternoonCalTotal, setMidafternoonCalTotal] = useState(null)
    const [midafternoonData, setMidafternoonData] = useState([]);

    const [dinner, setDinner] = useState([]);
    const [dinnerCalTotal, setDinnerCalTotal] = useState(null)
    const [dinnerData, setDinnerData] = useState([]);

    const [beforeBed, setBeforeBed] = useState([]);
    const [beforeBedCalTotal, setBeforeBedCalTotal] = useState(null)
    const [beforeBedData, setBeforeBedData] = useState([]);

    const [totalCalorieCount, setTotalCalorieCount] = useState(null)



    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    useEffect(() => {
        refetch()
    }, [])


    const getTrackerEntryByDate = (date) => {
        refetch()
        setMatchingDate([])


        if (userByID?.user.tracker != []) {
            console.log("# - User Tracker Length: " + userByID?.user.tracker.length)
            for (let i = 0; i < userByID?.user.tracker.length; i++) {
                if (userByID?.user.tracker[i].date == date) {
                    console.log("# - Tracker array, matching date: " + i)
                    setMatchingDate(prev => [...prev, userByID?.user.tracker[i]]);

                }
            }
        }

    }

    useEffect(() => {
        console.log('# --------------------------------------')
        console.log('# - Date: ' + props.date)
        console.log("# - Clear Everything")
        setFirstThing([])
        setBreakfast([])
        setMidmorning([])
        setLunch([])
        setMidafternoon([])
        setDinner([])
        setBeforeBed([])
        setFirstThingData([])
        setBreakfastData([])
        setMidmorningData([])
        setLunchData([])
        setMidafternoonData([])
        setDinnerData([])
        setBeforeBedData([])
        getTrackerEntryByDate(props.date)

    }, [props.date])

    const breakDownMatchingDate = (input) => {
        setFirstThing([])
        setBreakfast([])
        setMidmorning([])
        setLunch([])
        setMidafternoon([])
        setDinner([])
        setBeforeBed([])
        // console.log(input.length)
        for (let i = 0; i < input.length; i++) {
            const schedule = JSON.stringify(input[i].entry[0].schedule);
            const jsonString = JSON.stringify(input[i].entry[0].nutrients);
            // console.log(i)
            // console.log(jsonString)

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



            // console.log("+++++++")
            // console.log(sample_v2)

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
            if (sampleSchedule_v2 == "Midafter-noon") {
                setMidafternoon(prev => [...prev, sample_v2])
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

        for (let i = 0; i < midafternoon.length; i++) {
            sum += midafternoon[i];
        }

        setMidafternoonCalTotal(sum)
    }, [midafternoon])

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
        console.log("# - TOTAL:")
        let total = firstThingCalTotal + breakfastCalTotal + midmorningCalTotal + lunchCalTotal + midafternoonCalTotal + dinnerCalTotal + beforeBedCalTotal;
        setTotalCalorieCount(total)
    }, [firstThingCalTotal, breakfastCalTotal, midmorningCalTotal, lunchCalTotal, midafternoonCalTotal, dinnerCalTotal, beforeBedCalTotal])




    const displayScheduleData = (input) => {
        setFirstThingData([])
        setBreakfastData([])
        setMidmorningData([])
        setLunchData([])
        setMidafternoonData([])
        setDinnerData([])
        setBeforeBedData([])
        console.log("# - displayScheduleData: " + input)

        for (let i = 0; i < matchingDate.length; i++) {
            const jsonString = JSON.stringify(matchingDate[i].entry[0].schedule);
            // console.log(i)
            // console.log(jsonString)

            function removeBackslashes(str) {
                let pattern = /(?<!\\)\\(?!\\)/g;
                let replacement = '';
                let updatedStr = str.replace(pattern, replacement);

                return updatedStr;
            }

            const removeQuotes = (str) => {
                return str.replace(/^"(.*)"$/, '$1');
            }


            let sample_v1 = removeBackslashes(`${jsonString}`);
            let sample_v2 = removeQuotes(sample_v1)

            // console.log(sample_v2)

            if (sample_v2 == input) {
                // console.log(i)
                let item = JSON.stringify(matchingDate[i].entry[0].item);
                item = removeQuotes(item);
                let amount = JSON.stringify(matchingDate[i].entry[0].amount);
                amount = removeQuotes(amount)
                let nutrients = JSON.stringify(matchingDate[i].entry[0].nutrients);
                nutrients = removeBackslashes(nutrients)
                nutrients = removeQuotes(nutrients)
                nutrients = JSON.parse(nutrients)
                // console.log(nutrients.calories)

                let item_amount = { item: item, amount: amount, nutrients: nutrients }
                // console.log(item_amount)

                // console.log("# - item: " + item)
                // console.log("# - amount: " + amount)

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
                if (sample_v2 == "Midafter-noon") {
                    setMidafternoonData(prev => [...prev, item_amount])
                }
                if (sample_v2 == "Dinner") {
                    setDinnerData(prev => [...prev, item_amount])
                }
                if (sample_v2 == "Before Bed") {
                    setBeforeBedData(prev => [...prev, item_amount])
                }
            }
        }
    }

    useEffect(() => {
        // console.log(breakfastData)
    }, [breakfastData])


    return (
        <>
            <View
                style={{
                    alignSelf: 'center',
                    backgroundColor: "#47426a",
                    margin: HeightRatio(5),
                    marginTop: HeightRatio(20),
                    borderRadius: 10,
                    // padding: HeightRatio(10),
                    width: '80%'
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: HeightRatio(30),
                        borderBottomWidth: 1,
                        borderBottomColor: 'white',
                        textAlign: 'center'
                    }}
                >
                    Total Calories: {totalCalorieCount} Cal

                </Text>
            </View>
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    {/* FIRST THING */}
                    <TouchableOpacity
                        onPress={() => displayScheduleData("First Thing")}
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            width: '90%',
                            padding: HeightRatio(15),
                            margin: HeightRatio(4),
                            borderRadius: HeightRatio(10),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between", // changed to 'space-between'
                            alignSelf: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: HeightRatio(30),
                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                marginRight: HeightRatio(10)
                            }}
                        >
                            First Thing
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={{
                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: HeightRatio(20),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                }}
                            >
                                {firstThingCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={{
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                width: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{
                                    color: 'black',
                                }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {firstThingData.map((data) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(110),
                                alignSelf: 'center'
                            }}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'white',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}>
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: HeightRatio(30),

                                        }}
                                    >
                                        {data.item}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: '#0095ff',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(20)
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(20),
                                            }}
                                        >
                                            {data.amount}
                                        </Text>
                                    </View>
                                </View>

                                <Text
                                    style={{
                                        color: 'black',
                                        fontSize: HeightRatio(20),
                                        marginTop: HeightRatio(5)
                                    }}
                                >
                                    Nutrition Details
                                </Text>
                            </View>
                            <View style={{
                                padding: 10,
                                marginBottom: 10,
                                alignSelf: 'center'
                            }}>
                                {Object.keys(data.nutrients).map((key) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 5,
                                            width: windowWidth - HeightRatio(130),
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            margin: HeightRatio(2),
                                            padding: HeightRatio(2),
                                            borderRadius: HeightRatio(4)
                                        }}
                                        key={key}
                                    >
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular"
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {key.replace('_', ' ')}
                                        </Text>
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {data.nutrients[key].amount} {data.nutrients[key].unit}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                    ))}

                    {/* BREAKFAST */}
                    <TouchableOpacity
                        onPress={() => displayScheduleData("Breakfast")}
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            width: '90%',
                            padding: HeightRatio(15),
                            margin: HeightRatio(4),
                            borderRadius: HeightRatio(10),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between", // changed to 'space-between'
                            alignSelf: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: HeightRatio(30),
                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                marginRight: HeightRatio(10)
                            }}
                        >
                            Breakfast
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={{
                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                // width: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: HeightRatio(20),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                }}
                            >
                                {breakfastCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={{
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                width: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{
                                    color: 'black',
                                }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {breakfastData.map((data) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(110),
                                alignSelf: 'center'
                            }}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => setDisplayBreakfastNutrients(current => !current)}
                                    style={{
                                        flexDirection: 'row',
                                        borderBottomWidth: 1,
                                        borderBottomColor: 'white',
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: HeightRatio(30),

                                        }}
                                    >
                                        {data.item}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: '#0095ff',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(20)
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(20),
                                            }}
                                        >
                                            {data.amount}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                            {displayBreakfastNutrients &&
                            <>
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'black',
                                        fontSize: HeightRatio(20),
                                        marginTop: HeightRatio(5)
                                    }}
                                >
                                    Nutrition Details
                                </Text>
                            </View>
                            <View style={{
                                padding: 10,
                                marginBottom: 10,
                                alignSelf: 'center'
                            }}>
                                {Object.keys(data.nutrients).map((key) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 5,
                                            width: windowWidth - HeightRatio(130),
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            margin: HeightRatio(2),
                                            padding: HeightRatio(2),
                                            borderRadius: HeightRatio(4)
                                        }}
                                        key={key}
                                    >
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular"
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {key.replace('_', ' ')}
                                        </Text>
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {data.nutrients[key].amount} {data.nutrients[key].unit}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            </>
                            }
                        </View>

                    ))}



                    {/* MIDMORNING */}
                    <TouchableOpacity
                        onPress={() => displayScheduleData("Midmorning")}
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            width: '90%',
                            padding: HeightRatio(15),
                            margin: HeightRatio(4),
                            borderRadius: HeightRatio(10),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between", // changed to 'space-between'
                            alignSelf: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: HeightRatio(30),
                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                marginRight: HeightRatio(10)
                            }}
                        >
                            Midmorning
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={{
                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                // width: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: HeightRatio(20),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                }}
                            >
                                {midmorningCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={{
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                width: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{
                                    color: 'black',
                                }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {midmorningData.map((data) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(110),
                                alignSelf: 'center'
                            }}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'white',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}>
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: HeightRatio(30),

                                        }}
                                    >
                                        {data.item}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: '#0095ff',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(20)
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(20),
                                            }}
                                        >
                                            {data.amount}
                                        </Text>
                                    </View>
                                </View>

                                <Text
                                    style={{
                                        color: 'black',
                                        fontSize: HeightRatio(20),
                                        marginTop: HeightRatio(5)
                                    }}
                                >
                                    Nutrition Details
                                </Text>
                            </View>
                            <View style={{
                                padding: 10,
                                marginBottom: 10,
                                alignSelf: 'center'
                            }}>
                                {Object.keys(data.nutrients).map((key) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 5,
                                            width: windowWidth - HeightRatio(130),
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            margin: HeightRatio(2),
                                            padding: HeightRatio(2),
                                            borderRadius: HeightRatio(4)
                                        }}
                                        key={key}
                                    >
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular"
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {key.replace('_', ' ')}
                                        </Text>
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {data.nutrients[key].amount} {data.nutrients[key].unit}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                    ))}

                    {/* LUNCH */}
                    <TouchableOpacity
                        onPress={() => displayScheduleData("Lunch")}
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            width: '90%',
                            padding: HeightRatio(15),
                            margin: HeightRatio(4),
                            borderRadius: HeightRatio(10),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between", // changed to 'space-between'
                            alignSelf: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: HeightRatio(30),
                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                marginRight: HeightRatio(10)
                            }}
                        >
                            Lunch
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={{
                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: HeightRatio(20),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                }}
                            >
                                {lunchCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={{
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                width: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{
                                    color: 'black',
                                }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {lunchData.map((data) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(110),
                                alignSelf: 'center'
                            }}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'white',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}>
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: HeightRatio(30),

                                        }}
                                    >
                                        {data.item}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: '#0095ff',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(20)
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(20),
                                            }}
                                        >
                                            {data.amount}
                                        </Text>
                                    </View>
                                </View>

                                <Text
                                    style={{
                                        color: 'black',
                                        fontSize: HeightRatio(20),
                                        marginTop: HeightRatio(5)
                                    }}
                                >
                                    Nutrition Details
                                </Text>
                            </View>
                            <View style={{
                                padding: 10,
                                marginBottom: 10,
                                alignSelf: 'center'
                            }}>
                                {Object.keys(data.nutrients).map((key) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 5,
                                            width: windowWidth - HeightRatio(130),
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            margin: HeightRatio(2),
                                            padding: HeightRatio(2),
                                            borderRadius: HeightRatio(4)
                                        }}
                                        key={key}
                                    >
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular"
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {key.replace('_', ' ')}
                                        </Text>
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {data.nutrients[key].amount} {data.nutrients[key].unit}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                    ))}

                    {/* MIDAFTER-NOON */}
                    <TouchableOpacity
                        onPress={() => displayScheduleData("Midafter-noon")}
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            width: '90%',
                            padding: HeightRatio(15),
                            margin: HeightRatio(4),
                            borderRadius: HeightRatio(10),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between", // changed to 'space-between'
                            alignSelf: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: HeightRatio(30),
                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                marginRight: HeightRatio(10)
                            }}
                        >
                            Midafter-noon
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={{
                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: HeightRatio(20),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                }}
                            >
                                {midafternoonCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={{
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                width: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{
                                    color: 'black',
                                }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {midafternoonData.map((data) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(110),
                                alignSelf: 'center'
                            }}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'white',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}>
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: HeightRatio(30),

                                        }}
                                    >
                                        {data.item}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: '#0095ff',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(20)
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(20),
                                            }}
                                        >
                                            {data.amount}
                                        </Text>
                                    </View>
                                </View>

                                <Text
                                    style={{
                                        color: 'black',
                                        fontSize: HeightRatio(20),
                                        marginTop: HeightRatio(5)
                                    }}
                                >
                                    Nutrition Details
                                </Text>
                            </View>
                            <View style={{
                                padding: 10,
                                marginBottom: 10,
                                alignSelf: 'center'
                            }}>
                                {Object.keys(data.nutrients).map((key) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 5,
                                            width: windowWidth - HeightRatio(130),
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            margin: HeightRatio(2),
                                            padding: HeightRatio(2),
                                            borderRadius: HeightRatio(4)
                                        }}
                                        key={key}
                                    >
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular"
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {key.replace('_', ' ')}
                                        </Text>
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {data.nutrients[key].amount} {data.nutrients[key].unit}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                    ))}


                    {/* DINNER */}
                    <TouchableOpacity
                        onPress={() => displayScheduleData("Dinner")}
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            width: '90%',
                            padding: HeightRatio(15),
                            margin: HeightRatio(4),
                            borderRadius: HeightRatio(10),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between", // changed to 'space-between'
                            alignSelf: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: HeightRatio(30),
                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                marginRight: HeightRatio(10)
                            }}
                        >
                            Dinner
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={{
                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: HeightRatio(20),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                }}
                            >
                                {dinnerCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={{
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                width: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{
                                    color: 'black',
                                }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {dinnerData.map((data) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(110),
                                alignSelf: 'center'
                            }}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'white',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}>
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: HeightRatio(30),

                                        }}
                                    >
                                        {data.item}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: '#0095ff',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(20)
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(20),
                                            }}
                                        >
                                            {data.amount}
                                        </Text>
                                    </View>
                                </View>

                                <Text
                                    style={{
                                        color: 'black',
                                        fontSize: HeightRatio(20),
                                        marginTop: HeightRatio(5)
                                    }}
                                >
                                    Nutrition Details
                                </Text>
                            </View>
                            <View style={{
                                padding: 10,
                                marginBottom: 10,
                                alignSelf: 'center'
                            }}>
                                {Object.keys(data.nutrients).map((key) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 5,
                                            width: windowWidth - HeightRatio(130),
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            margin: HeightRatio(2),
                                            padding: HeightRatio(2),
                                            borderRadius: HeightRatio(4)
                                        }}
                                        key={key}
                                    >
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular"
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {key.replace('_', ' ')}
                                        </Text>
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {data.nutrients[key].amount} {data.nutrients[key].unit}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                    ))}


                    {/* BEFORE BED */}
                    <TouchableOpacity
                        onPress={() => displayScheduleData("Before Bed")}
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            width: '90%',
                            padding: HeightRatio(15),
                            margin: HeightRatio(4),
                            borderRadius: HeightRatio(10),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between", // changed to 'space-between'
                            alignSelf: 'center',
                            flexDirection: 'row'
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: HeightRatio(30),
                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                marginRight: HeightRatio(10)
                            }}
                        >
                            Before Bed
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={{
                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: HeightRatio(20),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                }}
                            >
                                {beforeBedCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={{
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(30),
                                height: HeightRatio(40),
                                width: HeightRatio(40),
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{
                                    color: 'black',
                                }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {beforeBedData.map((data) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(110),
                                alignSelf: 'center'
                            }}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'white',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center'
                                }}>
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: HeightRatio(30),

                                        }}
                                    >
                                        {data.item}
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: '#0095ff',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(20)
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(20),
                                            }}
                                        >
                                            {data.amount}
                                        </Text>
                                    </View>
                                </View>

                                <Text
                                    style={{
                                        color: 'black',
                                        fontSize: HeightRatio(20),
                                        marginTop: HeightRatio(5)
                                    }}
                                >
                                    Nutrition Details
                                </Text>
                            </View>
                            <View style={{
                                padding: 10,
                                marginBottom: 10,
                                alignSelf: 'center'
                            }}>
                                {Object.keys(data.nutrients).map((key) => (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 5,
                                            width: windowWidth - HeightRatio(130),
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            margin: HeightRatio(2),
                                            padding: HeightRatio(2),
                                            borderRadius: HeightRatio(4)
                                        }}
                                        key={key}
                                    >
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular"
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {key.replace('_', ' ')}
                                        </Text>
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'left',
                                                fontSize: HeightRatio(20),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                            }}
                                            allowFontScaling={false}
                                        >
                                            {data.nutrients[key].amount} {data.nutrients[key].unit}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                    ))}

                </ScrollView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        //   flex: 1,
        height: HeightRatio(530)

    },
    scrollView: {
        //   backgroundColor: 'blue',
        width: windowWidth - HeightRatio(20),
    },
});
