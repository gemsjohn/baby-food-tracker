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

            <SafeAreaView style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                >
                    {/* FIRST THING */}
                    <TouchableOpacity
                        onPress={() => {
                            displayScheduleData(!displaBool_FirstThing ? "First Thing" : null);
                            setDisplaBool_FirstThing(current => !current)
                            setDisplaBool_Breakfast(false)
                            setDisplaBool_Midmorning(false)
                            setDisplaBool_Lunch(false)
                            setDisplaBool_Afternoon(false)
                            setDisplaBool_Dinner(false)
                            setDisplaBool_BeforeBed(false)
                        }}
                        style={{
                            ...styles.scheduleButton,
                            backgroundColor: displaBool_FirstThing ? '#3ed29b' : "#371b50"
                        }}
                    >
                        <Image
                            source={require('../../../assets/pattern_0.png')}
                            style={styles.scheduleButton_Pattern_0}
                        />
                        <Text
                            style={{
                                ...styles.scheduleButton_Text,
                                color: displaBool_FirstThing ? 'black' : 'white',
                            }}
                            allowFontScaling={false}
                        >
                            First Thing
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={styles.scheduleButton_Calorie_Container}
                        >
                            <Text
                                style={{
                                    ...styles.scheduleButton_Calorie_Container_Text,
                                    color: displaBool_FirstThing ? 'black' : 'white',
                                }}
                                allowFontScaling={false}
                            >
                                {firstThingCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={styles.scheduleButton_faBars}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{ color: 'black' }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {firstThingData.map((data, index) => (
                        <View
                            style={styles.scheduleButton_subContent}
                            key={index}
                        >
                            <View style={styles.scheduleButton_subContent_Container}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayFirstThingNutrients(current => displayFirstThingNutrientsForIndex == index ? !current : true);
                                        setDisplayFirstThingNutrientsForIndex(index)
                                    }}
                                    style={styles.scheduleButton_subContent_Container_Button}
                                >
                                    <View
                                        style={{ flexDirection: 'column' }}
                                    >
                                        <View>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View style={styles.scheduleButton_subContent_Container_Button_DataAmount_Container}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={styles.scheduleButton_faBars}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSolid, faBars}
                                            style={{ color: 'white' }}
                                            size={20}
                                        />
                                    </View>
                                </TouchableOpacity>


                            </View>
                            {displayFirstThingNutrients && displayFirstThingNutrientsForIndex == index &&
                                <>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_0}>
                                        <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1_Text}
                                                allowFontScaling={false}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Container_0}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={styles.scheduleButton_subContent_NutritionDetails_Map_Container}
                                                key={key}
                                            >
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {key.replace('_', ' ')}
                                                </Text>
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {data.nutrients[key].amount} {data.nutrients[key].unit}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => { setModalVisible(true); setDeleteID(data.id) }}
                                        style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button}
                                    >
                                        <Text 
                                            style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button_Text}
                                            allowFontScaling={false}
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
                        onPress={() => {
                            displayScheduleData(!displaBool_Breakfast ? "Breakfast" : null);
                            setDisplaBool_FirstThing(false)
                            setDisplaBool_Breakfast(current => !current)
                            setDisplaBool_Midmorning(false)
                            setDisplaBool_Lunch(false)
                            setDisplaBool_Afternoon(false)
                            setDisplaBool_Dinner(false)
                            setDisplaBool_BeforeBed(false)
                        }}
                        style={{
                            ...styles.scheduleButton,
                            backgroundColor: displaBool_Breakfast ? '#3ed29b' : "#371b50"
                        }}
                    >
                        <Image
                            source={require('../../../assets/pattern_0.png')}
                            style={styles.scheduleButton_Pattern_0}
                        />
                        <Text
                            style={{
                                ...styles.scheduleButton_Text,
                                color: displaBool_Breakfast ? 'black' : 'white',
                            }}
                            allowFontScaling={false}
                        >
                            Breakfast
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={styles.scheduleButton_Calorie_Container}
                        >
                            <Text
                                style={{
                                    ...styles.scheduleButton_Calorie_Container_Text,
                                    color: displaBool_Breakfast ? 'black' : 'white',
                                }}
                                allowFontScaling={false}
                            >
                                {breakfastCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={styles.scheduleButton_faBars}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{ color: 'black' }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {breakfastData.map((data, index) => (
                        <View
                            style={styles.scheduleButton_subContent}
                            key={index}
                        >
                            <View style={styles.scheduleButton_subContent_Container}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayBreakfastNutrients(current => displayBreakfastNutrientsForIndex == index ? !current : true);
                                        setDisplayBreakfastNutrientsForIndex(index)
                                    }}
                                    style={styles.scheduleButton_subContent_Container_Button}
                                >
                                    <View
                                        style={{ flexDirection: 'column' }}
                                    >
                                        <View>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View style={styles.scheduleButton_subContent_Container_Button_DataAmount_Container}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={styles.scheduleButton_faBars}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSolid, faBars}
                                            style={{ color: 'white' }}
                                            size={20}
                                        />
                                    </View>
                                </TouchableOpacity>


                            </View>
                            {displayBreakfastNutrients && displayBreakfastNutrientsForIndex == index &&
                                <>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_0}>
                                        <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1_Text}
                                                allowFontScaling={false}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Container_0}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={styles.scheduleButton_subContent_NutritionDetails_Map_Container}
                                                key={key}
                                            >
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {key.replace('_', ' ')}
                                                </Text>
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {data.nutrients[key].amount} {data.nutrients[key].unit}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => { setModalVisible(true); setDeleteID(data.id) }}
                                        style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button}
                                    >
                                        <Text 
                                            style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button_Text}
                                            allowFontScaling={false}
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
                        onPress={() => {
                            displayScheduleData(!displaBool_Midmorning ? "Midmorning" : null);
                            setDisplaBool_FirstThing(false)
                            setDisplaBool_Breakfast(false)
                            setDisplaBool_Midmorning(current => !current)
                            setDisplaBool_Lunch(false)
                            setDisplaBool_Afternoon(false)
                            setDisplaBool_Dinner(false)
                            setDisplaBool_BeforeBed(false)
                        }}
                        style={{
                            ...styles.scheduleButton,
                            backgroundColor: displaBool_Midmorning ? '#3ed29b' : "#371b50"
                        }}
                    >
                        <Image
                            source={require('../../../assets/pattern_0.png')}
                            style={styles.scheduleButton_Pattern_0}
                        />
                        <Text
                            style={{
                                ...styles.scheduleButton_Text,
                                color: displaBool_Midmorning ? 'black' : 'white',
                            }}
                            allowFontScaling={false}
                        >
                            Midmorning
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={styles.scheduleButton_Calorie_Container}
                        >
                            <Text
                                style={{
                                    ...styles.scheduleButton_Calorie_Container_Text,
                                    color: displaBool_Midmorning ? 'black' : 'white',
                                }}
                                allowFontScaling={false}
                            >
                                {midmorningCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={styles.scheduleButton_faBars}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{ color: 'black' }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {midmorningData.map((data, index) => (
                        <View
                            style={styles.scheduleButton_subContent}
                            key={index}
                        >
                            <View style={styles.scheduleButton_subContent_Container}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayMidmorningNutrients(current => displayMidmorningNutrientsForIndex == index ? !current : true);
                                        setDisplayMidmorningNutrientsForIndex(index)
                                    }}
                                    style={styles.scheduleButton_subContent_Container_Button}
                                >
                                    <View
                                        style={{ flexDirection: 'column' }}
                                    >
                                        <View>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View style={styles.scheduleButton_subContent_Container_Button_DataAmount_Container}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={styles.scheduleButton_faBars}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSolid, faBars}
                                            style={{ color: 'white' }}
                                            size={20}
                                        />
                                    </View>
                                </TouchableOpacity>


                            </View>
                            {displayMidmorningNutrients && displayMidmorningNutrientsForIndex == index &&
                                <>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_0}>
                                        <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1_Text}
                                                allowFontScaling={false}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Container_0}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={styles.scheduleButton_subContent_NutritionDetails_Map_Container}
                                                key={key}
                                            >
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {key.replace('_', ' ')}
                                                </Text>
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {data.nutrients[key].amount} {data.nutrients[key].unit}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => { setModalVisible(true); setDeleteID(data.id) }}
                                        style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button}
                                    >
                                        <Text 
                                            style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button_Text}
                                            allowFontScaling={false}
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
                        onPress={() => {
                            displayScheduleData(!displaBool_Lunch ? "Lunch" : null);
                            setDisplaBool_FirstThing(false)
                            setDisplaBool_Breakfast(false)
                            setDisplaBool_Midmorning(false)
                            setDisplaBool_Lunch(current => !current)
                            setDisplaBool_Afternoon(false)
                            setDisplaBool_Dinner(false)
                            setDisplaBool_BeforeBed(false)
                        }}
                        style={{
                            ...styles.scheduleButton,
                            backgroundColor: displaBool_Lunch ? '#3ed29b' : "#371b50"
                        }}
                    >
                        <Image
                            source={require('../../../assets/pattern_0.png')}
                            style={styles.scheduleButton_Pattern_0}
                        />
                        <Text
                            style={{
                                ...styles.scheduleButton_Text,
                                color: displaBool_Lunch ? 'black' : 'white',
                            }}
                            allowFontScaling={false}
                        >
                            Lunch
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={styles.scheduleButton_Calorie_Container}
                        >
                            <Text
                                style={{
                                    ...styles.scheduleButton_Calorie_Container_Text,
                                    color: displaBool_Lunch ? 'black' : 'white',
                                }}
                                allowFontScaling={false}
                            >
                                {lunchCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={styles.scheduleButton_faBars}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{ color: 'black' }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {lunchData.map((data, index) => (
                        <View
                            style={styles.scheduleButton_subContent}
                            key={index}
                        >
                            <View style={styles.scheduleButton_subContent_Container}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayLunchNutrients(current => displayLunchNutrientsForIndex == index ? !current : true);
                                        setDisplayLunchNutrientsForIndex(index)
                                    }}
                                    style={styles.scheduleButton_subContent_Container_Button}
                                >
                                    <View
                                        style={{ flexDirection: 'column' }}
                                    >
                                        <View>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View style={styles.scheduleButton_subContent_Container_Button_DataAmount_Container}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={styles.scheduleButton_faBars}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSolid, faBars}
                                            style={{ color: 'white' }}
                                            size={20}
                                        />
                                    </View>
                                </TouchableOpacity>


                            </View>
                            {displayLunchNutrients && displayLunchNutrientsForIndex == index &&
                                <>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_0}>
                                        <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1_Text}
                                                allowFontScaling={false}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Container_0}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={styles.scheduleButton_subContent_NutritionDetails_Map_Container}
                                                key={key}
                                            >
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {key.replace('_', ' ')}
                                                </Text>
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {data.nutrients[key].amount} {data.nutrients[key].unit}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => { setModalVisible(true); setDeleteID(data.id) }}
                                        style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button}
                                    >
                                        <Text 
                                            style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button_Text}
                                            allowFontScaling={false}
                                        >
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            }


                        </View>

                    ))}

                    {/* AFTERNOON */}
                    <TouchableOpacity
                        onPress={() => {
                            displayScheduleData(!displaBool_Afternoon ? "Afternoon" : null);
                            setDisplaBool_FirstThing(false)
                            setDisplaBool_Breakfast(false)
                            setDisplaBool_Midmorning(false)
                            setDisplaBool_Lunch(false)
                            setDisplaBool_Afternoon(current => !current)
                            setDisplaBool_Dinner(false)
                            setDisplaBool_BeforeBed(false)
                        }}
                        style={{
                            ...styles.scheduleButton,
                            backgroundColor: displaBool_Afternoon ? '#3ed29b' : "#371b50"
                        }}
                    >
                        <Image
                            source={require('../../../assets/pattern_0.png')}
                            style={styles.scheduleButton_Pattern_0}
                        />
                        <Text
                            style={{
                                ...styles.scheduleButton_Text,
                                color: displaBool_Afternoon ? 'black' : 'white',
                            }}
                            allowFontScaling={false}
                        >
                            Afternoon
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={styles.scheduleButton_Calorie_Container}
                        >
                            <Text
                                style={{
                                    ...styles.scheduleButton_Calorie_Container_Text,
                                    color: displaBool_Afternoon ? 'black' : 'white',
                                }}
                                allowFontScaling={false}
                            >
                                {afternoonCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={styles.scheduleButton_faBars}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{ color: 'black' }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {afternoonData.map((data, index) => (
                        <View
                            style={styles.scheduleButton_subContent}
                            key={index}
                        >
                            <View style={styles.scheduleButton_subContent_Container}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayAfternoonNutrients(current => displayAfternoonNutrientsForIndex == index ? !current : true);
                                        setDisplayAfternoonNutrientsForIndex(index)
                                    }}
                                    style={styles.scheduleButton_subContent_Container_Button}
                                >
                                    <View
                                        style={{ flexDirection: 'column' }}
                                    >
                                        <View>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View style={styles.scheduleButton_subContent_Container_Button_DataAmount_Container}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={styles.scheduleButton_faBars}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSolid, faBars}
                                            style={{ color: 'white' }}
                                            size={20}
                                        />
                                    </View>
                                </TouchableOpacity>


                            </View>
                            {displayAfternoonNutrients && displayAfternoonNutrientsForIndex == index &&
                                <>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_0}>
                                        <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1_Text}
                                                allowFontScaling={false}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Container_0}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={styles.scheduleButton_subContent_NutritionDetails_Map_Container}
                                                key={key}
                                            >
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {key.replace('_', ' ')}
                                                </Text>
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {data.nutrients[key].amount} {data.nutrients[key].unit}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => { setModalVisible(true); setDeleteID(data.id) }}
                                        style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button}
                                    >
                                        <Text 
                                            style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button_Text}
                                            allowFontScaling={false}
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
                        onPress={() => {
                            displayScheduleData(!displaBool_Dinner ? "Dinner" : null);
                            setDisplaBool_FirstThing(false)
                            setDisplaBool_Breakfast(false)
                            setDisplaBool_Midmorning(false)
                            setDisplaBool_Lunch(false)
                            setDisplaBool_Afternoon(false)
                            setDisplaBool_Dinner(current => !current)
                            setDisplaBool_BeforeBed(false)
                        }}
                        style={{
                            ...styles.scheduleButton,
                            backgroundColor: displaBool_Dinner ? '#3ed29b' : "#371b50"
                        }}
                    >
                        <Image
                            source={require('../../../assets/pattern_0.png')}
                            style={styles.scheduleButton_Pattern_0}
                        />
                        <Text
                            style={{
                                ...styles.scheduleButton_Text,
                                color: displaBool_Dinner ? 'black' : 'white',
                            }}
                            allowFontScaling={false}
                        >
                            Dinner
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={styles.scheduleButton_Calorie_Container}
                        >
                            <Text
                                style={{
                                    ...styles.scheduleButton_Calorie_Container_Text,
                                    color: displaBool_Dinner ? 'black' : 'white',
                                }}
                                allowFontScaling={false}
                            >
                                {dinnerCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={styles.scheduleButton_faBars}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{ color: 'black' }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {dinnerData.map((data, index) => (
                        <View
                            style={styles.scheduleButton_subContent}
                            key={index}
                        >
                            <View style={styles.scheduleButton_subContent_Container}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayDinnerNutrients(current => displayDinnerNutrientsForIndex == index ? !current : true);
                                        setDisplayDinnerNutrientsForIndex(index)
                                    }}
                                    style={styles.scheduleButton_subContent_Container_Button}
                                >
                                    <View
                                        style={{ flexDirection: 'column' }}
                                    >
                                        <View>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View style={styles.scheduleButton_subContent_Container_Button_DataAmount_Container}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={styles.scheduleButton_faBars}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSolid, faBars}
                                            style={{ color: 'white' }}
                                            size={20}
                                        />
                                    </View>
                                </TouchableOpacity>


                            </View>
                            {displayDinnerNutrients && displayDinnerNutrientsForIndex == index &&
                                <>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_0}>
                                        <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1_Text}
                                                allowFontScaling={false}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Container_0}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={styles.scheduleButton_subContent_NutritionDetails_Map_Container}
                                                key={key}
                                            >
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {key.replace('_', ' ')}
                                                </Text>
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {data.nutrients[key].amount} {data.nutrients[key].unit}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => { setModalVisible(true); setDeleteID(data.id) }}
                                        style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button}
                                    >
                                        <Text 
                                            style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button_Text}
                                            allowFontScaling={false}
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
                        onPress={() => {
                            displayScheduleData(!displaBool_BeforeBed ? "Before Bed" : null);
                            setDisplaBool_FirstThing(false)
                            setDisplaBool_Breakfast(false)
                            setDisplaBool_Midmorning(false)
                            setDisplaBool_Lunch(false)
                            setDisplaBool_Afternoon(false)
                            setDisplaBool_Dinner(false)
                            setDisplaBool_BeforeBed(current => !current)
                        }}
                        style={{
                            ...styles.scheduleButton,
                            backgroundColor: displaBool_BeforeBed ? '#3ed29b' : "#371b50"
                        }}
                    >
                        <Image
                            source={require('../../../assets/pattern_0.png')}
                            style={styles.scheduleButton_Pattern_0}
                        />
                        <Text
                            style={{
                                ...styles.scheduleButton_Text,
                                color: displaBool_BeforeBed ? 'black' : 'white',
                            }}
                            allowFontScaling={false}
                        >
                            Before Bed
                        </Text>
                        <View style={{ flex: 1 }} />
                        <View
                            style={styles.scheduleButton_Calorie_Container}
                        >
                            <Text
                                style={{
                                    ...styles.scheduleButton_Calorie_Container_Text,
                                    color: displaBool_BeforeBed ? 'black' : 'white',
                                }}
                                allowFontScaling={false}
                            >
                                {beforeBedCalTotal} Cal
                            </Text>
                        </View>
                        <View
                            style={styles.scheduleButton_faBars}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faBars}
                                style={{ color: 'black' }}
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    {beforeBedData.map((data, index) => (
                        <View
                            style={styles.scheduleButton_subContent}
                            key={index}
                        >
                            <View style={styles.scheduleButton_subContent_Container}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDisplayBeforeBedNutrients(current => displayBeforeBedNutrientsForIndex == index ? !current : true);
                                        setDisplayBeforeBedNutrientsForIndex(index)
                                    }}
                                    style={styles.scheduleButton_subContent_Container_Button}
                                >
                                    <View
                                        style={{ flexDirection: 'column' }}
                                    >
                                        <View>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.item}
                                            </Text>
                                        </View>
                                        <View style={styles.scheduleButton_subContent_Container_Button_DataAmount_Container}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_Container_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                {data.amount}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={styles.scheduleButton_faBars}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSolid, faBars}
                                            style={{ color: 'white' }}
                                            size={20}
                                        />
                                    </View>
                                </TouchableOpacity>


                            </View>
                            {displayBeforeBedNutrients && displayBeforeBedNutrientsForIndex == index &&
                                <>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_0}>
                                        <View style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1}>
                                            <Text 
                                                style={styles.scheduleButton_subContent_NutritionDetails_Title_Container_1_Text}
                                                allowFontScaling={false}
                                            >
                                                Nutrition Details
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.scheduleButton_subContent_NutritionDetails_Container_0}>
                                        {Object.keys(data.nutrients).map((key) => (
                                            <View
                                                style={styles.scheduleButton_subContent_NutritionDetails_Map_Container}
                                                key={key}
                                            >
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {key.replace('_', ' ')}
                                                </Text>
                                                <Text
                                                    style={styles.scheduleButton_subContent_NutritionDetails_Map_Container_Text}
                                                    allowFontScaling={false}
                                                >
                                                    {data.nutrients[key].amount} {data.nutrients[key].unit}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => { setModalVisible(true); setDeleteID(data.id) }}
                                        style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button}
                                    >
                                        <Text 
                                            style={styles.scheduleButton_subContent_NutritionDetails_Remove_Button_Text}
                                            allowFontScaling={false}
                                        >
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            }


                        </View>

                    ))}
                    <View style={{ height: HeightRatio(40) }} />

                </ScrollView>
            </SafeAreaView>

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
                                <View style={{ ...styles.modalButton, backgroundColor: 'rgba(26, 105, 125, 0.50)' }}>
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
                                <View style={{ ...styles.modalButton, backgroundColor: 'rgba(255, 0, 75, 0.50)' }}>
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
        marginTop: HeightRatio(20),
        height: HeightRatio(560),
        // backgroundColor: 'red'
    },
    scrollView: {
        backgroundColor: '#5cd6e3',
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
        backgroundColor: 'rgba(0,0,0, 0.2)',
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
        borderBottomColor: 'rgba(247, 255, 108, 0.50)',
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
        color: 'white',
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
        borderBottomColor: 'white'
    },
    scheduleButton_subContent_NutritionDetails_Title_Container_1_Text: {
        color: 'white',
        fontSize: HeightRatio(25),
        fontFamily: "SofiaSansSemiCondensed-Regular"
    },
    scheduleButton_subContent_NutritionDetails_Container_0: {
        padding: 10,
        marginBottom: HeightRatio(4),
        alignSelf: 'center'
    },
    scheduleButton_subContent_NutritionDetails_Remove_Button: {
        backgroundColor: 'rgba(255, 0, 75, 0.90)',
        margin: HeightRatio(10),
        padding: HeightRatio(10),
        paddingLeft: HeightRatio(20),
        paddingRight: HeightRatio(20),
        borderRadius: HeightRatio(10),
        width: '80%',
        alignSelf: 'center'
    },
    scheduleButton_subContent_NutritionDetails_Remove_Button_Text: {
        color: 'white',
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
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    modalContainer_1: {
        backgroundColor: "#2f2c4f",
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
        color: 'white',
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
        color: 'white',
        fontSize: HeightRatio(25),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    }
});
