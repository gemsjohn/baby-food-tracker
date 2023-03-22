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

export const usePullDailyContent = (input) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [matchingDate, setMatchingDate] = useState([]);
    const [totalCalorieCount, setTotalCalorieCount] = useState(null);

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
        getTrackerEntryByDate(input)
        console.log(input)
    }, [input])

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
        
        setTotalCalorieCount(total)
        console.log("# - Pull Daily Content: " + total)
    }, [firstThingCalTotal, breakfastCalTotal, midmorningCalTotal, lunchCalTotal, afternoonCalTotal, dinnerCalTotal, beforeBedCalTotal])

    useEffect(() => {
        breakDownMatchingDate(matchingDate)
    }, [matchingDate])

    return { calendarModalCalorieTotal: totalCalorieCount, calendarModalDate: input }
}
