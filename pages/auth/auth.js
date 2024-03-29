import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useMutation } from "@apollo/client";
import jwtDecode from "jwt-decode";
import { LOGIN_USER, ADD_USER, REQUEST_RESET, RESET_PASSWORD } from '../../utils/mutations';
import { Alert, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Dimensions, Button, Linking, ImageBackground, FlatList, PixelRatio, Modal, Keyboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSolid, faUser, faPlus, faUpLong, faMagnifyingGlass, faCheck, faLocationPin, faEnvelope, faLock, faGear, faX } from '@fortawesome/free-solid-svg-icons';
import { Navbar } from '../../components/Navbar';
import { Loading } from '../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { MainStateContext } from '../../App';
import { Styling, windowWidth, windowHeight, HeightRatio, WidthRatio } from '../../Styling';
import * as SecureStore from 'expo-secure-store';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GLOBAL_GRAPHQL_API_URL } from '../../App';
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
  THEME_COLOR_BLACKOUT
} from '../../COLOR';
import { LinearGradient } from 'expo-linear-gradient';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { UPDATE_PREMIUM } from '../../utils/mutations';

const resetActionProfile = CommonActions.reset({
  index: 1,
  routes: [{ name: 'Profile', params: {} }]
});

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function deleteKey(key) {
  await SecureStore.deleteItemAsync(key);
}

const APIKeys = {
  google: "goog_caDqiYZPHvJIwlqyFoZDgTqOywO",
};

