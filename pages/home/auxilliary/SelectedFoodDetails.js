import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    TextInput,
} from 'react-native';
import {
    faSolid,
    faX,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Styling, windowWidth, windowHeight, HeightRatio, WidthRatio } from '../../../Styling';
import { MainStateContext } from '../../../App';
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
    THEME_ALT_COLOR_0,
    THEME_ALT_COLOR_1,
    THEME_ALT_COLOR_2
} from '../../../COLOR'
import { CustomTimePicker } from '../time/CustomTimePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const SelectedFoodDetails = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const options = [
        "Milliliters",
        "Ounces",
        "Teaspoons",
        "Tablespoons",
        "Cups",
        "Servings",
        "Minutes"
    ]
    const options_time = [
        "Custom",
        "First Thing",
        "Breakfast",
        "Midmorning",
        "Lunch",
        "Afternoon",
        "Dinner",
        "Before Bed",
    ]

    const options_allergy = [
        "None",
        "Mild",
        "Strong"
    ]
    const options_emotion = [
        '\uD83D\uDE00',
        '\uD83D\uDE10',
        '\uD83E\uDD2E'
    ]
    const [textInputValue, setTextInputValue] = useState(props.textInputValue || null);
    const [selectedItem, setSelectedItem] = useState(props.selectedItem || null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [selectedReaction, setSelectedReaction] = useState(null)
    const [customTime, setCustomTime] = useState('');
    const intervalID = useRef(null)
    const scrollViewRef = useRef();
    // const [scrollPosition, setScrollPosition] = useState(0);

    // console.log(selectedEmotion)
    // console.log(options_emotion[0])
    const decodedEmoji = unescape(selectedEmotion != null ? selectedEmotion.replace(/\\u/g, '%u') : null);
    // console.log(decodedEmoji); // should output '😀'




    useEffect(() => {
        console.log("# - Set initial selectedFood _Quantity, _Measurement, _Schedule")
        setMainState({
            selectedFood_Quantity: props.textInputValue || null,
            selectedFood_Measurement: props.selectedItem || null,
            selectedFood_Schedule: null,
            selectedFood_Schedule_Base: null,
            selectedFood_Schedule_Hour: null,
            selectedFood_Schedule_Minute: null,
            selectedFood_Schedule_AMPM: null,
            selectedFood_Schedule_Custom_Time: null,
            selectedFood_Emotion: null,
            selectedFood_Allergy: null,

        })

    }, [])

    const handleTextChange = (text) => {
        // Only allow numbers, decimals, and fractions in the TextInput
        const numericValue = text.replace(/[^0-9./]/g, '');
        setTextInputValue(numericValue);

        // Check if the numericValue is a valid fraction
        const isFraction = numericValue.includes('/');
        let selectedFood_Quantity;

        if (isFraction) {
            const fractionValues = numericValue.split('/');

            if (fractionValues.length === 2 && !isNaN(fractionValues[0]) && !isNaN(fractionValues[1])) {
                // Convert the fraction to a decimal value
                const decimalValue = parseFloat(fractionValues[0]) / parseFloat(fractionValues[1]);
                selectedFood_Quantity = decimalValue.toFixed(2);
            } else {
                selectedFood_Quantity = '';
            }
        } else {
            selectedFood_Quantity = parseFloat(numericValue).toFixed(2);
        }

        setMainState({
            selectedFood_Quantity: selectedFood_Quantity
        })
    };




    const handleScheduleTime = async (input) => {
        console.log("# - handleScheduleTime")
        console.log(input)

        const removeQuotes = (str) => {
            return str.replace(/^"(.*)"$/, '$1');
        }
        setMainState({
            selectedFood_Schedule_Base: input,
            selectedFood_Schedule: `${input}`,
        })
        if (input == 'Custom') {
            try {
                const value = await AsyncStorage.getItem('@storeCustomScheduleTime')
                if (value !== "null" && value !== null) {
                    setMainState({
                        selectedFood_Schedule_Custom_Time: `${removeQuotes(value)}`
                    })
                    clearInterval(intervalID.current)
                }
            } catch (e) {
                // error reading value
            }
        }

    }

    useEffect(() => {
        if (textInputValue) {
            setMainState({
                selectedFood_Quantity: textInputValue,
                userTouch: true
            })
            handleNextSectionPress()
        } else {
            setMainState({
                selectedFood_Quantity: null,
                userTouch: true
            })
            handleNextSectionPress()
        }
    }, [textInputValue])

    const handleNextSectionPress = () => {
        // Scroll to the next section
        setMainState({
            addFood_trigger_update: true,
        })
    };

   

    return (
        <View style={styles.container}>
            <View style={{ 
                    flexDirection: 'row', 
                    padding: HeightRatio(10), 
                    margin: HeightRatio(10), 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    width: '100%',
                    alignSelf: 'center',
                    borderRadius: HeightRatio(10) 
                }}
            >
                <Text
                    style={styles.header}
                    allowFontScaling={false}
                >
                    Quantity
                </Text>
                <TextInput
                    placeholder=""
                    keyboardType="numeric"
                    value={textInputValue}
                    onChangeText={handleTextChange}
                    style={styles.textInput_Quantity}
                />
            </View>

            <View 
                style={{ 
                    flexDirection: 'row',
                    padding: HeightRatio(10), 
                    margin: HeightRatio(10), 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    width: '100%',
                    alignSelf: 'center',
                    borderRadius: HeightRatio(10)  
                }}
            >
                <View style={{ flexDirection: 'column' }}>
                    <Text
                        style={styles.header}
                        allowFontScaling={false}
                    >
                        Measurement
                    </Text>
                    {options.filter(option => props.item == 'BREAST MILK' ? option : null).map((option) => (
                        <View key={option}>
                            {selectedItem == null && option == 'Minutes' &&
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedItem(option);
                                        setMainState({
                                            selectedFood_Measurement: option,
                                            userTouch: true
                                        })
                                        handleNextSectionPress()
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: HeightRatio(10),
                                        marginTop: HeightRatio(20),
                                        width: WidthRatio(100),
                                        height: WidthRatio(100),
                                        borderRadius: HeightRatio(10),
                                        backgroundColor: THEME_COLOR_POSITIVE
                                    }}

                                >
                                    <Text
                                        style={{ ...styles.itemButton_Text, fontFamily: option == 'Custom' ? 'SofiaSansSemiCondensed-ExtraBold' : 'SofiaSansSemiCondensed-Regular' }}
                                        allowFontScaling={false}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            }
                        </View>
                    ))}
                </View>
                <View style={{ marginTop: HeightRatio(10) }}>
                    {selectedItem != null ?
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.itemButton}>
                                <Text
                                    style={styles.itemButton_Text}
                                    allowFontScaling={false}
                                >
                                    {selectedItem}
                                </Text>
                            </View>
                            
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedItem(null);
                                    setMainState({
                                        selectedFood_Measurement: null,
                                        userTouch: true
                                    })
                                    handleNextSectionPress()

                                }}
                                style={{
                                    backgroundColor: THEME_COLOR_NEGATIVE,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: HeightRatio(4),
                                    borderRadius: HeightRatio(10),
                                    height: HeightRatio(30),
                                    width: HeightRatio(30),
                                    position: 'absolute',
                                    right: HeightRatio(-4),
                                    
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faX}
                                    style={{ color: 'white' }}
                                    size={14}
                                />
                            </TouchableOpacity>

                        </View>
                        :
                        <>
                            {
                                props.item === "SIMILAC" || 
                                props.item === "EARTH'S BEST" ||
                                props.item === "BOBBIE" ||
                                props.item === "ENFAMIL" ||
                                props.item === "UP&UP GENTLE" ?
                                <>
                                {options.filter(option => option === 'Servings').map((option) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedItem(option);
                                            setMainState({
                                                selectedFood_Measurement: option,
                                                userTouch: true
                                            })
                                            handleNextSectionPress()
                                        }}
                                        style={styles.itemButton}
                                        key={option}
                                    >
                                        <Text
                                            style={styles.itemButton_Text}
                                            allowFontScaling={false}
                                        >
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                                </>
                            :
                                <>
                                {options.filter(option => option !== 'Minutes').map((option) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedItem(option);
                                            setMainState({
                                                selectedFood_Measurement: option,
                                                userTouch: true
                                            })
                                            handleNextSectionPress()
                                        }}
                                        style={styles.itemButton}
                                        key={option}
                                    >
                                        <Text
                                            style={styles.itemButton_Text}
                                            allowFontScaling={false}
                                        >
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                                </>
                            }


                        </>
                    }
                </View>
            </View>

            <View 
                style={{ 
                    flexDirection: 'column',
                    padding: HeightRatio(10), 
                    margin: HeightRatio(10), 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    width: '100%',
                    alignSelf: 'center',
                    borderRadius: HeightRatio(10)  
                }}
            >
                <View style={{ flexDirection: 'row'}}>
                <View style={{ flexDirection: 'column' }}>
                    <Text
                        style={styles.header}
                        allowFontScaling={false}
                    >
                        Schedule
                    </Text>
                    {options_time.map((option) => (
                        <View key={option}>
                            {selectedTime == null && option == 'Custom' &&
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedTime(option);
                                        handleScheduleTime(option)
                                        setMainState({
                                            selectedFood_Schedule: option,
                                            userTouch: true
                                        })
                                        handleNextSectionPress()
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: HeightRatio(10),
                                        marginTop: HeightRatio(20),
                                        width: WidthRatio(100),
                                        height: WidthRatio(100),
                                        borderRadius: HeightRatio(10),
                                        backgroundColor: THEME_COLOR_ATTENTION
                                    }}

                                >
                                    <Text
                                        style={{ ...styles.itemButton_Text, fontFamily: option == 'Custom' ? 'SofiaSansSemiCondensed-ExtraBold' : 'SofiaSansSemiCondensed-Regular' }}
                                        allowFontScaling={false}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            }
                        </View>
                    ))}
                </View>
                <View style={{ marginTop: HeightRatio(10) }}>
                    {selectedTime != null ?
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.itemButton_AltColor}>
                                <Text
                                    style={styles.itemButton_Text}
                                    allowFontScaling={false}
                                >
                                    {selectedTime}
                                </Text>
                            </View>
                            
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedTime(null);
                                    setMainState({
                                        selectedFood_Schedule: null,
                                        selectedFood_Schedule_Custom_Time: null,
                                        userTouch: true
                                    })
                                    handleNextSectionPress()
                                }}
                                style={{
                                    backgroundColor: THEME_COLOR_NEGATIVE,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: HeightRatio(4),
                                    borderRadius: HeightRatio(10),
                                    height: HeightRatio(30),
                                    width: HeightRatio(30),
                                    position: 'absolute',
                                    right: HeightRatio(-4),
                                    
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faX}
                                    style={{ color: 'white' }}
                                    size={14}
                                />
                            </TouchableOpacity>
                        </View>
                        :
                        <>
                            {options_time.map((option) => (
                                <View key={option}>
                                    {option != 'Custom' &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectedTime(option);
                                                handleScheduleTime(option)
                                                setMainState({
                                                    selectedFood_Schedule: option,
                                                    userTouch: true
                                                })
                                                handleNextSectionPress()
                                            }}
                                            style={styles.itemButton_AltColor}

                                        >
                                            <Text
                                                style={{ ...styles.itemButton_Text, fontFamily: option == 'Custom' ? 'SofiaSansSemiCondensed-ExtraBold' : 'SofiaSansSemiCondensed-Regular' }}
                                                allowFontScaling={false}
                                            >
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            ))}
                        </>
                    }
                </View>
                </View>
                <View style={{ marginTop: HeightRatio(10) }}>
                    {selectedTime != null && selectedTime == 'Custom' &&
                        <View style={{}}>
                            <CustomTimePicker />
                        </View>
                    }
                </View>

            </View>
            


            <View 
                style={{ 
                    flexDirection: 'row',
                    padding: HeightRatio(10), 
                    margin: HeightRatio(10), 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    width: '100%',
                    alignSelf: 'center',
                    borderRadius: HeightRatio(10)  
                }}
            >
                <Text
                    style={styles.header}
                    allowFontScaling={false}
                >
                    Allergic Reaction?
                </Text>
                <View style={{ marginTop: HeightRatio(10) }}>
                    {selectedReaction != null ?
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.itemButton_AltColor_1}>
                                <Text
                                    style={{ ...styles.itemButton_Text, color: 'white' }}
                                    allowFontScaling={false}
                                >
                                    {selectedReaction}
                                </Text>
                            </View>
                            
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedReaction(null);
                                    setMainState({
                                        selectedFood_Allergy: null,
                                        userTouch: true
                                    })
                                    handleNextSectionPress()
                                }}
                                style={{
                                    backgroundColor: THEME_COLOR_NEGATIVE,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: HeightRatio(4),
                                    borderRadius: HeightRatio(10),
                                    height: HeightRatio(30),
                                    width: HeightRatio(30),
                                    position: 'absolute',
                                    right: HeightRatio(-4),
                                    
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faX}
                                    style={{ color: 'white' }}
                                    size={14}
                                />
                            </TouchableOpacity>
                        </View>
                        :
                        <>
                            {options_allergy.map((option) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedReaction(option);
                                        setMainState({
                                            selectedFood_Allergy: option,
                                            userTouch: true
                                        })
                                        handleNextSectionPress()
                                    }}
                                    style={styles.itemButton_AltColor_1}
                                    key={option}
                                >
                                    <Text
                                        style={{ ...styles.itemButton_Text, color: 'white' }}
                                        allowFontScaling={false}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </>
                    }
                </View>
            </View>
            <View 
                style={{ 
                    flexDirection: 'row',
                    padding: HeightRatio(10), 
                    margin: HeightRatio(10), 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    width: '100%',
                    alignSelf: 'center',
                    borderRadius: HeightRatio(10)  
                }}
            >
                <Text
                    style={styles.header}
                    allowFontScaling={false}
                >
                    Emotion
                </Text>
                <View style={{ marginTop: HeightRatio(10) }}>
                    {selectedEmotion != null ?
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.itemButton_AltColor_3}>
                                <Text
                                    style={styles.itemButton_Text}
                                    allowFontScaling={false}
                                >
                                    {decodedEmoji}
                                </Text>
                            </View>
                            
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedEmotion(null);
                                    setMainState({
                                        selectedFood_Emotion: null,
                                        userTouch: true
                                    })
                                    handleNextSectionPress()
                                }}
                                style={{
                                    backgroundColor: THEME_COLOR_NEGATIVE,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: HeightRatio(4),
                                    borderRadius: HeightRatio(10),
                                    height: HeightRatio(30),
                                    width: HeightRatio(30),
                                    position: 'absolute',
                                    right: HeightRatio(-4),
                                    
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faX}
                                    style={{ color: 'white' }}
                                    size={14}
                                />
                            </TouchableOpacity>
                        </View>
                        :
                        <>
                            {options_emotion.map((option) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedEmotion(option);
                                        setMainState({
                                            selectedFood_Emotion: option,
                                            userTouch: true
                                        })
                                        handleNextSectionPress()
                                    }}
                                    style={styles.itemButton_AltColor_3}
                                    key={option}
                                >
                                    <Text
                                        style={styles.itemButton_Text}
                                        allowFontScaling={false}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </>
                    }
                </View>
            </View>
            <View style={{ height: HeightRatio(10) }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: windowWidth - HeightRatio(100),
    },
    header: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(25),
        fontFamily: 'SofiaSansSemiCondensed-Regular',
        width: WidthRatio(125),
        marginTop: HeightRatio(10),
        marginRight: HeightRatio(10)
    },
    textInput_Quantity: {
        ...Styling.textInputStyle,
        color: 'white',
        fontSize: HeightRatio(26),
        fontFamily: 'SofiaSansSemiCondensed-Regular',
        height: HeightRatio(50),
        width: WidthRatio(100),
        margin: 0,
        marginTop: HeightRatio(10),
        borderRadius: HeightRatio(10),
    },
    itemButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        padding: HeightRatio(10),
        margin: HeightRatio(4),
        width: WidthRatio(110),
        borderRadius: HeightRatio(10),
        backgroundColor: THEME_COLOR_POSITIVE,
    },
    itemButton_AltColor: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        padding: HeightRatio(10),
        margin: HeightRatio(4),
        width: WidthRatio(110),
        borderRadius: HeightRatio(10),
        backgroundColor: THEME_COLOR_ATTENTION,
    },
    itemButton_AltColor_1: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        padding: HeightRatio(10),
        margin: HeightRatio(4),
        width: WidthRatio(110),
        borderRadius: HeightRatio(10),
        backgroundColor: THEME_ALT_COLOR_0,
    },
    itemButton_AltColor_2: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        padding: HeightRatio(10),
        margin: HeightRatio(4),
        width: WidthRatio(110),
        borderRadius: HeightRatio(10),
        backgroundColor: THEME_ALT_COLOR_1,
    },
    itemButton_AltColor_3: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        padding: HeightRatio(10),
        margin: HeightRatio(4),
        width: WidthRatio(110),
        borderRadius: HeightRatio(10),
        backgroundColor: THEME_ALT_COLOR_2,
    },
    itemButton_Text: {
        color: 'black',
        fontSize: HeightRatio(20),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    },
    itemButton_faX: {
        height: HeightRatio(40),
        width: HeightRatio(40),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: HeightRatio(0),
        right: HeightRatio(0),
        borderTopRightRadius: HeightRatio(10),
        borderBottomRightRadius: HeightRatio(10)
    }
});