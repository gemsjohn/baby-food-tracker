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
    const [firstThingData, setFirstThingData] = useState([]);
    const [breakfast, setBreakfast] = useState([]);
    const [breakfastData, setBreakfastData] = useState([]);
    const [midmorning, setMidmorning] = useState([]);
    const [midmorningData, setMidmorningData] = useState([]);
    const [lunch, setLunch] = useState([]);
    const [midafternoon, setMidafternoon] = useState([]);
    const [dinner, setDinner] = useState([]);
    const [beforeBed, setBeforeBed] = useState([]);



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
            const jsonString = JSON.stringify(input[i].entry[0].schedule);
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

            if (sample_v2 == "First Thing") {
                setFirstThing(prev => [...prev, sample_v2])
            }
            if (sample_v2 == "Breakfast") {
                setBreakfast(prev => [...prev, sample_v2])
            }
            if (sample_v2 == "Midmorning") {
                setMidmorning(prev => [...prev, sample_v2])
            }
            if (sample_v2 == "Lunch") {
                setLunch(prev => [...prev, sample_v2])
            }
            if (sample_v2 == "Midafter-noon") {
                setMidafternoon(prev => [...prev, sample_v2])
            }
            if (sample_v2 == "Dinner") {
                setDinner(prev => [...prev, sample_v2])
            }
            if (sample_v2 == "Before Bed") {
                setBeforeBed(prev => [...prev, sample_v2])
            }


        }

    }


    useEffect(() => {
        breakDownMatchingDate(matchingDate)
    }, [matchingDate])

    const displayScheduleData = (input) => {
        setBreakfastData([])
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

            console.log(sample_v2)

            if (sample_v2 == input) {
                console.log(i)
                let item = JSON.stringify(matchingDate[i].entry[0].item);
                item = removeQuotes(item);
                let amount = JSON.stringify(matchingDate[i].entry[0].amount);
                amount = removeQuotes(amount)

                let item_amount = {item: item, amount: amount}
                console.log(item_amount)

                // console.log("# - item: " + item)
                // console.log("# - amount: " + amount)

                if (sample_v2 == "First Thing") {
                }
                if (sample_v2 == "Breakfast") {
                    setBreakfastData(prev => [...prev, item_amount])
                }
                if (sample_v2 == "Midmorning") {
                }
                if (sample_v2 == "Lunch") {
                }
                if (sample_v2 == "Midafter-noon") {
                }
                if (sample_v2 == "Dinner") {
                }
                if (sample_v2 == "Before Bed") {
                }
            }
        }
    }

    useEffect(() => {
        console.log(breakfastData)
    }, [breakfastData])


    return (
        <>
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
                                width: HeightRatio(40),
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
                                {firstThing.length}
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
                                width: HeightRatio(40),
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
                                {breakfast.length}
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
                                display: 'flex',
                                // alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: '#a39bc9',
                                width: '70%',
                                alignSelf: 'center',
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(10),
                                margin: HeightRatio(10)
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: HeightRatio(20),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                }}
                            >
                                {data.item}
                            </Text>
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: HeightRatio(20),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                }}
                            >
                                {data.amount}
                            </Text>
                        </View>
                    ))}
                    


                    {/* MIDMORNING */}
                    <TouchableOpacity
                        onPress={() => console.log("MIDMORNING")}
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
                                width: HeightRatio(40),
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
                                {midmorning.length}
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

                    {/* LUNCH */}
                    <TouchableOpacity
                        onPress={() => console.log("LUNCH")}
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
                                width: HeightRatio(40),
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
                                {lunch.length}
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

                    {/* MIDAFTER-NOON */}
                    <TouchableOpacity
                        onPress={() => console.log("MIDAFTER-NOON")}
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
                                width: HeightRatio(40),
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
                                {midafternoon.length}
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


                    {/* DINNER */}
                    <TouchableOpacity
                        onPress={() => console.log("DINNER")}
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
                                width: HeightRatio(40),
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
                                {dinner.length}
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


                    {/* BEFORE BED */}
                    <TouchableOpacity
                        onPress={() => console.log("BEFORE BED")}
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
                                width: HeightRatio(40),
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
                                {beforeBed.length}
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
