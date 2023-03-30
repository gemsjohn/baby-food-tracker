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
import { top_100 } from './TOP_100';

export const usePullDailyContent = (input, subuser) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [matchingDate, setMatchingDate] = useState([]);
    const [totalCalorieCount, setTotalCalorieCount] = useState(null);
    const [uniqueItemsArray, setUniqueItemsArray] = useState(null)

    // Schedule Arrays
    const [firstThing, setFirstThing] = useState([]);
    const [firstThingCalTotal, setFirstThingCalTotal] = useState(null)

    const [breakfast, setBreakfast] = useState([]);
    const [breakfastCalTotal, setBreakfastCalTotal] = useState(null)

    const [midmorning, setMidmorning] = useState([]);
    const [midmorningCalTotal, setMidmorningCalTotal] = useState(null)

    const [lunch, setLunch] = useState([]);
    const [lunchCalTotal, setLunchCalTotal] = useState(null)

    const [afternoon, setAfternoon] = useState([]);
    const [afternoonCalTotal, setAfternoonCalTotal] = useState(null)

    const [dinner, setDinner] = useState([]);
    const [dinnerCalTotal, setDinnerCalTotal] = useState(null)

    const [beforeBed, setBeforeBed] = useState([]);
    const [beforeBedCalTotal, setBeforeBedCalTotal] = useState(null)

    const [custom, setCustom] = useState([]);
    const [customCalTotal, setCustomCalTotal] = useState(null)

    const [uniqueEmotionArray, setUniqueEmotionArray] = useState([])

    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });



    const getTrackerEntryByDate = (date) => {
        refetch()
        setMatchingDate([])
        // console.log(subuser)
        if (subuser && subuser.tracker) {
            for (let i = 0; i < subuser.tracker.length; i++) {
                if (subuser.tracker[i].date == date) {
                    setMatchingDate(prev => [...prev, subuser.tracker[i]]);
                }
            }
        }

    }


    useEffect(() => {
        // console.log(input)
        getTrackerEntryByDate(input)
    }, [input])

    let array_0 = top_100;
    let array_1 = [];
    let commonIndex = [];
    let emotionIndex = [];

    const breakDownMatchingDate = (tracker) => {
        setFirstThing([])
        setBreakfast([])
        setMidmorning([])
        setLunch([])
        setAfternoon([])
        setDinner([])
        setBeforeBed([])
        setCustom([])

        let itemsArray = []; // create an empty array to store food items
        // console.log(tracker);
        for (let i = 0; i < tracker.length; i++) {
            let entry = JSON.parse(JSON.stringify(tracker[i].entry[0]));
            

            function removeBackslashes(str) {
                let pattern = /(?<!\\)\\(?!\\)/g;
                let replacement = '';
                let updatedStr = str.replace(pattern, replacement);

                return updatedStr;
            }

            const removeQuotes = (str) => {
                return str.replace(/^"(.*)"$/, '$1');
            }

            let item = entry.item;
            item = removeQuotes(removeBackslashes(JSON.stringify(item)))
            itemsArray.push(item); // add foodItem to the itemsArray

            let emotion = entry.emotion;
            emotion = removeQuotes(JSON.stringify(emotion))
            const codePoints = emotion
                .split('')
                .map(char => char.charCodeAt(0).toString(16).padStart(4, '0'));
            const unicodeEscape = '\\u' + codePoints.join('\\u');

            // console.log(unicodeEscape)

            let schedule = entry.schedule;
            schedule = removeQuotes(removeBackslashes(JSON.stringify(schedule)))

            let time = entry.time;
            time = removeQuotes(removeBackslashes(JSON.stringify(time)))

            let nutrients = entry.nutrients;
            let nutrients_calories = nutrients.calories;
            nutrients_calories = JSON.parse(nutrients_calories);
            nutrients_calories = nutrients_calories.amount



            // nutrients = removeQuotes(removeBackslashes(JSON.stringify(nutrients)))

            let measurement = entry.amount;
            measurement = removeQuotes(removeBackslashes(JSON.stringify(measurement)))

            // let ID = entry._id;
            // ID = removeQuotes(removeBackslashes(JSON.stringify(ID)))
            let ID = JSON.parse(JSON.stringify(tracker[i]._id));
            ID = removeQuotes(removeBackslashes(JSON.stringify(ID)))

            let foodGroup = entry.foodGroup;
            foodGroup = removeQuotes(removeQuotes(removeBackslashes(JSON.stringify(foodGroup))))

            emotionIndex.push({ item: item, emoji: unicodeEscape, schedule: schedule, time: time, nutrients: nutrients, measurement: measurement, id: ID, foodGroup: foodGroup })


            if (schedule == "First Thing") {
                setFirstThing(prev => [...prev, nutrients_calories])
            }
            if (schedule == "Breakfast") {
                setBreakfast(prev => [...prev, nutrients_calories])
            }
            if (schedule == "Midmorning") {
                setMidmorning(prev => [...prev, nutrients_calories])
            }
            if (schedule == "Lunch") {
                setLunch(prev => [...prev, nutrients_calories])
            }
            if (schedule == "Afternoon") {
                setAfternoon(prev => [...prev, nutrients_calories])
            }
            if (schedule == "Dinner") {
                setDinner(prev => [...prev, nutrients_calories])
            }
            if (schedule == "Before Bed") {
                setBeforeBed(prev => [...prev, nutrients_calories])
            }
            if (schedule == "Custom") {
                setCustom(prev => [...prev, nutrients_calories])
            }

        }

        array_1 = itemsArray.filter((item, index) => itemsArray.indexOf(item) === index);
        array_1.forEach((item1, index1) => {
            array_0.forEach((item2, index2) => {
                const itemName = item2.name.toUpperCase();
                if (item1.includes(itemName)) {
                    commonIndex.push(index1);
                }
            });
        });

        // console.log(commonIndex);

        function updateArray(arr, indexArr) {
            return arr.map((item, index) => {
                if (indexArr.includes(index)) {
                    return { name: item, tried: true };
                } else {
                    return { name: item, tried: false };
                }
            });
        }
        let commonIndex_Updated = updateArray(array_1, commonIndex);

        // remove duplicates from the itemsArray using the filter method
        setUniqueItemsArray(commonIndex_Updated);
        setUniqueEmotionArray(emotionIndex)
        // console.log(emotionIndex)
    }


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
        setTotalCalorieCount(total)
    }, [firstThingCalTotal, breakfastCalTotal, midmorningCalTotal, lunchCalTotal, afternoonCalTotal, dinnerCalTotal, beforeBedCalTotal, customCalTotal])

    useEffect(() => {
        breakDownMatchingDate(matchingDate)
    }, [matchingDate])

    return { calendarModalCalorieTotal: totalCalorieCount, calendarModalDate: input, calendarModalFoods: uniqueItemsArray, calendarModalEmotion: uniqueEmotionArray }
}
