import React, { useEffect, useState, useContext, useRef, useCallback, useLayoutEffect } from 'react';
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
import { HeightRatio, windowWidth } from '../../../../Styling';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../../../utils/queries';
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
} from '../../../../COLOR'
import { PieChart } from 'react-native-chart-kit';
import { MainStateContext } from '../../../../App';



const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
};

const styles = StyleSheet.create({
    chartContainer: {
        marginVertical: 8,
    },
    chartLabel: {
        textAlign: 'center',
        marginBottom: 8,
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(30),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-ExtraBold'
    },
});

export const FoodGroupMetrics = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [matchingDate, setMatchingDate] = useState([]);

    const [fruitCal, setFruitCal] = useState([])
    const [fruitCalTotal, setFruitCalTotal] = useState(null)

    const [vegetableCal, setVegetableCal] = useState([])
    const [vegetableCalTotal, setVegetableCalTotal] = useState(null)

    const [proteinCal, setProteinCal] = useState([])
    const [proteinCalTotal, setProteinCalTotal] = useState(null)

    const [grainCal, setGrainCal] = useState([])
    const [grainCalTotal, setGrainCalTotal] = useState(null)

    const [dairyCal, setDairyCal] = useState([])
    const [dairyCalTotal, setDairyCalTotal] = useState(null)



    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    const getTrackerEntryByDate = (date) => {
        refetch()
        setMatchingDate([])

        if (props.subuser && props.subuser.tracker != []) {
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
        setFruitCal([])
        setVegetableCal([])
        setProteinCal([])
        setGrainCal([])
        setDairyCal([])

        getTrackerEntryByDate(props.date)
    }, [props.date])

    useEffect(() => {
        if (props.subuser != undefined) {
            getTrackerEntryByDate(props.date)
        }
    }, [props.subuser])

    const breakDownMatchingDate = (tracker) => {
        setFruitCal([])
        setVegetableCal([])
        setProteinCal([])
        setGrainCal([])
        setDairyCal([])

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

            let nutrients = entry.nutrients;
            let nutrients_calories = nutrients.calories;
            nutrients_calories = JSON.parse(nutrients_calories);
            nutrients_calories = nutrients_calories.amount

            let foodGroup = entry.foodGroup;
            foodGroup = removeQuotes(removeQuotes(removeBackslashes(JSON.stringify(foodGroup))))


            if (foodGroup == "fruit") {
                setFruitCal(prev => [...prev, nutrients_calories])
            }
            if (foodGroup == "vegetable") {
                setVegetableCal(prev => [...prev, nutrients_calories])
            }
            if (foodGroup == "protein") {
                setProteinCal(prev => [...prev, nutrients_calories])
            }
            if (foodGroup == "grain") {
                setGrainCal(prev => [...prev, nutrients_calories])
            }
            if (foodGroup == "dairy") {
                setDairyCal(prev => [...prev, nutrients_calories])
            }
        }

    }

    useEffect(() => {
        breakDownMatchingDate(matchingDate)
    }, [matchingDate])

    // UPDATE SCHEDULE SECTION TOTAL CAL's
    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < fruitCal.length; i++) {
            sum += fruitCal[i];
        }

        setFruitCalTotal(sum)
    }, [fruitCal])

    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < vegetableCal.length; i++) {
            sum += vegetableCal[i];
        }

        setVegetableCalTotal(sum)
    }, [vegetableCal])

    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < proteinCal.length; i++) {
            sum += proteinCal[i];
        }

        setProteinCalTotal(sum)
    }, [proteinCal])

    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < grainCal.length; i++) {
            sum += grainCal[i];
        }

        setGrainCalTotal(sum)
    }, [grainCal])

    useEffect(() => {
        let sum = 0;

        for (let i = 0; i < dairyCal.length; i++) {
            sum += dairyCal[i];
        }

        setDairyCalTotal(sum)
    }, [dairyCal])

    const data = [
        {
            name: 'Fruit',
            calories: fruitCalTotal,
            color: '#FF6384',
            legendFontColor: 'white',
            legendFontSize: 12,
        },
        {
            name: 'Vegetable',
            calories: vegetableCalTotal,
            color: '#36A2EB',
            legendFontColor: 'white',
            legendFontSize: 12,
        },
        {
            name: 'Protein',
            calories: proteinCalTotal,
            color: '#FFCE56',
            legendFontColor: 'white',
            legendFontSize: 12,
        },
        {
            name: 'Grain',
            calories: grainCalTotal,
            color: '#4BC0C0',
            legendFontColor: 'white',
            legendFontSize: 12,
        },
        {
            name: 'Dairy',
            calories: dairyCalTotal,
            color: '#9966FF',
            legendFontColor: 'white',
            legendFontSize: 12,
        },
    ];


    return (
        <View style={styles.chartContainer}>
            <Text style={styles.chartLabel}>Daily Food Groups ( Calories )</Text>
            {fruitCalTotal + vegetableCalTotal + proteinCalTotal + grainCalTotal + dairyCalTotal > 0 ?
                <PieChart
                    data={data}
                    width={400}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="calories"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    center={[0, 0]}
                    absolute={true}
                />
                :
                <View
                    style={{
                        flexDirection: 'column',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: windowWidth - HeightRatio(100),
                        alignSelf: 'center'
                    }}
                >
                    <Image
                        source={require('../../../../assets/favicon_0.png')}
                        style={{
                            height: HeightRatio(200),
                            width: HeightRatio(200),
                            alignSelf: 'center'
                        }}
                    />
                    <Text
                        style={{
                            color: THEME_FONT_COLOR_WHITE,
                            fontSize: HeightRatio(30),
                            fontFamily: "SofiaSansSemiCondensed-Regular",
                            textAlign: 'center',
                        }}
                    >
                        Currently, you do not have any daily entries. Add a daily entry to see data.
                    </Text>
                </View>
            }
        </View>
    );
};

