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


export const SelectedFoodDetails = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const options = [
        "Cups",
        "Milligrams",
        "Millileters",
        "Servings",
        "Tablespoons",
        "Teaspoons"
    ]
    const options_time = [
        "First Thing",
        "Breakfast",
        "Midmorning",
        "Lunch",
        "Afternoon",
        "Dinner",
        "Before Bed"
    ]
    const [textInputValue, setTextInputValue] = useState(props.textInputValue || null);
    const [selectedItem, setSelectedItem] = useState(props.selectedItem || null);
    const [selectedTime, setSelectedTime] = useState(null);


    useEffect(() => {
        console.log("# - home/auxilliary/SelectedFoodDetails - Primary useEffect")
        setMainState({
            selectedFood_Quantity: props.textInputValue || null,
            selectedFood_Measurement: props.selectedItem || null,
            selectedFood_Schedule: null
        })
    }, [])

    const handleTextChange = (text) => {
        console.log("# - home/auxilliary/SelectedFoodDetails - handleTextChange")
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

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
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

            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={styles.header}
                    allowFontScaling={false}
                >
                    Measurement
                </Text>
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
                                        selectedFood_Measurement: null
                                    })
                                }}
                                style={styles.itemButton_faX}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faX}
                                    style={{ color: 'red' }}
                                    size={20}
                                />
                            </TouchableOpacity>

                        </View>
                        :
                        <>
                            {options.map((option) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedItem(option);
                                        setMainState({
                                            selectedFood_Measurement: option
                                        })
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
                </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={styles.header}
                    allowFontScaling={false}
                >
                    Schedule
                </Text>
                <View style={{ marginTop: HeightRatio(10) }}>
                    {selectedTime != null ?
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.itemButton}>
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
                                        selectedFood_Schedule: null
                                    })
                                }}
                                style={styles.itemButton_faX}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faX}
                                    style={{color: 'red'}}
                                    size={20}
                                />
                            </TouchableOpacity>
                        </View>
                        :
                        <>
                            {options_time.map((option) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedTime(option);
                                        setMainState({
                                            selectedFood_Schedule: option
                                        })
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
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: windowWidth - HeightRatio(100),
    },
    header: {
        color: 'white',
        fontSize: HeightRatio(25),
        fontFamily: 'SofiaSansSemiCondensed-Regular',
        width: WidthRatio(125),
        marginTop: HeightRatio(10),
        marginRight: HeightRatio(10)
    },
    textInput_Quantity: {
        ...Styling.textInputStyle,
        color: 'white',
        fontSize: HeightRatio(20),
        fontFamily: 'SofiaSansSemiCondensed-Regular',
        height: HeightRatio(50),
        width: WidthRatio(140),
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
        width: WidthRatio(140),
        borderRadius: HeightRatio(10),
        backgroundColor: 'rgba(30, 228, 168, 1.0)',
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