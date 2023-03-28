import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Styling, HeightRatio, WidthRatio, windowWidth, windowHeight } from '../../../Styling';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
export const CustomTimePicker = () => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [successColor, setSuccessColor] = useState(false)
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [amPm, setAmPm] = useState('');

    const handleHourChange = (text) => {
        setHour(text);
    };

    const handleMinuteChange = (text) => {
        setMinute(text);
    };

    const handleAmPmChange = (text) => {
        setAmPm(text.toUpperCase());
    };

    const storeCustomScheduleTime = async (v_hour, v_minute, v_AMPM) => {
        setMainState({
            selectedFood_Schedule_Custom_Time: null
        })
        console.log("# - storeCustomScheduleTime")
        let value = `${v_hour}:${v_minute} ${v_AMPM}`
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@storeCustomScheduleTime', jsonValue)
            console.log(jsonValue)
            setMainState({
                selectedFood_Schedule_Hour: hour,
                selectedFood_Schedule_Minute: minute,
                selectedFood_Schedule_AMPM: amPm
            })
            setSuccessColor(true)
        } catch (e) {
            // saving error
        }
    }

    useEffect(() => {
        setHour([])
        setMinute([])
        setAmPm([])
    }, [])
    

    return (
        <View style={{ flexDirection: 'column', backgroundColor: successColor ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)', borderRadius: HeightRatio(10), padding: HeightRatio(10) }}>
            <Text
                style={styles.header}
                allowFontScaling={false}
            >
                Enter custom time:
            </Text>
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    placeholder="Hour"
                    placeholderTextColor="white"
                    value={hour}
                    onChangeText={handleHourChange}
                    keyboardType="number-pad"
                    maxLength={2}
                    style={styles.modalVisible_TextInput}
                />
                <TextInput
                    placeholder="Minute"
                    placeholderTextColor="white"
                    value={minute}
                    onChangeText={handleMinuteChange}
                    keyboardType="number-pad"
                    maxLength={2}
                    style={styles.modalVisible_TextInput}
                />
                <TextInput
                    placeholder="AM/PM"
                    placeholderTextColor="white"
                    value={amPm}
                    onChangeText={handleAmPmChange}
                    autoCapitalize="characters"
                    maxLength={2}
                    style={styles.modalVisible_TextInput}
                />
            </View>
            {hour && minute && amPm &&
                <TouchableOpacity
                    onPress={() => {
                        storeCustomScheduleTime(hour, minute, amPm)
                    }}
                >
                    <View
                        style={{
                            ...styles.modalVisible_HalfButton,
                            ...styles.button_Drop_Shadow,
                            backgroundColor: THEME_COLOR_POSITIVE
                        }}
                    >
                        <Text
                            style={styles.modalVisible_Button_Text}
                            allowFontScaling={false}
                        >
                            Set Time
                        </Text>
                    </View>
                </TouchableOpacity>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    modalVisible_TextInput: {
        ...Styling.textInputStyle,
        paddingLeft: null,
        height: HeightRatio(50),
        width: WidthRatio(70),
        fontSize: HeightRatio(15),
        fontFamily: 'SofiaSansSemiCondensed-Regular',
        color: 'white'
    },
    header: {
        color: 'white',
        fontSize: HeightRatio(25),
        fontFamily: 'SofiaSansSemiCondensed-Regular',
        width: WidthRatio(200),
        marginTop: HeightRatio(10),
        marginRight: HeightRatio(10)
    },
    modalVisible_HalfButton: {
        display: 'flex',
        justifyContent: 'flex-start',
        padding: HeightRatio(5),
        borderRadius: HeightRatio(10),
        alignSelf: 'center',
        width: '90%',
        margin: HeightRatio(5)
    },
    button_Drop_Shadow: {
        padding: 10,
        borderRadius: 5,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    modalVisible_Button_Text: {
        color: THEME_FONT_COLOR_BLACK,
        fontSize: HeightRatio(25),
        alignSelf: 'center',
        fontFamily: 'SofiaSansSemiCondensed-Regular'
    },
})

