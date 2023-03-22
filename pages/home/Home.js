import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
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
import { StatusBar } from 'expo-status-bar';
import { Styling, windowHeight, windowWidth, HeightRatio, WidthRatio } from '../../Styling';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import moment from 'moment'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import { Navbar } from '../../components/Navbar';
import { MainStateContext } from '../../App';
import { GLOBAL_GRAPHQL_API_URL } from '../../App'
import { convertDateFormat } from './auxilliary/ConvertDateFormat';
import { SelectedFoodDetails } from './auxilliary/SelectedFoodDetails';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_ENTRY } from '../../utils/mutations';
import { GET_USER_BY_ID } from '../../utils/queries';
import { DailySchedule } from './auxilliary/DailySchedule';
import { Loading } from '../../components/Loading';
import { Calendar } from 'react-native-calendars';
import { usePullDailyContent } from './auxilliary/PullDailyContent';

export const HomeScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [loading, setLoading] = useState(false);
    const [displayUsername, setDisplayUsername] = useState(false);
    const authState = useRef(false);
    const userID = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshing_Nutrition, setRefreshing_Nutrition] = useState(false);
    const [recentFoodData, setRecentFoodData] = useState([])
    const [clearSuggestions, setClearSuggestions] = useState(false)
    const [selectRecentlyUsed, setSelectRecentlyUsed] = useState(null)
    const [totalCalorieCount, setTotalCalorieCount] = useState(null)
    const [selectRecentlyUsedData, setSelectRecentlyUsedData] = useState(null)
    const [selectedFoodDataEntrered, setSelectedFoodDataEntrered] = useState(false);

    const onRefresh = useCallback(() => {
        setLoading(true)
        refetch();
        setRefreshing(true);
        setRefreshing_Nutrition(true)
        setTimeout(() => {
            setRefreshing(false);
            setRefreshing_Nutrition(false)
        }, 2000);
    }, []);

    const [addEntry] = useMutation(ADD_ENTRY);
    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    // # - DATE
    const formatString = 'DD/MM/YYYY';
    const [currentDate, setCurrentDate] = useState(moment().format(formatString));
    const [currentDateReadable, setCurrentDateReadable] = useState('')

    //  # - Calendar
    const [calendarModalVisible, setCalendarModalVisible] = useState(false);
    const [selectedCalendarModalDate, setSelectedCalendarModalDate] = useState('');
    const[selectedDateFromCalendar, setSelectedDateFromCalendar] = useState(null)

    const onDateSelect = (day) => {
        const selectedDate = moment(day.dateString).format(formatString); // convert date to desired format
        setSelectedCalendarModalDate(day.dateString);
        setSelectedDateFromCalendar(selectedDate);
        // setCurrentDate(selectedDate); // update current date with formatted date
    };

    const { calendarModalCalorieTotal, calendarModalDate } = usePullDailyContent(`${convertDateFormat(selectedDateFromCalendar)}`);


    // # - ADD FOOD
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [foodData, setFoodData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [displayDetails, setDisplayDetails] = useState(false);
    const [displayLoading, setDisplayLoading] = useState(false);

    const handlePreviousDay = () => {
        setCurrentDate(moment(currentDate, formatString).subtract(1, 'days').format(formatString));
    }

    const handleNextDay = () => {
        setCurrentDate(moment(currentDate, formatString).add(1, 'days').format(formatString));
    }

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            authState.current = mainState.current.authState
            userID.current = mainState.current.userID;

            setTimeout(() => {
                setLoading(false)
            }, 500)
        }, 500)

        setInterval(() => {
            getTotalCalorieCount()

            if (mainState.current.triggerRefresh) {
                setRefreshing(true)
                refetch()
            } else {
                setRefreshing(false)
            }

            if (mainState.current.selectedFood_Quantity != null && mainState.current.selectedFood_Measurement != null && mainState.current.selectedFood_Schedule != null) {
                setSelectedFoodDataEntrered(true)
            } else {
                setSelectedFoodDataEntrered(false)

            }
        }, 200)
    }, [])


    useEffect(() => {
        setCurrentDateReadable(convertDateFormat(currentDate));
    }, [currentDate])

    const handleSearch = async () => {
        setClearSuggestions(true)
        console.log(`Searching for: ${searchQuery}`);
        setDisplayLoading(true)
        const data = {
            search: searchQuery
        };

        const prompt = encodeURIComponent(JSON.stringify(data));

        const config = {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            url: `${GLOBAL_GRAPHQL_API_URL}/query-usda/${prompt}`
        }

        axios(config)
            .then((response) => {
                if (response.data.result[0] === "ERROR") {
                    console.log("ERROR")
                } else {
                    setFoodData(response.data.result);
                    setDisplayLoading(false)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getNutritionValue = async (input) => {
        setRefreshing_Nutrition(true)
        console.log('# - INPUT: ')
        console.log(input)
        console.log(typeof input)

        const data = {
            search: input,
            quantity: mainState.current.selectedFood_Quantity,
            measurement: mainState.current.selectedFood_Measurement
        };

        if (recentFoodData != [] && selectRecentlyUsed != null && recentFoodData[selectRecentlyUsed].number == data.quantity && recentFoodData[selectRecentlyUsed].measurement == data.measurement) {
            console.log("# - getNutritionValue / recentFoodData[selectRecentlyUsed]")
            const nutrients_JSON = JSON.stringify(recentFoodData[selectRecentlyUsed].nutrients);
            console.log(input)
            console.log(data.search)
            const updateUserEntry = async () => {

                await addEntry({
                    variables: {
                        date: `${currentDateReadable}`,
                        schedule: `${mainState.current.selectedFood_Schedule}`,
                        item: `${recentFoodData[selectRecentlyUsed].item}`,
                        amount: `${mainState.current.selectedFood_Quantity} ${mainState.current.selectedFood_Measurement}`,
                        nutrients: `${nutrients_JSON}`
                    }
                });
                onRefresh();
            }
            updateUserEntry();
        } else {
            console.log("# - getNutritionValue / newFoodData")

            const prompt = encodeURIComponent(JSON.stringify(data));

            const config = {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                url: `${GLOBAL_GRAPHQL_API_URL}/api/npc/${prompt}`
            }

            axios(config)
                .then((response) => {
                    if (response.data.result[0] === "ERROR") {
                        console.log("ERROR")
                    } else {
                        console.log("# - getNutritionvalue:")
                        console.log(mainState.current.selectedFood_Quantity)
                        console.log(mainState.current.selectedFood_Measurement)
                        console.log(mainState.current.selectedFood_Schedule)
                        console.log("# --------------------------------------")

                        const nutrients_JSON = JSON.stringify(response.data.result);
                        const updateUserEntry = async () => {

                            let itemData = input.description;

                            if (input.description == undefined && recentFoodData[selectRecentlyUsed].item != '') {
                                itemData = recentFoodData[selectRecentlyUsed].item;
                            }

                            await addEntry({
                                variables: {
                                    date: `${currentDateReadable}`,
                                    schedule: `${mainState.current.selectedFood_Schedule}`,
                                    item: `${itemData}`,
                                    amount: `${mainState.current.selectedFood_Quantity} ${mainState.current.selectedFood_Measurement}`,
                                    nutrients: `${nutrients_JSON}`
                                }
                            });
                            onRefresh();
                        }
                        updateUserEntry();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

        }



    };

    const RecentFood = () => {
        setRecentFoodData([])
        setSelectRecentlyUsed(null)
        const data = userByID?.user.tracker;
        const data_array = data.slice(-5);

        for (let i = 0; i < data_array.length; i++) {
            function removeBackslashes(str) {
                let pattern = /(?<!\\)\\(?!\\)/g;
                let replacement = '';
                let updatedStr = str.replace(pattern, replacement);

                return updatedStr;
            }

            const removeQuotes = (str) => {
                return str.replace(/^"(.*)"$/, '$1');
            }

            let item = JSON.stringify(data_array[i].entry[0].item);
            item = removeQuotes(item);
            let amount = JSON.stringify(data_array[i].entry[0].amount);
            amount = removeQuotes(amount)
            let nutrients = JSON.stringify(data_array[i].entry[0].nutrients);
            nutrients = removeBackslashes(nutrients)
            nutrients = removeQuotes(nutrients)
            nutrients = JSON.parse(nutrients)
            let id = data_array[i]._id;

            function separateMeasurement(inputString) {
                const regex = /(\d+\.\d+|\d+)\s*(\w+)/;
                const matches = inputString.match(regex);

                if (matches && matches.length === 3) {
                    const number = parseFloat(matches[1]);
                    const measurement = matches[2];

                    return { number, measurement };
                }

                return null;
            }

            const result = separateMeasurement(amount);

            let item_amount = { item: item, amount: amount, number: result.number, measurement: result.measurement, nutrients: nutrients, id: id }
            setRecentFoodData(prev => [...prev, item_amount])
        }
    }

    const renderItem = ({ item }) => {
        return (
            <>

                {item.description != '' &&
                    <View
                        style={styles.renderItem_Search_Results}
                        key={item.fdcId}
                    >
                        {displayDetails ?
                            <SelectedFoodDetails />
                            :
                            <>
                                <View style={styles.renderItem_Search_Result_Container}>
                                    <Text
                                        style={styles.renderItem_Search_Result_Container_Text}
                                        allowFontScaling={false}
                                    >
                                        {item.description}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedItem(item);
                                        setDisplayDetails(true)
                                    }}
                                    style={styles.renderItem_Search_Result_Container_Plus}
                                >
                                    <Text style={styles.renderItem_Search_Result_Container_Plus_Text}>
                                        +
                                    </Text>
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                }
            </>
        );
    };

    const getTotalCalorieCount = async () => {
        try {
            const value = await AsyncStorage.getItem('@TotalCalorieCount')
            if (value !== null) {
                // value previously stored
                setTotalCalorieCount(value)
                setTimeout(() => {
                    setLoading(false)
                }, 100)
            }
        } catch (e) {
            // error reading value
        }
    }

    const [fontsLoaded] = useFonts({
        'GochiHand_400Regular': require('../../assets/fonts/GochiHand-Regular.ttf'),
        'SofiaSansSemiCondensed-Regular': require('../../assets/fonts/SofiaSansSemiCondensed-Regular.ttf'),
        'SofiaSansSemiCondensed-ExtraBold': require('../../assets/fonts/SofiaSansSemiCondensed-ExtraBold.ttf')
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }
    return (
        <>
            {!loading ?
                <>
                    {refreshing || refreshing_Nutrition &&
                        <View style={styles.updatingScreen_Container}>
                            <Text
                                style={styles.updatingScreen_Container_Text}
                                allowFontScaling={false}
                            >
                                Updating...
                            </Text>
                        </View>
                    }
                    {modalVisible && <View style={styles.modalVisible_Blackout} />}
                    {calendarModalVisible && <View style={styles.modalVisible_Blackout} />}
                    <View
                        style={styles.homePrimary_Container}
                        onLayout={onLayoutRootView}
                    >
                        <View style={styles.homePrimary_Date}>
                            <TouchableOpacity
                                onPress={() => {
                                    handlePreviousDay();
                                    setLoading(true);
                                }}
                                style={styles.homePrimary_Date_Arrow}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faArrowLeft}
                                    style={{ color: 'white' }}
                                    size={25}
                                />
                            </TouchableOpacity>
                            <View style={styles.homePrimary_Date_Current}>
                                <TouchableOpacity
                                    onPress={() => setCalendarModalVisible(true)}
                                >
                                    <Text
                                        style={styles.homePrimary_Date_Current_Text}
                                        allowFontScaling={false}
                                    >
                                        {currentDateReadable}
                                    </Text>
                                </TouchableOpacity>
                                {currentDate != moment().format(formatString) &&
                                    <TouchableOpacity
                                        onPress={() => {
                                            setCurrentDate(moment().format(formatString));
                                            setLoading(true)
                                        }}
                                        style={styles.homePrimary_Date_Return_Button}
                                    >
                                        <Text
                                            style={styles.homePrimary_Date_Return_Button_Text}
                                            allowFontScaling={false}
                                        >
                                            Return to Today
                                        </Text>
                                    </TouchableOpacity>
                                }
                            </View>


                            <TouchableOpacity
                                onPress={() => {
                                    handleNextDay();
                                    setLoading(true);
                                }}
                                style={styles.homePrimary_Date_Arrow}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faArrowRight}
                                    style={{ color: 'white' }}
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>

                        {!refreshing && !refreshing_Nutrition ?
                            <>
                                <Image
                                    source={require('../../assets/pattern_1.png')}
                                    style={styles.homePrimary_Pattern_1}
                                />
                                <DailySchedule date={currentDateReadable} userID={mainState.current.userID} />

                                <View style={{ flexDirection: 'row', marginTop: HeightRatio(10) }}>
                                    <View style={styles.homePrimary_TotalCalories}>
                                        <Text style={styles.homePrimary_TotalCalories_Text}>
                                            {totalCalorieCount}
                                        </Text>
                                        <Text
                                            style={{
                                                ...styles.homePrimary_TotalCalories_Text,
                                                fontSize: HeightRatio(20),
                                            }}
                                        >
                                            CALORIES
                                        </Text>
                                    </View>

                                    {/* Add Button */}
                                    <TouchableOpacity
                                        onPress={() => {
                                            setClearSuggestions(false)
                                            RecentFood()
                                            setModalVisible(true);
                                            setSearchQuery('');
                                            setSelectedItem(null);
                                            setDisplayDetails(false);
                                            setFoodData([]);
                                            setMainState({
                                                selectedFood_Quantity: null,
                                                selectedFood_Measurement: null,
                                                selectedFood_Schedule: null
                                            })
                                        }}
                                        style={styles.homePrimary_Add_Button}
                                    >
                                        <Text
                                            style={styles.homePrimary_Add_Button_Text}
                                            allowFontScaling={false}
                                        >
                                            ADD
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                            :
                            <View style={styles.updatingScreen_Container}>
                                <Text
                                    style={styles.updatingScreen_Container_Text}
                                    allowFontScaling={false}
                                >
                                    Updating...
                                </Text>
                            </View>
                        }
                    </View>


                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        style={{
                            width: windowWidth,
                        }}
                    >

                        <View style={styles.modalVisible_Container}>
                            <Image
                                source={require('../../assets/pattern_1.png')}
                                style={{
                                    ...styles.homePrimary_Pattern_1,
                                    margin: HeightRatio(20),
                                    borderRadius: HeightRatio(10)
                                }}
                            />
                            <TextInput
                                type="text"
                                name="search"
                                placeholder="Search for food"
                                placeholderTextColor="white"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={handleSearch}
                                style={styles.modalVisible_TextInput}
                                disableFullscreenUI={true}
                                allowFontScaling={false}
                            />
                            <TouchableOpacity onPress={() => { handleSearch() }}>
                                <View style={styles.modalVisible_Search_Button}>
                                    <Text
                                        style={styles.modalVisible_Search_Button_Text}
                                        allowFontScaling={false}
                                    >
                                        Search
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                ...styles.modalVisible_Container,
                                height: windowHeight / 1.9,
                                margin: HeightRatio(0)
                            }}
                        >
                            <Image
                                source={require('../../assets/pattern_1.png')}
                                style={{
                                    ...styles.homePrimary_Pattern_1,
                                    margin: HeightRatio(20),
                                    alignSelf: 'center'
                                }}
                            />

                            {!clearSuggestions && !searchQuery &&
                                <>
                                    <View style={styles.modalVisible_Title_Container}>
                                        <Text
                                            style={styles.modalVisible_Title_Container_Text}
                                            allowFontScaling={false}
                                        >
                                            Recently Used
                                        </Text>
                                    </View>
                                    <SafeAreaView style={styles.container}>
                                        <ScrollView style={styles.scrollView}>
                                            <View>
                                                {recentFoodData.map((data, index) => (
                                                    <View key={index}>
                                                        {selectRecentlyUsed == null ?

                                                            <View style={styles.modalVisible_recentFoodData_Map_Container_0}>
                                                                <View style={styles.modalVisible_recentFoodData_Map_Container_1}>
                                                                    <View style={styles.modalVisible_recentFoodData_Map_Container_2}>
                                                                        <View style={{ flexDirection: 'column' }}>
                                                                            <View>
                                                                                <Text style={styles.modalVisible_recentFoodData_Map_Text_Bold}>
                                                                                    {data.item}
                                                                                </Text>
                                                                            </View>
                                                                            <View style={{ marginLeft: HeightRatio(5) }}>
                                                                                <Text style={styles.modalVisible_recentFoodData_Map_Text_Regular}>
                                                                                    {data.amount}
                                                                                </Text>
                                                                            </View>
                                                                        </View>
                                                                        <TouchableOpacity
                                                                            onPress={() => { setSelectRecentlyUsed(index); setSelectRecentlyUsedData(data); }}
                                                                            style={styles.modalVisible_recentFoodData_Map_Plus}
                                                                        >
                                                                            <Text style={styles.modalVisible_recentFoodData_Map_Plus_Text}>
                                                                                +
                                                                            </Text>
                                                                        </TouchableOpacity>
                                                                    </View>

                                                                </View>
                                                            </View>
                                                            :
                                                            <>
                                                                {selectRecentlyUsed == index &&
                                                                    <>
                                                                        <View style={styles.modalVisible_recentFoodData_Map_Container_0}>
                                                                            <Text
                                                                                style={styles.modalVisible_recentFoodData_Map_Container_0_RecentlyUsed_Text}
                                                                                allowFontScaling={false}
                                                                            >
                                                                                {data.item}
                                                                            </Text>
                                                                            <SelectedFoodDetails textInputValue={`${data.number}`} selectedItem={`${data.measurement}`} />
                                                                        </View>
                                                                        <TouchableOpacity
                                                                            onPress={() => {
                                                                                setSelectRecentlyUsed(null)
                                                                                setSelectRecentlyUsedData(null)
                                                                            }}
                                                                            style={styles.modalVisible_faX}
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={faSolid, faX}
                                                                                style={{ color: 'white' }}
                                                                                size={20}
                                                                            />
                                                                        </TouchableOpacity>
                                                                    </>
                                                                }
                                                            </>
                                                        }
                                                    </View>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </SafeAreaView>
                                </>
                            }

                            {foodData != [] &&
                                <View style={{ flex: 1 }}>
                                    {displayLoading ?
                                        <ActivityIndicator />
                                        :
                                        <>
                                            {displayDetails &&
                                                <>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setSelectedItem(null);
                                                            setDisplayDetails(false)
                                                        }}
                                                        style={{
                                                            ...styles.modalVisible_faX,
                                                            right: HeightRatio(-25),
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSolid, faX}
                                                            style={{ color: 'white' }}
                                                            size={20}
                                                        />
                                                    </TouchableOpacity>
                                                </>
                                            }

                                            <FlatList
                                                data={selectedItem ? [selectedItem] : foodData}
                                                renderItem={renderItem}
                                                keyExtractor={(item) => item.fdcId.toString()}
                                            />
                                        </>
                                    }
                                </View>
                            }

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignSelf: 'center'
                                }}
                            >
                                {selectedFoodDataEntrered ?
                                    <>
                                        <TouchableOpacity onPress={() => { setModalVisible(false); }}>
                                            <View style={{ ...styles.modalVisible_HalfButton, backgroundColor: 'rgba(255, 0, 75, 0.50)' }}>
                                                <Text
                                                    style={styles.modalVisible_Button_Text}
                                                    allowFontScaling={false}
                                                >
                                                    Close
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                getNutritionValue(selectedItem == null && selectRecentlyUsedData.item != null ? selectRecentlyUsedData.item : selectedItem); // selectedItem == null && recentFoodData.item != null ? recentFoodData.item : selectedItem
                                                setModalVisible(false);
                                            }}
                                        >
                                            <View style={{ ...styles.modalVisible_HalfButton, backgroundColor: 'rgba(30, 228, 168, 0.5)' }}>
                                                <Text
                                                    style={styles.modalVisible_Button_Text}
                                                    allowFontScaling={false}
                                                >
                                                    Save
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                    :
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <View style={styles.modalVisible_FullButton}>
                                            <Text
                                                style={styles.modalVisible_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                Close
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                }

                            </View>

                        </View>

                    </Modal>

                    <Modal
                        visible={calendarModalVisible}
                        animationType="slide"
                        transparent={true}
                        style={{
                            width: windowWidth,
                        }}
                    >
                        <View style={styles.modalVisible_Container}>
                            <Calendar
                                onDayPress={(day) => onDateSelect(day)}
                                markedDates={{ [selectedCalendarModalDate]: { selected: true } }}
                                theme={{
                                    calendarBackground: '#1f1f27',
                                    textMonthFontSize: 20,
                                    monthTextColor: 'white',
                                    arrowColor: 'white',
                                    selectedDayBackgroundColor: 'rgba(30, 228, 168, 1.0)',
                                    selectedDayTextColor: 'black',
                                    todayTextColor: 'rgba(30, 228, 168, 1.0)',
                                    dayTextColor: 'rgba(30, 228, 168, 0.25)',
                                    textDisabledColor: 'rgba(255, 255, 255, 0.25)',
                                    textDayFontFamily: 'SofiaSansSemiCondensed-Regular',
                                    textDayFontSize: HeightRatio(15),

                                }}
                                style={{
                                    width: windowWidth - HeightRatio(40)
                                }}
                            />
                            {!selectedCalendarModalDate &&
                                <TouchableOpacity 
                                    onPress={() => {
                                        setCalendarModalVisible(false);
                                        setSelectedCalendarModalDate('')
                                    }}
                                >
                                    <View style={styles.modalVisible_FullButton}>
                                        <Text
                                            style={styles.modalVisible_Button_Text}
                                            allowFontScaling={false}
                                        >
                                            Close
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                        {selectedCalendarModalDate &&
                            <View style={styles.modalVisible_Container}>
                                <View
                                    style={{
                                        height: HeightRatio(200)
                                    }}
                                >
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={styles.homePrimary_TotalCalories}>
                                            <Text
                                                style={{
                                                    ...styles.homePrimary_TotalCalories_Text,
                                                    fontSize: HeightRatio(20),
                                                }}
                                                allowFontScaling={false}
                                            >
                                                {calendarModalDate}
                                            </Text>
                                        </View>
                                        <View style={{...styles.homePrimary_TotalCalories, backgroundColor: 'transparent',}}>
                                            <Text 
                                                style={{...styles.homePrimary_TotalCalories_Text, fontSize: HeightRatio(20), color: 'white'}}
                                                allowFontScaling={false}
                                            >
                                                {calendarModalCalorieTotal} CALORIES
                                            </Text>
                                        </View>
                                    </View>

                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            setCalendarModalVisible(false);
                                            setSelectedCalendarModalDate('');
                                            
                                        }}
                                    >
                                        <View style={{...styles.modalVisible_HalfButton, backgroundColor: 'rgba(255, 0, 75, 0.50)'}}>
                                            <Text
                                                style={styles.modalVisible_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                Close
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            // setCurrentDate(selectedDateFromCalendar);
                                            // setCalendarModalVisible(false);
                                            // setSelectedCalendarModalDate('');
                                            console.log("# - Home: " + calendarModalCalorieTotal)
                                        }}
                                    >
                                        <View style={{...styles.modalVisible_HalfButton, backgroundColor: 'rgba(30, 228, 168, 0.50)'}}>
                                            <Text
                                                style={styles.modalVisible_Button_Text}
                                                allowFontScaling={false}
                                            >
                                                Go
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </Modal>




                </>
                :
                <View style={styles.loading_Container}>
                    <Loading />
                </View>
            }
            {!modalVisible &&
                <Navbar nav={navigation} auth={mainState.current.authState} position={'absolute'} from={'home'} />
            }
            <StatusBar
                barStyle="default"
                hidden={true}
                backgroundColor="transparent"
                translucent={true}
                networkActivityIndicatorVisible={true}
            />
        </>

    )
}

