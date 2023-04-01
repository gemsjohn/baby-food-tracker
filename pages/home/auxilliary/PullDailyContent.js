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
            let entry = tracker[i].entry[0]

            const codePoints = entry.emotion
                .split('')
                .map(char => char.charCodeAt(0).toString(16).padStart(4, '0'));
            const unicodeEscape = '\\u' + codePoints.join('\\u');

            let item = entry.item;
            itemsArray.push(item); // add foodItem to the itemsArray


            emotionIndex.push({ item: entry.item, emoji: unicodeEscape, schedule: entry.schedule, time: entry.time, nutrients: entry.nutrients, measurement: entry.amount, id: tracker[i]._id, foodGroup: entry.foodGroup })

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
