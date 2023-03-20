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
import { HeightRatio, windowWidth, WidthRatio } from "../../../Styling"
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_ENTRY } from '../../../utils/mutations';
import { GET_USER_BY_ID } from '../../../utils/queries';
import { MainStateContext } from '../../../App';



export const DailySchedule = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [matchingDate, setMatchingDate] = useState([]);

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


    const [midafternoon, setMidafternoon] = useState([]);
    const [midafternoonCalTotal, setMidafternoonCalTotal] = useState(null)
    const [midafternoonData, setMidafternoonData] = useState([]);
    const [displayMidafternoonNutrients, setDisplayMidafternoonNutrients] = useState(false);
    const [displayMidafternoonNutrientsForIndex, setDisplayMidafternoonNutrientsForIndex] = useState(null)
    const [displaBool_Midafternoon, setDisplaBool_Midafternoon] = useState(false);


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

    const [totalCalorieCount, setTotalCalorieCount] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);


    const [deleteEntry] = useMutation(DELETE_ENTRY)
    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    const getTrackerEntryByDate = (date) => {
        refetch()
        setMatchingDate([])


        if (userByID?.user.tracker != []) {
            console.log("# - User Tracker Length: " + userByID?.user.tracker.length)
            for (let i = 0; i < userByID?.user.tracker.length; i++) {
                if (userByID?.user.tracker[i].date == date) {
                    // console.log("# - Tracker array, matching date: " + i)
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
        setMidafternoon([])
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

        setDeleteID(null)

        if (input != null) {
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
                    let id = matchingDate[i]._id;

                    let item_amount = { item: item, amount: amount, nutrients: nutrients, id: id }
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
    }

    useEffect(() => {
        // console.log(breakfastData)
    }, [breakfastData])

    const handleDeleteEntry = async() => {
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
        
        // refetch()
        // onRefresh();
    }


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
                <ScrollView 
                    style={styles.scrollView}
                    // refreshControl={
                    //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    // }
                >
                    {/* FIRST THING */}
                    <TouchableOpacity
                        // onPress={() => displayScheduleData("First Thing")}
                        onPress={() => {displayScheduleData(!displaBool_FirstThing ? "First Thing" : null); setDisplaBool_FirstThing(current => !current)}}
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
                    {firstThingData.map((data, index) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(80),
                                alignSelf: 'center'
                            }}
                            key={index}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayFirstThingNutrients(current => displayFirstThingNutrientsForIndex == index ? !current : true);
                                        setDisplayFirstThingNutrientsForIndex(index)
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between", // changed to 'space-between'
                                        flexDirection: 'row',
                                        padding: HeightRatio(5),
                                        paddingTop: HeightRatio(10)
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    fontFamily: "SofiaSansSemiCondensed-ExtraBold"
                                                }}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                                margin: HeightRatio(10),
                                                padding: HeightRatio(4),
                                                paddingLeft: HeightRatio(20),
                                                paddingRight: HeightRatio(20),
                                                borderRadius: HeightRatio(10)
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(20),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(30),
                                            height: HeightRatio(40),
                                            width: HeightRatio(40),
                                            display: 'flex',
                                            alignItems: "flex-end",
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


                            </View>
                            {displayFirstThingNutrients && displayFirstThingNutrientsForIndex == index &&
                                <>
                                    <View
                                        style={{
                                            width: windowWidth - HeightRatio(120),
                                            alignSelf: 'center',
                                            padding: HeightRatio(5)
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    // marginTop: HeightRatio(5),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        padding: 10,
                                        marginBottom: HeightRatio(4),
                                        alignSelf: 'center'
                                    }}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 5,
                                                    width: windowWidth - HeightRatio(130),
                                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                    margin: HeightRatio(2),
                                                    padding: HeightRatio(10),
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
                                                        textAlign: 'right',
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
                                    <TouchableOpacity
                                        onPress={() => {setModalVisible(true); setDeleteID(data.id)}}
                                        style={{
                                            backgroundColor: 'rgba(255, 0, 75, 0.90)',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            paddingLeft: HeightRatio(20),
                                            paddingRight: HeightRatio(20),
                                            borderRadius: HeightRatio(10),
                                            width: '80%',
                                            alignSelf: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(25),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                                textAlign: 'center'
                                            }}
                                        >
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            }


                        </View>

                    ))}

                    {/* BREAKFAST */}
                    <TouchableOpacity
                        onPress={() => {displayScheduleData(!displaBool_Breakfast ? "Breakfast" : null); setDisplaBool_Breakfast(current => !current)}}
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
                    {breakfastData.map((data, index) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(80),
                                alignSelf: 'center'
                            }}
                            key={index}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayBreakfastNutrients(current => displayBreakfastNutrientsForIndex == index ? !current : true);
                                        setDisplayBreakfastNutrientsForIndex(index)
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between", // changed to 'space-between'
                                        flexDirection: 'row',
                                        padding: HeightRatio(5),
                                        paddingTop: HeightRatio(10)
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    fontFamily: "SofiaSansSemiCondensed-ExtraBold"
                                                }}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                                margin: HeightRatio(10),
                                                padding: HeightRatio(4),
                                                paddingLeft: HeightRatio(20),
                                                paddingRight: HeightRatio(20),
                                                borderRadius: HeightRatio(10)
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(20),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(30),
                                            height: HeightRatio(40),
                                            width: HeightRatio(40),
                                            display: 'flex',
                                            alignItems: "flex-end",
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


                            </View>
                            {displayBreakfastNutrients && displayBreakfastNutrientsForIndex == index &&
                                <>
                                    <View
                                        style={{
                                            width: windowWidth - HeightRatio(120),
                                            alignSelf: 'center',
                                            padding: HeightRatio(5)
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    // marginTop: HeightRatio(5),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        padding: 10,
                                        marginBottom: HeightRatio(4),
                                        alignSelf: 'center'
                                    }}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 5,
                                                    width: windowWidth - HeightRatio(130),
                                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                    margin: HeightRatio(2),
                                                    padding: HeightRatio(10),
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
                                                        textAlign: 'right',
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
                                    <TouchableOpacity
                                        onPress={() => {setModalVisible(true); setDeleteID(data.id)}}
                                        style={{
                                            backgroundColor: 'rgba(255, 0, 75, 0.90)',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            paddingLeft: HeightRatio(20),
                                            paddingRight: HeightRatio(20),
                                            borderRadius: HeightRatio(10),
                                            width: '80%',
                                            alignSelf: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(25),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                                textAlign: 'center'
                                            }}
                                        >
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            }


                        </View>

                    ))}



                    {/* MIDMORNING */}
                    <TouchableOpacity
                        // onPress={() => displayScheduleData("Midmorning")}
                        onPress={() => {displayScheduleData(!displaBool_Midmorning ? "Midmorning" : null); setDisplaBool_Midmorning(current => !current)}}
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
                    {midmorningData.map((data, index) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(80),
                                alignSelf: 'center'
                            }}
                            key={index}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayMidmorningNutrients(current => displayMidmorningNutrientsForIndex == index ? !current : true);
                                        setDisplayMidmorningNutrientsForIndex(index)
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between", // changed to 'space-between'
                                        flexDirection: 'row',
                                        padding: HeightRatio(5),
                                        paddingTop: HeightRatio(10)
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    fontFamily: "SofiaSansSemiCondensed-ExtraBold"
                                                }}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                                margin: HeightRatio(10),
                                                padding: HeightRatio(4),
                                                paddingLeft: HeightRatio(20),
                                                paddingRight: HeightRatio(20),
                                                borderRadius: HeightRatio(10)
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(20),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(30),
                                            height: HeightRatio(40),
                                            width: HeightRatio(40),
                                            display: 'flex',
                                            alignItems: "flex-end",
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


                            </View>
                            {displayMidmorningNutrients && displayMidmorningNutrientsForIndex == index &&
                                <>
                                    <View
                                        style={{
                                            width: windowWidth - HeightRatio(120),
                                            alignSelf: 'center',
                                            padding: HeightRatio(5)
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    // marginTop: HeightRatio(5),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        padding: 10,
                                        marginBottom: HeightRatio(4),
                                        alignSelf: 'center'
                                    }}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 5,
                                                    width: windowWidth - HeightRatio(130),
                                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                    margin: HeightRatio(2),
                                                    padding: HeightRatio(10),
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
                                                        textAlign: 'right',
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
                                    <TouchableOpacity
                                        onPress={() => {setModalVisible(true); setDeleteID(data.id)}}
                                        style={{
                                            backgroundColor: 'rgba(255, 0, 75, 0.90)',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            paddingLeft: HeightRatio(20),
                                            paddingRight: HeightRatio(20),
                                            borderRadius: HeightRatio(10),
                                            width: '80%',
                                            alignSelf: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(25),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                                textAlign: 'center'
                                            }}
                                        >
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            }


                        </View>

                    ))}

                    {/* LUNCH */}
                    <TouchableOpacity
                        // onPress={() => displayScheduleData("Lunch")}
                        onPress={() => {displayScheduleData(!displaBool_Lunch ? "Lunch" : null); setDisplaBool_Lunch(current => !current)}}
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
                    {lunchData.map((data, index) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(80),
                                alignSelf: 'center'
                            }}
                            key={index}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayLunchNutrients(current => displayLunchNutrientsForIndex == index ? !current : true);
                                        setDisplayLunchNutrientsForIndex(index)
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between", // changed to 'space-between'
                                        flexDirection: 'row',
                                        padding: HeightRatio(5),
                                        paddingTop: HeightRatio(10)
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    fontFamily: "SofiaSansSemiCondensed-ExtraBold"
                                                }}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                                margin: HeightRatio(10),
                                                padding: HeightRatio(4),
                                                paddingLeft: HeightRatio(20),
                                                paddingRight: HeightRatio(20),
                                                borderRadius: HeightRatio(10)
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(20),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(30),
                                            height: HeightRatio(40),
                                            width: HeightRatio(40),
                                            display: 'flex',
                                            alignItems: "flex-end",
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


                            </View>
                            {displayLunchNutrients && displayLunchNutrientsForIndex == index &&
                                <>
                                    <View
                                        style={{
                                            width: windowWidth - HeightRatio(120),
                                            alignSelf: 'center',
                                            padding: HeightRatio(5)
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    // marginTop: HeightRatio(5),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        padding: 10,
                                        marginBottom: HeightRatio(4),
                                        alignSelf: 'center'
                                    }}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 5,
                                                    width: windowWidth - HeightRatio(130),
                                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                    margin: HeightRatio(2),
                                                    padding: HeightRatio(10),
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
                                                        textAlign: 'right',
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
                                    <TouchableOpacity
                                        onPress={() => {setModalVisible(true); setDeleteID(data.id)}}
                                        style={{
                                            backgroundColor: 'rgba(255, 0, 75, 0.90)',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            paddingLeft: HeightRatio(20),
                                            paddingRight: HeightRatio(20),
                                            borderRadius: HeightRatio(10),
                                            width: '80%',
                                            alignSelf: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(25),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                                textAlign: 'center'
                                            }}
                                        >
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            }


                        </View>

                    ))}

                    {/* MIDAFTER-NOON */}
                    <TouchableOpacity
                        // onPress={() => displayScheduleData("Midafter-noon")}
                        onPress={() => {displayScheduleData(!displaBool_Midafternoon ? "Midafter-noon" : null); setDisplaBool_Midafternoon(current => !current)}}
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
                    {midafternoonData.map((data, index) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(80),
                                alignSelf: 'center'
                            }}
                            key={index}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayMidafternoonNutrients(current => displayMidafternoonNutrientsForIndex == index ? !current : true);
                                        setDisplayMidafternoonNutrientsForIndex(index)
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between", // changed to 'space-between'
                                        flexDirection: 'row',
                                        padding: HeightRatio(5),
                                        paddingTop: HeightRatio(10)
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    fontFamily: "SofiaSansSemiCondensed-ExtraBold"
                                                }}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                                margin: HeightRatio(10),
                                                padding: HeightRatio(4),
                                                paddingLeft: HeightRatio(20),
                                                paddingRight: HeightRatio(20),
                                                borderRadius: HeightRatio(10)
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(20),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(30),
                                            height: HeightRatio(40),
                                            width: HeightRatio(40),
                                            display: 'flex',
                                            alignItems: "flex-end",
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


                            </View>
                            {displayMidafternoonNutrients && displayMidafternoonNutrientsForIndex == index &&
                                <>
                                    <View
                                        style={{
                                            width: windowWidth - HeightRatio(120),
                                            alignSelf: 'center',
                                            padding: HeightRatio(5)
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    // marginTop: HeightRatio(5),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        padding: 10,
                                        marginBottom: HeightRatio(4),
                                        alignSelf: 'center'
                                    }}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 5,
                                                    width: windowWidth - HeightRatio(130),
                                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                    margin: HeightRatio(2),
                                                    padding: HeightRatio(10),
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
                                                        textAlign: 'right',
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
                                    <TouchableOpacity
                                        onPress={() => {setModalVisible(true); setDeleteID(data.id)}}
                                        style={{
                                            backgroundColor: 'rgba(255, 0, 75, 0.90)',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            paddingLeft: HeightRatio(20),
                                            paddingRight: HeightRatio(20),
                                            borderRadius: HeightRatio(10),
                                            width: '80%',
                                            alignSelf: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(25),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                                textAlign: 'center'
                                            }}
                                        >
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            }


                        </View>

                    ))}


                    {/* DINNER */}
                    <TouchableOpacity
                        // onPress={() => displayScheduleData("Dinner")}
                        onPress={() => {displayScheduleData(!displaBool_Dinner ? "Dinner" : null); setDisplaBool_Dinner(current => !current)}}
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
                    {dinnerData.map((data, index) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(80),
                                alignSelf: 'center'
                            }}
                            key={index}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayDinnerNutrients(current => displayDinnerNutrientsForIndex == index ? !current : true);
                                        setDisplayDinnerNutrientsForIndex(index)
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between", // changed to 'space-between'
                                        flexDirection: 'row',
                                        padding: HeightRatio(5),
                                        paddingTop: HeightRatio(10)
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    fontFamily: "SofiaSansSemiCondensed-ExtraBold"
                                                }}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                                margin: HeightRatio(10),
                                                padding: HeightRatio(4),
                                                paddingLeft: HeightRatio(20),
                                                paddingRight: HeightRatio(20),
                                                borderRadius: HeightRatio(10)
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(20),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(30),
                                            height: HeightRatio(40),
                                            width: HeightRatio(40),
                                            display: 'flex',
                                            alignItems: "flex-end",
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


                            </View>
                            {displayDinnerNutrients && displayDinnerNutrientsForIndex == index &&
                                <>
                                    <View
                                        style={{
                                            width: windowWidth - HeightRatio(120),
                                            alignSelf: 'center',
                                            padding: HeightRatio(5)
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    // marginTop: HeightRatio(5),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        padding: 10,
                                        marginBottom: HeightRatio(4),
                                        alignSelf: 'center'
                                    }}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 5,
                                                    width: windowWidth - HeightRatio(130),
                                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                    margin: HeightRatio(2),
                                                    padding: HeightRatio(10),
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
                                                        textAlign: 'right',
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
                                    <TouchableOpacity
                                        onPress={() => {setModalVisible(true); setDeleteID(data.id)}}
                                        style={{
                                            backgroundColor: 'rgba(255, 0, 75, 0.90)',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            paddingLeft: HeightRatio(20),
                                            paddingRight: HeightRatio(20),
                                            borderRadius: HeightRatio(10),
                                            width: '80%',
                                            alignSelf: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(25),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                                textAlign: 'center'
                                            }}
                                        >
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            }


                        </View>

                    ))}


                    {/* BEFORE BED */}
                    <TouchableOpacity
                        onPress={() => {displayScheduleData(!displaBool_BeforeBed ? "Before Bed" : null); setDisplaBool_BeforeBed(current => !current)}}
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
                    {beforeBedData.map((data, index) => (
                        <View
                            style={{
                                backgroundColor: '#a39bc9',
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10),
                                width: windowWidth - HeightRatio(80),
                                alignSelf: 'center'
                            }}
                            key={index}
                        >
                            <View
                                style={{
                                    width: windowWidth - HeightRatio(120),
                                    alignSelf: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayBeforeBedNutrients(current => displayBeforeBedNutrientsForIndex == index ? !current : true);
                                        setDisplayBeforeBedNutrientsForIndex(index)
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between", // changed to 'space-between'
                                        flexDirection: 'row',
                                        padding: HeightRatio(5),
                                        paddingTop: HeightRatio(10)
                                    }}
                                >
                                    <View
                                        style={{flexDirection: 'column'}}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    fontFamily: "SofiaSansSemiCondensed-ExtraBold"
                                                }}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: 'rgba(30, 228, 168, 1.0)',
                                                margin: HeightRatio(10),
                                                padding: HeightRatio(4),
                                                paddingLeft: HeightRatio(20),
                                                paddingRight: HeightRatio(20),
                                                borderRadius: HeightRatio(10)
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(20),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            padding: HeightRatio(10),
                                            borderRadius: HeightRatio(30),
                                            height: HeightRatio(40),
                                            width: HeightRatio(40),
                                            display: 'flex',
                                            alignItems: "flex-end",
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


                            </View>
                            {displayBeforeBedNutrients && displayBeforeBedNutrientsForIndex == index &&
                                <>
                                    <View
                                        style={{
                                            width: windowWidth - HeightRatio(120),
                                            alignSelf: 'center',
                                            padding: HeightRatio(5)
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderBottomWidth: 2,
                                                borderBottomColor: 'black'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontSize: HeightRatio(25),
                                                    // marginTop: HeightRatio(5),
                                                    fontFamily: "SofiaSansSemiCondensed-Regular"
                                                }}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        padding: 10,
                                        marginBottom: HeightRatio(4),
                                        alignSelf: 'center'
                                    }}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 5,
                                                    width: windowWidth - HeightRatio(130),
                                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                    margin: HeightRatio(2),
                                                    padding: HeightRatio(10),
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
                                                        textAlign: 'right',
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
                                    <TouchableOpacity
                                        onPress={() => {setModalVisible(true); setDeleteID(data.id)}}
                                        style={{
                                            backgroundColor: 'rgba(255, 0, 75, 0.90)',
                                            margin: HeightRatio(10),
                                            padding: HeightRatio(10),
                                            paddingLeft: HeightRatio(20),
                                            paddingRight: HeightRatio(20),
                                            borderRadius: HeightRatio(10),
                                            width: '80%',
                                            alignSelf: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: HeightRatio(25),
                                                fontFamily: "SofiaSansSemiCondensed-Regular",
                                                textAlign: 'center'
                                            }}
                                        >
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            }


                        </View>

                    ))}

                </ScrollView>
            </SafeAreaView>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                    }}
                >
                    <View
                        style={{
                            // flex: 1,
                            backgroundColor: "#2f2c4f",
                            margin: 20,
                            zIndex: 999,
                            borderRadius: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute', bottom: HeightRatio(30), left: 0, right: 0
                        }}
                    >
                        <View
                            style={{
                                margin: HeightRatio(20),
                                alignSelf: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: HeightRatio(30),
                                    width: (windowWidth - WidthRatio(100)),
                                }}
                            >
                                Are you sure that you want to delete this entry?
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignSelf: 'center'
                            }}
                        >
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <View style={{
                                    backgroundColor: 'rgba(26, 105, 125, 0.50)',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(10),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: (windowWidth - WidthRatio(100)) / 2,
                                    margin: HeightRatio(10)
                                }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: HeightRatio(25),
                                            alignSelf: 'center',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular'
                                        }}
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
                                <View style={{
                                    backgroundColor: 'rgba(255, 0, 75, 0.50)',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(10),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: (windowWidth - WidthRatio(100)) / 2,
                                    margin: HeightRatio(10)
                                }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: HeightRatio(25),
                                            alignSelf: 'center',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular'
                                        }}
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
        //   flex: 1,
        height: HeightRatio(530)

    },
    scrollView: {
        //   backgroundColor: 'blue',
        width: windowWidth - HeightRatio(20),
    },
});
