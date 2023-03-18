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
import { HeightRatio, windowWidth } from "../../../Styling"
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../../utils/queries';
import { MainStateContext } from '../../../App';



export const DailySchedule = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [matchingDate, setMatchingDate] = useState([]);

    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });


    const getTrackerEntryByDate = (date) => {
        refetch()


        if (userByID?.user.tracker != []) {
            console.log("# - User Tracker Length: " + userByID?.user.tracker.length)
            for (let i = 0; i < userByID?.user.tracker.length; i ++) {
                if (userByID?.user.tracker[i].date == date) {
                    console.log("# - Tracker array, matching date: " + i)
                    setMatchingDate(prev => [...prev, userByID?.user.tracker[i].entry]);

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
        // console.log(input[0])

        const jsonString = JSON.stringify(input[0]);

        function removeBackslashes(str) {
            let pattern = /(?<!\\)\\(?!\\)/g;
            let replacement = '';
            let updatedStr = str.replace(pattern, replacement);
            
            return updatedStr;
        }

        const removeQuotes = (str) => {
            return str.replace(/^"(.*)"$/, '$1');
        }



        let sample = removeBackslashes(`${jsonString}`);
        
        console.log(removeQuotes(sample))
    }


    useEffect(() => {
        breakDownMatchingDate(matchingDate)
    }, [matchingDate])


    return (
        <>
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
            <View
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    width: '90%',
                    padding: HeightRatio(15),
                    margin: HeightRatio(4),
                    borderRadius: HeightRatio(10),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: 'center',
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: HeightRatio(30),
                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                    }}
                >
                    First Thing
                </Text>
            </View>

            <View
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    width: '90%',
                    padding: HeightRatio(15),
                    margin: HeightRatio(4),
                    borderRadius: HeightRatio(10),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: 'center',
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: HeightRatio(30),
                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                    }}
                >
                    Breakfast
                </Text>
            </View>

            <View
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    width: '90%',
                    padding: HeightRatio(15),
                    margin: HeightRatio(4),
                    borderRadius: HeightRatio(10),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: 'center',
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: HeightRatio(30),
                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                    }}
                >
                    Midmorning
                </Text>
            </View>

            <View
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    width: '90%',
                    padding: HeightRatio(15),
                    margin: HeightRatio(4),
                    borderRadius: HeightRatio(10),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: 'center',
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: HeightRatio(30),
                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                    }}
                >
                    Lunch
                </Text>
            </View>

            <View
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    width: '90%',
                    padding: HeightRatio(15),
                    margin: HeightRatio(4),
                    borderRadius: HeightRatio(10),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: 'center',
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: HeightRatio(30),
                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                    }}
                >
                    Midafter-noon
                </Text>
            </View>

            <View
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    width: '90%',
                    padding: HeightRatio(15),
                    margin: HeightRatio(4),
                    borderRadius: HeightRatio(10),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: 'center',
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: HeightRatio(30),
                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                    }}
                >
                    Dinner
                </Text>
            </View>

            <View
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    width: '90%',
                    padding: HeightRatio(15),
                    margin: HeightRatio(4),
                    borderRadius: HeightRatio(10),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: 'center',
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: HeightRatio(30),
                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                    }}
                >
                    Before Bed
                </Text>
            </View>
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
  