const styles = StyleSheet.create({
    table: {
        padding: 10,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        width: windowWidth - HeightRatio(100)
    },
    cell: {
        flex: 1,
        textAlign: 'left',

    },
    container: {
        height: '80%'

    },
    scrollView: {
        width: '80%',
        alignSelf: 'center'
    },
    renderItem_Search_Results: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    renderItem_Search_Result_Container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: 'row',
        padding: HeightRatio(8),
        width: windowWidth - HeightRatio(140),
    },
    renderItem_Search_Result_Container_Text: {
        color: "white",
        fontSize: HeightRatio(25),
        fontFamily: "SofiaSansSemiCondensed-Regular",
        display: 'flex',
        flexWrap: 'wrap',
    },
    renderItem_Search_Result_Container_Plus: {
        backgroundColor: 'rgba(247, 255, 108, 1.00)',
        borderRadius: HeightRatio(10),
        height: HeightRatio(40),
        width: HeightRatio(40),
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
    },
    renderItem_Search_Result_Container_Plus_Text: {
        color: 'black',
        fontSize: HeightRatio(30),
        fontFamily: "SofiaSansSemiCondensed-ExtraBold"
    },
    updatingScreen_Container: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        position: 'absolute',
        zIndex: 100,
        height: windowHeight,
        width: windowWidth,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    updatingScreen_Container_Text: {
        color: '#ffff00',
        textAlign: 'center',
        fontSize: HeightRatio(30),
        fontFamily: 'GochiHand_400Regular',
        marginTop: HeightRatio(10)
    },
    homePrimary_Container: {
        flex: 1,
        backgroundColor: '#1f1f27',
        display: 'flex',
        alignItems: 'center',
        width: windowWidth
    },
    homePrimary_Date: {
        width: windowWidth,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: HeightRatio(80)
    },
    homePrimary_Date_Arrow: {
        height: '100%',
        width: HeightRatio(90),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth * 0.2,
        backgroundColor: 'rgba(71, 66, 106, 0.25)',
    },
    homePrimary_Date_Current: {
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: windowWidth / 1.5,
        backgroundColor: 'rgba(71, 66, 106, 0.25)',
    },
    homePrimary_Date_Current_Text: {
        color: 'white',
        fontSize: HeightRatio(30),
        fontFamily: 'GochiHand_400Regular',
        marginLeft: HeightRatio(10),
        marginRight: HeightRatio(10)
    },
    homePrimary_Date_Return_Button: {
        backgroundColor: 'rgba(235, 35, 81, 1.00)',
        borderRadius: HeightRatio(10),
        position: 'absolute',
        alignSelf: 'center',
        top: HeightRatio(65),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: HeightRatio(4),
        paddingLeft: HeightRatio(10),
        paddingRight: HeightRatio(10)
    },
    homePrimary_Date_Return_Button_Text: {
        color: 'white',
        fontSize: HeightRatio(20),
        fontFamily: 'SofiaSansSemiCondensed-Regular',
    },
    homePrimary_Pattern_1: {
        height: '100%',
        width: '100%',
        opacity: 0.02,
        position: 'absolute',
        zIndex: -10
    },
    homePrimary_TotalCalories: {
        alignSelf: 'center',
        backgroundColor: ' rgba(247, 255, 108, 1.00)',
        margin: HeightRatio(5),
        borderRadius: 10,
        padding: HeightRatio(10),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    homePrimary_TotalCalories_Text: {
        color: 'black',
        fontSize: HeightRatio(60),
        textAlign: 'center',
        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
    },
    homePrimary_Add_Button: {
        backgroundColor: 'rgba(30, 228, 168, 1.0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: HeightRatio(20),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        margin: HeightRatio(4)
    },
    homePrimary_Add_Button_Text: {
        color: 'black',
        fontSize: HeightRatio(30),
        textAlign: 'center',
        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
    },
    modalVisible_Blackout: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        height: '100%', width: '100%',
        position: 'absolute', zIndex: 10
    },
    modalVisible_Container: {
        backgroundColor: "#1f1f27",
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
    modalVisible_TextInput: {
        ...Styling.textInputStyle,
        marginTop: HeightRatio(20),
        height: HeightRatio(70),
        fontSize: HeightRatio(30),
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    },
    modalVisible_Search_Button: {
        backgroundColor: 'rgba(30, 228, 168, 0.50)',
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        width: windowWidth - WidthRatio(100),
        margin: HeightRatio(10)
    },
    modalVisible_Search_Button_Text: {
        color: 'white',
        fontSize: HeightRatio(25),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    },
    modalVisible_Title_Container: {
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(10),
        alignSelf: 'center',
        width: windowWidth - WidthRatio(100),
        marginTop: HeightRatio(10),
    },
    modalVisible_Title_Container_Text: {
        color: 'white',
        fontSize: HeightRatio(30),
        alignSelf: 'center',
        fontFamily: 'GochiHand_400Regular'
    },
    modalVisible_recentFoodData_Map_Container_0: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: HeightRatio(10),
        margin: HeightRatio(4),
        width: windowWidth - HeightRatio(80),
        alignSelf: 'center',
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
    },
    modalVisible_recentFoodData_Map_Container_1: {
        width: windowWidth - HeightRatio(120),
        alignSelf: 'center'
    },
    modalVisible_recentFoodData_Map_Container_2: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: 'row',
        padding: HeightRatio(8),
    },
    modalVisible_recentFoodData_Map_Text_Bold: {
        color: 'white',
        fontSize: HeightRatio(25),
        fontFamily: "SofiaSansSemiCondensed-ExtraBold"
    },
    modalVisible_recentFoodData_Map_Text_Regular: {
        color: 'white',
        fontSize: HeightRatio(20),
        fontFamily: "SofiaSansSemiCondensed-Regular"
    },
    modalVisible_recentFoodData_Map_Plus: {
        backgroundColor: 'rgba(247, 255, 108, 1.00)',
        borderRadius: HeightRatio(10),
        height: HeightRatio(40),
        width: HeightRatio(40),
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
    },
    modalVisible_recentFoodData_Map_Plus_Text: {
        color: 'black',
        fontSize: HeightRatio(30),
        fontFamily: "SofiaSansSemiCondensed-ExtraBold"
    },
    modalVisible_recentFoodData_Map_Container_0_RecentlyUsed_Text: {
        color: "white",
        fontSize: HeightRatio(25),
        fontFamily: "SofiaSansSemiCondensed-Regular",
        textAlign: 'center',
        width: '80%',
        display: 'flex',
        flexWrap: 'wrap',
        margin: HeightRatio(5)
    },
    modalVisible_faX: {
        height: HeightRatio(30),
        width: HeightRatio(30),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1000,
        top: HeightRatio(5),
        right: HeightRatio(5),
        borderRadius: HeightRatio(10),
        backgroundColor: 'red'
    },
    modalVisible_FullButton: {
        backgroundColor: 'rgba(255, 0, 75, 0.50)',
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        width: (windowWidth - WidthRatio(100)),
        margin: HeightRatio(10)
    },
    modalVisible_HalfButton: {
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(10),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        width: (windowWidth - WidthRatio(100)) / 2,
        margin: HeightRatio(10)
    },
    modalVisible_Button_Text: {
        color: 'white',
        fontSize: HeightRatio(25),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    },
    loading_Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: HeightRatio(505),
        backgroundColor: 'rgba(71, 66, 106, 1.00)'
    }
});