import React, {
    useEffect,
    useState,
    useContext,
    useRef,
    useCallback,
  } from 'react';
  import {
    Linking,
    ActivityIndicator,
    View,
    Text
  } from 'react-native';
  
  import moment from 'moment';
  import { windowHeight, windowWidth, HeightRatio, WidthRatio } from '../Styling';
  import { useFonts } from 'expo-font';
  import * as SplashScreen from 'expo-splash-screen';
  import * as SecureStore from 'expo-secure-store';
  
  export const APIKeys = {
    google: "goog_caDqiYZPHvJIwlqyFoZDgTqOywO",
  };

  export const ActivityIndicator_Timer = () => {
    const [startTime, setStartTime] = useState(moment());
    const [elapsedTime, setElapsedTime] = useState(moment.duration(0));
  
    useEffect(() => {
      const interval = setInterval(() => {
        setElapsedTime(moment.duration(moment().diff(startTime)));
      }, 100);
  
      return () => clearInterval(interval);
    }, [startTime]);
  
    return (
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: HeightRatio(10),
          padding: HeightRatio(20)
        }}
      >
        <ActivityIndicator size={200} color={'white'} />
        <Text
          style={{
            color: 'white',
            fontSize: HeightRatio(20),
            marginTop: 10,
  
          }}
        >
          {elapsedTime.asSeconds().toFixed(1)} s
        </Text>
      </View>
    );
  };
  
  export const CustomText = (props) => {
  
    const [fontsLoaded] = useFonts({
      'GochiHand_400Regular': require('../assets/fonts/GochiHand-Regular.ttf'),
      'SofiaSansSemiCondensed-Regular': require('../assets/fonts/SofiaSansSemiCondensed-Regular.ttf'),
      'SofiaSansSemiCondensed-ExtraBold': require('../assets/fonts/SofiaSansSemiCondensed-ExtraBold.ttf'),
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
      <View onLayout={onLayoutRootView } >
        <Text
          style={{
            color: 'white',
            fontSize: props.size,
            fontFamily: 'BubblegumSans-Regular'
          }}
          allowFontScaling={false}
        >
          {props.text}
        </Text>
      </View>
    )
  }
  
  export const save = async(key, value) => {
    console.log(key)
    console.log(value)
    try {
        console.log("# - STEP 2 B.1")
        await SecureStore.setItemAsync(key, value);
        console.log("# - STEP 2 B.2")
        return {status: true, value: value}
    } catch (error) {
        console.log("# - SAVE FUNCTION ERROR:  " + error)
        return {status: false, value: ''}
    }
  }

  export const timeHandler = () => {
    const utcTime = moment.utc();
    let currentDay_Hour = utcTime.local();
    let currentDay = utcTime.local();

    currentDay = currentDay.format('MMMM Do YYYY');
    currentDay_Hour = currentDay_Hour.format('MMMM Do YYYY h A');

    return {day: currentDay, hour: currentDay_Hour}
}