export const Auth = ({ navigation }) => {
  const { mainState, setMainState } = useContext(MainStateContext);
  const [updatePremium] = useMutation(UPDATE_PREMIUM);

  // const [authState, setAuthState] = useState(false);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [newUser, setNewUser] = useState(true);
  const [displayLoginFailureAlert, setDisplayLoginFailureAlert] = useState(false)
  const [loading, setLoading] = useState(false);
  const [navigateToProfile, setNavigateToProfile] = useState(false)
  const [signUpFailedModal, setSignUpFailedModal] = useState(false)
  const [signUpFailedError, setSignUpFailedError] = useState('')
  const [disableForgotPasswordSubmitButton, setDisableForgotPasswordSubmitButton] = useState(false)

  // Sign Up: Email
  const [promptEmailInput, setPromptEmailInput] = useState("");

  // Sign Up: Username
  const [promptUsernameInput, setPromptUsernameInput] = useState("");

  // Sign Up: Password
  const [promptPasswordInput, setPromptPasswordInput] = useState("");

  // Username and Password
  const [promptInput_0, setPromptInput_0] = useState("");
  const [promptInput_1, setPromptInput_1] = useState("");


  // Forgot Password
  const [displayForgotPasswordContent, setDisplayForgotPasswordContent] = useState(false);
  const [promptResetEmail, setPromptResetEmail] = useState('');
  const [resetRequestStatus, setResetRequestStatus] = useState('');
  const [displayForgotPasswordForm, setDisplayForgotPasswordForm] = useState(false);
  const [promptResetUsername, setPromptResetUsername] = useState('');
  const [promptResetPassword_0, setPromptResetPassword_0] = useState('');
  const [promptResetPassword_1, setPromptResetPassword_1] = useState('');
  const [promptResetToken, setPromptResetToken] = useState('');
  const [displayResetSuccessModal, setDisplayResetSuccessModal] = useState(false);
  const [displayNavbar, setDisplayNavbar] = useState(true);


  // Apollo 
  const [login, { error }] = useMutation(LOGIN_USER);
  const [addUser] = useMutation(ADD_USER);
  const [requestReset] = useMutation(REQUEST_RESET);
  const [resetPassword] = useMutation(RESET_PASSWORD);

  // Server
  const [isTokenValid, setIsTokenValid] = useState(null);

  const checkToken = async (value) => {
    try {
      const response = await fetch(`${GLOBAL_GRAPHQL_API_URL}/protected-route`, {
        method: 'GET',
        headers: {
          'Authorization': `${value}`
        }
      });

      if (response.ok) {
        // Token is still valid
        // console.log("AUTH - Token is still valid")

        setIsTokenValid(true)
        navigation.dispatch(resetActionProfile)

        return true;
      } else {
        // Token is no longer valid
        // console.log("AUTH - Token is no longer valid")
        setIsTokenValid(false)
        return false;
      }
    } catch (error) {
      console.error(error);
    }

  }

  const handleLogin = async () => {
    setNavigateToProfile(true)
    try {
      const { data } = await login({
        variables: {
          username: promptInput_0,
          password: promptInput_1
        },
      });


      if (data.login.token) {
        console.log("Auth - Successful Login")
        deleteKey('cosmicKey');

        const decoded = jwtDecode(data.login.token)
        setDisplayLoading(false);

        setMainState({
          bearerToken: `Bearer ${data.login.token}`,
          userID: `${decoded?.data._id}`,
          authState: true
        })

        save('bearerToken', `Bearer ${data.login.token}`);
        save('userID', `${decoded?.data._id}`);
        save('authState', 'true');

        checkToken(`Bearer ${data.login.token}`)

        console.log("# - FROM AUTH")
        console.log(decoded?.data._id)
        checkCustomerInfo(decoded?.data._id)
      }
    } catch (e) {
      setNavigateToProfile(false)
      console.log("Auth - Login Error")
      setDisplayLoading(false);
      console.error(e);
      setDisplayLoginFailureAlert(true)

      setMainState({
        bearerToken: null,
        userID: null,
        authState: false
      })

      save('bearerToken', '');
      save('userID', '');
      save('authState', 'false');
    }
  }


  const handleFormSubmit = async () => {
    setNavigateToProfile(true)
    try {
      const { data } = await addUser({
        variables: {
          username: promptUsernameInput,
          email: promptEmailInput,
          password: promptPasswordInput,
          role: 'User',
          profilepicture: '',
        }
      });

      if (data.addUser.token) {
        const decoded = jwtDecode(data.addUser.token)

        setDisplayLoading(false);
        setPromptEmailInput("")
        setPromptUsernameInput("")
        setPromptPasswordInput("")

        setMainState({
          bearerToken: `Bearer ${data.addUser.token}`,
          userID: `${decoded?.data._id}`,
          authState: true
        })

        save('bearerToken', `Bearer ${data.addUser.token}`);
        save('userID', `${decoded?.data._id}`);
        save('authState', 'true');

        checkToken(`Bearer ${data.addUser.token}`)
      }
    } catch (e) {
      setNavigateToProfile(false)
      setDisplayLoading(false);
      setPromptEmailInput("")
      setPromptUsernameInput("")
      setPromptPasswordInput("")

      // Alert.alert(
      //   "Sign Up Failed",
      //   `${e}`,
      //   [
      //     { text: "OK", onPress: () => console.log("OK Pressed") }
      //   ]
      // );

      setSignUpFailedModal(true)

      setSignUpFailedError(`${e}`)

      setMainState({
        bearerToken: null,
        userID: null,
        authState: false
      })

      save('bearerToken', '');
      save('userID', '');
      save('authState', 'false');

    }
  };

  const handleRequestReset = async () => {
    setDisableForgotPasswordSubmitButton(true)
    try {
      await requestReset({
        variables: {
          email: promptResetEmail
        },
      });
      setResetRequestStatus("Check your email for a Reset Token!")
    } catch (e) {
      console.error(e);
      setResetRequestStatus("No user found with that email.")
    }

  };

  const handleResetPassword = async () => {
    setLoading(true);
    if (promptResetEmail != '' && promptResetPassword_0 != '' && promptResetPassword_1 != '' && promptResetToken != '' && promptResetPassword_0 == promptResetPassword_1) {
      try {
        await resetPassword({
          variables: {
            email: promptResetEmail,
            password: promptResetPassword_0,
            confirmPassword: promptResetPassword_1,
            resetToken: promptResetToken
          }
        })
        setDisplayResetSuccessModal(true);
        setPromptResetEmail('');
        setResetRequestStatus('');
        setDisplayForgotPasswordForm(false);
        setPromptResetPassword_0('');
        setPromptResetPassword_1('');
      } catch (e) {
        console.error(e)
      }
      setLoading(false);

    }
  }

  useEffect(() => {
    setLoading(true)
    setDisableForgotPasswordSubmitButton(false)
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setDisplayNavbar(false)
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setDisplayNavbar(true)
      },
    );

    setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };

  }, [])

  const checkCustomerInfo = async (localUserID) => {
    // let localUserID = await SecureStore.getItemAsync('userID');
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey: APIKeys.google, appUserID: localUserID });

    const customerInfo = await Purchases.getCustomerInfo();
    console.log(customerInfo)

    if (typeof customerInfo.entitlements.active["Premium"] !== "undefined") {
      // console.log(customerInfo.entitlements.active["Premium"])
      console.log("# - Premium service access granted.")
      await updatePremium({
        variables: {
          status: true,
          expiration: `${customerInfo.allExpirationDates.baby_food_tracker_premium_month}`
        }
      });

    } else {
      console.log("# - Premium service access revoked.")
      await updatePremium({
        variables: {
          status: false,
          expiration: ''
        }
      });
    }
  }

  const [fontsLoaded] = useFonts({
    'GochiHand_400Regular': require('../../assets/fonts/GochiHand-Regular.ttf'),
    'SofiaSansSemiCondensed-Regular': require('../../assets/fonts/SofiaSansSemiCondensed-Regular.ttf'),
    'CormorantGaramond-Regular': require('../../assets/fonts/CormorantGaramond-Regular.ttf'),
    'CormorantGaramond-Bold': require('../../assets/fonts/CormorantGaramond-Bold.ttf')
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
      {!navigateToProfile && !loading ?
        <>
          <View
            style={{ ...Styling.container, backgroundColor: '#1f1f27' }}
            onLayout={onLayoutRootView}
          >
            <LinearGradient
              // colors={['#8bccde', '#d05bb6']}
              colors={['#ecece6', '#ecece6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ ...Styling.container }}
            >
              <SafeAreaView style={{ height: '90%', marginBottom: 20, marginTop: 20 }}>
                <ScrollView style={{}} keyboardShouldPersistTaps={'always'} keyboardDismissMode="on-drag">

                  {!isTokenValid &&
                    <>
                      {newUser ?
                        <>
                          <Text
                            style={{
                              color: THEME_FONT_COLOR_BLACK,
                              alignSelf: 'center',
                              fontSize: HeightRatio(50),
                              marginTop: HeightRatio(20),
                              fontFamily: 'SofiaSansSemiCondensed-Regular',
                            }}
                            allowFontScaling={false}
                          >
                            Sign Up
                          </Text>
                          <>
                            {/* [[[CHECK BOXES]]] */}
                            <View style={{ flexDirection: 'row', alignSelf: 'center', margin: HeightRatio(40) }}>
                              {promptEmailInput ?
                                <View
                                  style={{
                                    ...styles.homePrimary_Add_Button,
                                    ...styles.button_Drop_Shadow,
                                    width: windowWidth / 3.6,
                                    height: windowWidth / 5
                                  }}
                                >

                                  <View
                                    style={{ flexDirection: 'column' }}
                                  >

                                    <FontAwesomeIcon
                                      icon={faSolid, faCheck}
                                      style={{ color: THEME_FONT_COLOR_BLACK, margin: HeightRatio(14), alignSelf: 'center' }}
                                    />
                                    <Text
                                      style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(20),
                                        textAlign: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                      }}
                                      allowFontScaling={false}
                                    >Email</Text>
                                  </View>
                                </View>
                                :
                                <View
                                  style={{
                                    ...styles.homePrimary_Add_Button,
                                    ...styles.button_Drop_Shadow,
                                    width: windowWidth / 3.6,
                                    height: windowWidth / 5
                                  }}
                                >
                                  <View
                                    style={{ flexDirection: 'column' }}
                                  >

                                    <FontAwesomeIcon
                                      icon={faSolid, faEnvelope}
                                      style={{ color: THEME_FONT_COLOR_BLACK, margin: HeightRatio(14), alignSelf: 'center' }}
                                    />
                                    <Text
                                      style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(20),
                                        textAlign: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                      }}
                                      allowFontScaling={false}
                                    >Email</Text>
                                  </View>
                                </View>


                              }
                              {promptUsernameInput ?
                                <View
                                  style={{
                                    ...styles.homePrimary_Add_Button,
                                    ...styles.button_Drop_Shadow,
                                    width: windowWidth / 3.6,
                                    height: windowWidth / 5
                                  }}
                                >
                                  <View
                                    style={{ flexDirection: 'column' }}
                                  >

                                    <FontAwesomeIcon
                                      icon={faSolid, faCheck}
                                      style={{ color: THEME_FONT_COLOR_BLACK, margin: HeightRatio(14), alignSelf: 'center' }}
                                    />
                                    <Text
                                      style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(20),
                                        textAlign: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                      }}
                                      allowFontScaling={false}
                                    >Username</Text>
                                  </View>
                                </View>
                                :
                                <View
                                  style={{
                                    ...styles.homePrimary_Add_Button,
                                    ...styles.button_Drop_Shadow,
                                    width: windowWidth / 3.6,
                                    height: windowWidth / 5
                                  }}
                                >
                                  <View
                                    style={{ flexDirection: 'column' }}
                                  >

                                    <FontAwesomeIcon
                                      icon={faSolid, faUser}
                                      style={{ color: THEME_FONT_COLOR_BLACK, margin: HeightRatio(14), alignSelf: 'center' }}
                                    />
                                    <Text
                                      style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(20),
                                        textAlign: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                      }}
                                      allowFontScaling={false}
                                    >Username</Text>
                                  </View>
                                </View>
                              }
                              {promptPasswordInput ?
                                <View
                                  style={{
                                    ...styles.homePrimary_Add_Button,
                                    ...styles.button_Drop_Shadow,
                                    width: windowWidth / 3.6,
                                    height: windowWidth / 5
                                  }}
                                >
                                  <View
                                    style={{ flexDirection: 'column' }}
                                  >

                                    <FontAwesomeIcon
                                      icon={faSolid, faCheck}
                                      style={{ color: THEME_FONT_COLOR_BLACK, margin: HeightRatio(14), alignSelf: 'center' }}
                                    />
                                    <Text
                                      style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(20),
                                        textAlign: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                      }}
                                      allowFontScaling={false}
                                    >Password</Text>
                                  </View>
                                </View>
                                :
                                <View
                                  style={{
                                    ...styles.homePrimary_Add_Button,
                                    ...styles.button_Drop_Shadow,
                                    width: windowWidth / 3.6,
                                    height: windowWidth / 5
                                  }}
                                >
                                  <View
                                    style={{ flexDirection: 'column' }}
                                  >

                                    <FontAwesomeIcon
                                      icon={faSolid, faLock}
                                      style={{ color: THEME_FONT_COLOR_BLACK, margin: HeightRatio(14), alignSelf: 'center' }}
                                    />
                                    <Text
                                      style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(20),
                                        textAlign: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                      }}
                                      allowFontScaling={false}
                                    >Password</Text>
                                  </View>
                                </View>
                              }
                            </View>
                          </>

                          <TextInput
                            type="text"
                            name="email"
                            placeholder="Email"
                            placeholderTextColor='black'
                            value={promptEmailInput}
                            onChangeText={setPromptEmailInput}
                            style={Styling.textInputStyle}
                            disableFullscreenUI={true}
                            allowFontScaling={false}
                          />
                          <TextInput
                            type="text"
                            name="username"
                            placeholder="Username"
                            placeholderTextColor='black'
                            value={promptUsernameInput}
                            onChangeText={setPromptUsernameInput}
                            style={Styling.textInputStyle}
                            disableFullscreenUI={true}
                            allowFontScaling={false}
                          />
                          <TextInput
                            type="password"
                            name="password"
                            placeholder="Password"
                            placeholderTextColor='black'
                            value={promptPasswordInput}
                            onChangeText={setPromptPasswordInput}
                            secureTextEntry={true}
                            style={Styling.textInputStyle}
                            disableFullscreenUI={true}
                            allowFontScaling={false}
                          />

                          {
                            promptEmailInput != "" &&
                              promptUsernameInput != "" &&
                              promptPasswordInput != "" ?
                              <TouchableOpacity
                                onPress={() => {
                                  handleFormSubmit()
                                  setDisplayLoading(true);
                                }}

                              >
                                <View style={{
                                  backgroundColor: THEME_COLOR_POSITIVE,
                                  ...styles.button_Drop_Shadow,
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  padding: HeightRatio(20),
                                  borderRadius: HeightRatio(10),
                                  alignSelf: 'center',
                                  width: windowWidth - WidthRatio(50),
                                  margin: HeightRatio(10)
                                }}>
                                  <Text
                                    style={{
                                      color: THEME_FONT_COLOR_BLACK,
                                      fontSize: HeightRatio(30),
                                      // fontWeight: 'bold',
                                      alignSelf: 'center',
                                      fontFamily: 'SofiaSansSemiCondensed-Regular'
                                    }}
                                    allowFontScaling={false}
                                  >
                                    Sign Up
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              :
                              <TouchableOpacity
                                onPress={() => { }}
                                disabled={true}
                              >
                                <View style={{
                                  backgroundColor: THEME_COLOR_POSITIVE,
                                  ...styles.button_Drop_Shadow,
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  padding: HeightRatio(20),
                                  borderRadius: HeightRatio(10),
                                  alignSelf: 'center',
                                  width: windowWidth - WidthRatio(50),
                                  margin: HeightRatio(10)
                                }}>
                                  <Text
                                    style={{
                                      color: THEME_FONT_COLOR_BLACK,
                                      fontSize: HeightRatio(30),
                                      // fontWeight: 'bold',
                                      alignSelf: 'center',
                                      fontFamily: 'SofiaSansSemiCondensed-Regular'
                                    }}
                                    allowFontScaling={false}
                                  >
                                    Sign Up
                                  </Text>
                                </View>
                              </TouchableOpacity>
                          }
                          <Text
                            style={{
                              color: THEME_FONT_COLOR_BLACK,
                              alignSelf: 'center',
                              fontSize: HeightRatio(30),
                              margin: HeightRatio(15),
                              fontFamily: 'SofiaSansSemiCondensed-Regular'
                            }}
                            allowFontScaling={false}
                          >
                            Already have an account?
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              setPromptEmailInput("")
                              setPromptUsernameInput("")
                              setPromptPasswordInput("")
                              setNewUser(false)
                            }}
                          >
                            <View style={{
                              backgroundColor: THEME_COLOR_NEGATIVE,
                              ...styles.button_Drop_Shadow,
                              display: 'flex',
                              justifyContent: 'flex-start',
                              padding: HeightRatio(20),
                              borderRadius: HeightRatio(10),
                              alignSelf: 'center',
                              width: windowWidth - WidthRatio(50)
                            }}>
                              <Text
                                style={{
                                  color: THEME_FONT_COLOR_WHITE,
                                  fontSize: HeightRatio(30),
                                  // fontWeight: 'bold',
                                  alignSelf: 'center',
                                  fontFamily: 'SofiaSansSemiCondensed-Regular'
                                }}
                                allowFontScaling={false}
                              >
                                Login
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </>
                        :
                        <>
                          {displayLoading ?
                            // <Loading />
                            null
                            :
                            <View>
                              <Text
                                style={{
                                  color: THEME_FONT_COLOR_BLACK,
                                  alignSelf: 'center',
                                  fontSize: HeightRatio(50),
                                  margin: 20,
                                  fontFamily: 'SofiaSansSemiCondensed-Regular',
                                }}
                                allowFontScaling={false}
                              >
                                Login
                              </Text>
                              <TextInput
                                type="text"
                                name="username"
                                placeholder="Username"
                                placeholderTextColor='black'
                                value={promptInput_0}
                                onChangeText={setPromptInput_0}
                                style={Styling.textInputStyle}
                                disableFullscreenUI={true}
                                allowFontScaling={false}
                              />
                              <TextInput
                                type="password"
                                name="password"
                                placeholder="Password"
                                placeholderTextColor='black'
                                value={promptInput_1}
                                onChangeText={setPromptInput_1}
                                secureTextEntry={true}
                                style={Styling.textInputStyle}
                                disableFullscreenUI={true}
                                allowFontScaling={false}
                              />
                              {displayLoginFailureAlert &&
                                <View style={{ alignSelf: 'center' }}>
                                  <Text
                                    style={{ fontSize: HeightRatio(30), color: 'red', fontFamily: 'SofiaSansSemiCondensed-Regular' }}
                                    allowFontScaling={false}
                                  >
                                    Incorrect Credentials
                                  </Text>
                                </View>
                              }
                              {promptInput_0 != "" &&
                                promptInput_1 != "" ?
                                <TouchableOpacity onPress={() => { handleLogin(); setDisplayLoading(true); }}>
                                  <View style={{
                                    backgroundColor: THEME_COLOR_POSITIVE,
                                    ...styles.button_Drop_Shadow,
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(20),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: windowWidth - WidthRatio(50),
                                    margin: HeightRatio(10)
                                  }}>
                                    <Text
                                      style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(30),
                                        // fontWeight: 'bold',
                                        alignSelf: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular'
                                      }}
                                      allowFontScaling={false}
                                    >
                                      Login
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                  onPress={() => { }}
                                  disabled={true}
                                >
                                  <View style={{
                                    backgroundColor: THEME_COLOR_POSITIVE,
                                    ...styles.button_Drop_Shadow,
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(20),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: windowWidth - WidthRatio(50),
                                    margin: HeightRatio(10)
                                  }}>
                                    <Text
                                      style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(30),
                                        // fontWeight: 'bold',
                                        alignSelf: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular'
                                      }}
                                      allowFontScaling={false}
                                    >
                                      Login
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              }

                              {/* <View style={Styling.profileDivisionLine}></View> */}
                              <View style={{
                                // backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                // margin: HeightRatio(30),
                                borderRadius: HeightRatio(30)
                              }}>

                                <TouchableOpacity
                                  onPress={() => setDisplayForgotPasswordContent(current => !current)}>
                                  <View style={{
                                    backgroundColor: THEME_COLOR_ATTENTION,
                                    ...styles.button_Drop_Shadow,
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(20),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: windowWidth - WidthRatio(50),
                                    margin: HeightRatio(10)
                                  }}>
                                    <Text
                                      style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        fontSize: HeightRatio(30),
                                        // fontWeight: 'bold',
                                        alignSelf: 'center',
                                        fontFamily: 'SofiaSansSemiCondensed-Regular'
                                      }}
                                      allowFontScaling={false}
                                    >
                                      Forgot Password?
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                                {displayForgotPasswordContent ?
                                  <View
                                    style={{
                                      alignSelf: 'center',
                                      // margin: HeightRatio(20),
                                      width: WidthRatio(160)
                                    }}
                                  >
                                    <View style={{ flexDirection: 'column', alignSelf: 'center' }}>

                                      <TextInput
                                        type="text"
                                        name="resetemail"
                                        placeholder="Enter Email"
                                        placeholderTextColor='black'
                                        value={promptResetEmail}
                                        onChangeText={setPromptResetEmail}
                                        allowFontScaling={false}
                                        style={Styling.textInputStyle}
                                        disableFullscreenUI={true}
                                        allowFontScaling={false}
                                      />
                                      {/* [[[SUBMIT BUTTON]]] */}

                                      <TouchableOpacity 
                                        onPress={() => handleRequestReset()}
                                        disabled={disableForgotPasswordSubmitButton ? true : false}
                                        style={{
                                          backgroundColor: THEME_COLOR_POSITIVE,
                                          ...styles.button_Drop_Shadow,
                                          display: 'flex',
                                          justifyContent: 'flex-start',
                                          padding: HeightRatio(20),
                                          borderRadius: HeightRatio(10),
                                          alignSelf: 'center',
                                          width: windowWidth - WidthRatio(50),
                                          margin: HeightRatio(10)
                                        }}
                                      >
                                        <View >
                                          <Text
                                            style={{
                                              color: THEME_FONT_COLOR_BLACK,
                                              fontSize: HeightRatio(30),
                                              // fontWeight: 'bold',
                                              alignSelf: 'center',
                                              fontFamily: 'SofiaSansSemiCondensed-Regular'
                                            }}
                                            allowFontScaling={false}
                                          >
                                            Submit
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                    {resetRequestStatus != '' &&
                                      <View style={{ width: windowWidth, alignSelf: 'center' }}>
                                        <Text
                                          style={{
                                            color: THEME_FONT_COLOR_BLACK,
                                            alignSelf: 'center',
                                            fontSize: HeightRatio(30),
                                            // margin: HeightRatio(10),
                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                                          }}
                                          allowFontScaling={false}
                                        >{resetRequestStatus}</Text>
                                      </View>
                                    }

                                    <TouchableOpacity 
                                      onPress={() => setDisplayForgotPasswordForm(true)}
                                      style={{
                                        backgroundColor: 'white',
                                        ...styles.button_Drop_Shadow,
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        padding: HeightRatio(20),
                                        borderRadius: HeightRatio(10),
                                        alignSelf: 'center',
                                        width: windowWidth - WidthRatio(50),
                                        margin: HeightRatio(10)
                                      }}
                                    >
                                      <View >
                                        <Text
                                          style={{
                                            color: THEME_FONT_COLOR_BLACK,
                                            fontSize: HeightRatio(30),
                                            // fontWeight: 'bold',
                                            alignSelf: 'center',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular'
                                          }}
                                          allowFontScaling={false}
                                        >
                                          Have a reset token?
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                    {displayForgotPasswordForm &&
                                      <>
                                        <TextInput
                                          type="text"
                                          name="resetoken"
                                          placeholder="Enter Reset Token"
                                          placeholderTextColor='black'
                                          value={promptResetToken}
                                          onChangeText={setPromptResetToken}
                                          style={Styling.textInputStyle}
                                          disableFullscreenUI={true}
                                          allowFontScaling={false}
                                        />
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 10 }}>
                                          <TextInput
                                            type="password"
                                            name="resetpassword_0"
                                            placeholder="New Password"
                                            placeholderTextColor='black'
                                            value={promptResetPassword_0}
                                            onChangeText={setPromptResetPassword_0}
                                            secureTextEntry={true}
                                            allowFontScaling={false}
                                            style={Styling.textInputStyle}
                                            disableFullscreenUI={true}
                                            allowFontScaling={false}
                                          />
                                        </View>

                                        <View style={{ flexDirection: 'column', alignSelf: 'center', margin: 10 }}>
                                          <TextInput
                                            type="password"
                                            name="resetpassword_1"
                                            placeholder='Confirm Password'
                                            placeholderTextColor='black'
                                            value={promptResetPassword_1}
                                            onChangeText={setPromptResetPassword_1}
                                            secureTextEntry={true}
                                            allowFontScaling={false}
                                            style={Styling.textInputStyle}
                                            disableFullscreenUI={true}
                                            allowFontScaling={false}
                                          />
                                          {promptResetPassword_0 == promptResetPassword_1 && promptResetPassword_0 != '' && promptResetPassword_1 != '' &&
                                            <View style={{ width: windowWidth - HeightRatio(10) }}>
                                              <Text style={{ color: THEME_FONT_COLOR_BLACK, fontSize: HeightRatio(25), fontFamily: 'SofiaSansSemiCondensed-Regular', textAlign: 'center' }}
                                                allowFontScaling={false}>
                                                Passwords match!
                                              </Text>
                                            </View>
                                          }
                                          {promptResetPassword_0 != promptResetPassword_1 && promptResetPassword_0 != '' && promptResetPassword_1 != '' &&
                                            <View style={{ width: windowWidth - HeightRatio(10) }}>
                                              <Text style={{ color: THEME_FONT_COLOR_BLACK, fontSize: HeightRatio(25), fontFamily: 'SofiaSansSemiCondensed-Regular', textAlign: 'center' }}
                                                allowFontScaling={false}>
                                                Passwords do not match!
                                              </Text>
                                            </View>
                                          }
                                          {/* [[[SUBMIT BUTTON]]] */}
                                          <TouchableOpacity onPress={() => handleResetPassword()}>
                                            <View style={{
                                              backgroundColor: THEME_COLOR_POSITIVE,
                                              ...styles.button_Drop_Shadow,
                                              display: 'flex',
                                              justifyContent: 'flex-start',
                                              padding: HeightRatio(20),
                                              borderRadius: HeightRatio(10),
                                              alignSelf: 'center',
                                              width: windowWidth - WidthRatio(50),
                                              margin: HeightRatio(10)
                                            }}>
                                              <Text
                                                style={{
                                                  color: THEME_FONT_COLOR_BLACK,
                                                  fontSize: HeightRatio(30),
                                                  // fontWeight: 'bold',
                                                  alignSelf: 'center',
                                                  fontFamily: 'SofiaSansSemiCondensed-Regular'
                                                }}
                                                allowFontScaling={false}
                                              >
                                                Submit
                                              </Text>
                                            </View>
                                          </TouchableOpacity>

                                        </View>
                                      </>
                                    }

                                    <View>
                                      <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={displayResetSuccessModal}
                                        onRequestClose={() => {
                                          Alert.alert("Modal has been closed.");
                                          setDisplayResetSuccessModal(!displayResetSuccessModal);
                                        }}
                                      >
                                        <View
                                          style={{
                                            flex: 1,
                                            backgroundColor: 'rgba(0, 0, 0, 0.75)'
                                          }}
                                        >
                                          <View
                                            style={{
                                              // flex: 1,
                                              backgroundColor: '#1f1f27',
                                              margin: 20,
                                              zIndex: 999,
                                              borderRadius: 10,
                                              display: 'flex',
                                              // alignItems: 'center',
                                              justifyContent: 'center',
                                              position: 'absolute', bottom: HeightRatio(30), left: 0, right: 0
                                            }}
                                          >
                                            <View
                                              style={{
                                                margin: HeightRatio(20),
                                                // alignSelf: 'center'
                                              }}
                                            >
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  // justifyContent: 'center'
                                                }}
                                              >
                                                <Image
                                                  source={require('../../assets/favicon_0.png')}
                                                  style={{
                                                    height: HeightRatio(40),
                                                    width: HeightRatio(40),
                                                    // alignSelf: 'center'
                                                  }}
                                                />
                                                <Text style={{ color: 'white', fontFamily: 'SofiaSansSemiCondensed-ExtraBold', fontSize: HeightRatio(14) }}>
                                                  Baby Food Tracker
                                                </Text>
                                              </View>
                                              <View style={{ height: HeightRatio(10) }}></View>
                                              <View
                                                style={{
                                                  padding: HeightRatio(10)
                                                }}
                                              >
                                                <Text
                                                  style={{
                                                    color: THEME_FONT_COLOR_WHITE,
                                                    textAlign: 'left',
                                                    fontSize: HeightRatio(20),
                                                    fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                                    marginTop: HeightRatio(10)
                                                  }}
                                                  allowFontScaling={false}
                                                >
                                                  Reset successful, try to Login! &#128077;
                                                </Text>
                                              </View>

                                              <TouchableOpacity
                                                onPress={() => {
                                                  setDisplayResetSuccessModal(!displayResetSuccessModal);
                                                  setDisplayForgotPasswordContent(false);
                                                  setMainState({ userTouch: true })
                                                }}
                                                style={{
                                                  backgroundColor: THEME_COLOR_NEGATIVE,
                                                  display: 'flex',
                                                  justifyContent: 'flex-start',
                                                  padding: HeightRatio(10),
                                                  borderRadius: HeightRatio(10),
                                                  alignSelf: 'center',
                                                  width: (windowWidth - WidthRatio(100)) / 2,
                                                  margin: HeightRatio(10)
                                                }}>
                                                <Text
                                                  style={{
                                                    color: THEME_FONT_COLOR_WHITE,
                                                    fontSize: HeightRatio(25),
                                                    alignSelf: 'center',
                                                    fontFamily: 'SofiaSansSemiCondensed-Regular'
                                                  }}
                                                  allowFontScaling={false}
                                                >
                                                  Close
                                                </Text>
                                              </TouchableOpacity>


                                            </View>
                                          </View>
                                        </View>
                                      </Modal>
                                    </View>
                                  </View>
                                  :
                                  <>
                                    <Text
                                      style={{
                                        color: THEME_FONT_COLOR_BLACK,
                                        alignSelf: 'center',
                                        fontSize: HeightRatio(30),
                                        margin: HeightRatio(20),
                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                      }}
                                      allowFontScaling={false}
                                    >
                                      Don't have an account?
                                    </Text>
                                    <TouchableOpacity onPress={() => { setNewUser(true) }}>
                                      <View style={{
                                        backgroundColor: THEME_COLOR_NEGATIVE,
                                        ...styles.button_Drop_Shadow,
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        padding: HeightRatio(20),
                                        borderRadius: HeightRatio(10),
                                        alignSelf: 'center',
                                        width: windowWidth - WidthRatio(50)
                                      }}>
                                        <Text
                                          style={{
                                            color: THEME_FONT_COLOR_WHITE,
                                            fontSize: HeightRatio(30),
                                            // fontWeight: 'bold',
                                            alignSelf: 'center',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular'
                                          }}
                                          allowFontScaling={false}
                                        >
                                          Sign Up
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  </>
                                }
                              </View>
                            </View>
                          }
                        </>
                      }
                    </>
                  }
                  <View style={{ marginBottom: HeightRatio(400) }}></View>
                </ScrollView>
              </SafeAreaView>
            </LinearGradient>

            <Modal
              animationType="none"
              transparent={true}
              visible={signUpFailedModal}
              onRequestClose={() => {
                setSignUpFailedModal(!signUpFailedModal)

              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)'
                }}
              >
                <View
                  style={{
                    // flex: 1,
                    backgroundColor: '#1f1f27',
                    margin: 20,
                    zIndex: 999,
                    borderRadius: 10,
                    display: 'flex',
                    // alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute', bottom: HeightRatio(30), left: 0, right: 0
                  }}
                >
                  <View
                    style={{
                      margin: HeightRatio(20),
                      // alignSelf: 'center'
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        display: 'flex',
                        alignItems: 'center',
                        // justifyContent: 'center'
                      }}
                    >
                      <Image
                        source={require('../../assets/favicon_0.png')}
                        style={{
                          height: HeightRatio(40),
                          width: HeightRatio(40),
                          // alignSelf: 'center'
                        }}
                      />
                      <Text style={{ color: 'white', fontFamily: 'SofiaSansSemiCondensed-ExtraBold', fontSize: HeightRatio(14) }}>
                        Baby Food Tracker
                      </Text>
                    </View>
                    <View style={{ height: HeightRatio(10) }}></View>
                    <View
                      style={{
                        padding: HeightRatio(10)
                      }}
                    >
                      <Text
                        style={{
                          color: THEME_FONT_COLOR_WHITE,
                          textAlign: 'left',
                          fontSize: HeightRatio(20),
                          fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                          marginTop: HeightRatio(10)
                        }}
                        allowFontScaling={false}
                      >
                        Sign Up Failed
                      </Text>
                      <Text
                        style={{
                          color: THEME_FONT_COLOR_WHITE,
                          textAlign: 'left',
                          fontSize: HeightRatio(20),
                          fontFamily: 'SofiaSansSemiCondensed-Regular',
                          marginTop: HeightRatio(2)
                        }}
                        allowFontScaling={false}
                      >
                        {signUpFailedError.replace('ApolloError:', '').trim()}.
                      </Text>
                      {/* <Text
                        style={{
                          color: THEME_COLOR_ATTENTION,
                          textAlign: 'left',
                          fontSize: HeightRatio(20),
                          fontFamily: 'SofiaSansSemiCondensed-Regular',
                          marginTop: HeightRatio(10)
                        }}
                        allowFontScaling={false}
                      >
                        example@email.com
                      </Text> */}

                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setSignUpFailedModal(!signUpFailedModal);
                        setMainState({ userTouch: true })
                      }}
                      style={{
                        backgroundColor: THEME_COLOR_NEGATIVE,
                        display: 'flex',
                        justifyContent: 'flex-start',
                        padding: HeightRatio(10),
                        borderRadius: HeightRatio(10),
                        alignSelf: 'center',
                        width: (windowWidth - WidthRatio(100)) / 2,
                        margin: HeightRatio(10)
                      }}>
                      <Text
                        style={{
                          color: THEME_FONT_COLOR_WHITE,
                          fontSize: HeightRatio(25),
                          alignSelf: 'center',
                          fontFamily: 'SofiaSansSemiCondensed-Regular'
                        }}
                        allowFontScaling={false}
                      >
                        Close
                      </Text>
                    </TouchableOpacity>


                  </View>
                </View>
              </View>
            </Modal>

          </View>
        </>

        :
        <View
          style={{ ...Styling.container, backgroundColor: '#1f1f27' }}
        />
      }
      {displayNavbar &&
        <Navbar nav={navigation} auth={isTokenValid} position={'absolute'} from={'profile'} />
      }


      <StatusBar
        barStyle="default"
        hidden={false}
        backgroundColor="transparent"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
    </>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: THEME_FONT_COLOR_WHITE,
    borderRadius: 10,
    borderWidth: 3,
    padding: 35,
    alignItems: "center",
    shadowColor: THEME_FONT_COLOR_BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: WidthRatio(300)
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
  homePrimary_Add_Button: {
    backgroundColor: THEME_COLOR_POSITIVE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // padding: HeightRatio(20),
    borderRadius: HeightRatio(10),
    alignSelf: 'center',
    margin: HeightRatio(4)
  },
});