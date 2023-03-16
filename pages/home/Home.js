import { useEffect, useState, useContext, useRef, useCallback } from 'react';
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
    StyleSheet
} from 'react-native';
import { Styling, windowHeight, windowWidth, HeightRatio, WidthRatio } from '../../Styling';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import moment from 'moment'

export const HomeScreen = () => {


    const today = moment().format('MMMM Do YYYY');



    // FONTS
    const [fontsLoaded] = useFonts({
        'GochiHand_400Regular': require('../../assets/fonts/GochiHand-Regular.ttf'),
        'SofiaSansSemiCondensed-Regular': require('../../assets/fonts/SofiaSansSemiCondensed-Regular.ttf')

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
        <View
            style={{ ...Styling.container, backgroundColor: '#9861ea', display: 'flex', alignItems: 'center', justifyContent: 'center', width: windowWidth }}
            onLayout={onLayoutRootView}
        >
            <Text style={{
                color: 'black',
                fontSize: HeightRatio(50),
                fontFamily: 'SofiaSansSemiCondensed-Regular',

            }}>
                {today}
            </Text>
            <View style={styles.container}>
            <View style={[styles.row, { justifyContent: 'center' }]}>
                <View style={styles.cell}>
                <Text>Sample text</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={[styles.cell, { flex: 1 }]}>
                <Text>Sample text</Text>
                </View>
                <View style={[styles.cell, { flex: 1 }]}>
                <Text>Sample text</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={[styles.cell, { flex: 1 }]}>
                <Text>Sample text</Text>
                </View>
                <View style={[styles.cell, { flex: 1 }]}>
                <Text>Sample text</Text>
                </View>
            </View>
            </View>
            <Text style={{
                color: 'white',
                fontSize: HeightRatio(50),
                fontFamily: 'SofiaSansSemiCondensed-Regular',

            }}>
                Calories
            </Text>
            <Text style={{
                color: 'white',
                fontSize: HeightRatio(50),
                fontFamily: 'SofiaSansSemiCondensed-Regular',

            }}>
                Nutrients
            </Text>
            
            <View
                style={{
                    backgroundColor: 'transparent',
                    width: windowWidth / 1.2,
                    height: HeightRatio(70),
                    margin: HeightRatio(4),
                    borderWidth: 1,
                    borderRadius: HeightRatio(10),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{
                    color: 'white',
                    fontSize: HeightRatio(30),
                    fontFamily: 'SofiaSansSemiCondensed-Regular',

                }}>
                    Today: entry 1
                </Text>
            </View>
            <View
                style={{
                    backgroundColor: 'transparent',
                    width: windowWidth / 1.2,
                    height: HeightRatio(70),
                    margin: HeightRatio(4),
                    borderWidth: 1,
                    borderRadius: HeightRatio(10),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{
                    color: 'white',
                    fontSize: HeightRatio(30),
                    fontFamily: 'SofiaSansSemiCondensed-Regular',

                }}>
                    Today: entry 2
                </Text>
            </View>
            <View
                style={{
                    backgroundColor: 'transparent',
                    width: windowWidth / 1.2,
                    height: HeightRatio(70),
                    margin: HeightRatio(4),
                    borderWidth: 1,
                    borderRadius: HeightRatio(10),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{
                    color: 'white',
                    fontSize: HeightRatio(30),
                    fontFamily: 'SofiaSansSemiCondensed-Regular',

                }}>
                    Today: entry 2
                </Text>
            </View>
            {/* Add Button */}
            <TouchableOpacity
                onPress={() => console.log("ADD FODD")}
                style={{
                    backgroundColor: '#5fea96',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: HeightRatio(20),
                    borderRadius: HeightRatio(10),
                    alignSelf: 'center',
                    width: windowWidth - WidthRatio(50),
                    margin: HeightRatio(4)
                }}
            >
                <Text
                    style={{
                        color: 'black',
                        fontSize: HeightRatio(30),
                        alignSelf: 'center',
                        fontFamily: 'SofiaSansSemiCondensed-Regular'
                    }}
                    allowFontScaling={false}
                >
                    Add Food
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
    },
    cell: {
      borderWidth: 1,
      borderColor: '#000',
      padding: 10,
    },
  });