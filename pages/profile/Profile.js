import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { CommonActions } from '@react-navigation/native';
import { UserDetails } from './UserDetails';
// import { SavedGame } from './SavedGame';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../utils/queries';
import { HeightRatio, WidthRatio, Styling } from '../../Styling';
import { Navbar } from '../../components/Navbar';
import * as SecureStore from 'expo-secure-store';
import { MainStateContext } from '../../App';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Loading } from '../../components/Loading';
// import { Tokens } from '../purchase/Tokens';
// import { GoogleProducts } from '../purchase/GoogProducts';
// import { PurchaseFilter } from '../purchase/PurchaseFilter';
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
    Keyboard,
    StyleSheet,
    Linking
} from 'react-native';
import {
    faSolid,
    faFlagCheckered,
    faSliders,
    faGamepad,
    faX,
    faToggleOn,
    faToggleOff,
    faCircleMinus,
    faGlasses
} from '@fortawesome/free-solid-svg-icons'
import { SecureStorage } from './SecureStorage';
import { LinearGradient } from 'expo-linear-gradient';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

async function deleteKey(key) {
    await SecureStore.deleteItemAsync(key);
}

const resetActionAdmin = CommonActions.reset({
    index: 1,
    routes: [{ name: 'Admin', params: {} }]
});

export const ProfileScreen = ({ navigation }) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    const [displaySetUpCosmicKeyModal, setDisplaySetUpCosmicKeyModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [expand_0, setExpand_0] = useState(false)
    const [displayNavbar, setDisplayNavbar] = useState(true);
    const [displayTokens, setDisplayTokens] = useState(false);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetch();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);


    const authState = useRef(false);
    const userID = useRef(null);

    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });

    const resetActionAuth = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Auth', params: {} }]
    });

    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        if (result && authState) {
            return;
        } else if (!result && authState.current) {
            setDisplaySetUpCosmicKeyModal(true)
        }
    }


    useEffect(() => {
        setLoading(true)
        refetch();
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
            authState.current = mainState.current.authState
            userID.current = mainState.current.userID;
            getValueFor('cosmicKey')
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }, 500)



        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };

    }, [])


    const openGooglePlaySubscriptions = () => {
        Linking.openURL('https://play.google.com/store/account/subscriptions');
    }

    

    // setMainState({
    //     tokens_display: false
    // })

    const [fontsLoaded] = useFonts({
        'GochiHand_400Regular': require('../../assets/fonts/GochiHand-Regular.ttf'),
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
                    {displaySetUpCosmicKeyModal && <View style={{backgroundColor: '#ecece6', height: '100%', width: '100%'}} />}
                    <View
                        style={{ ...Styling.container, backgroundColor: '#ecece6' }}
                        onLayout={onLayoutRootView}
                    >
                        <LinearGradient
                            // colors={['#8bccde', '#d05bb6']}
                            colors={['#ecece6', '#ecece6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ ...Styling.container }}
                        >

                            <SafeAreaView style={{}}>
                                <ScrollView
                                    // style={{ backgroundColor: THEME_COLOR_BACKDROP_DARK }}
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                    }
                                >
                                    <View style={{}}>
                                        {mainState.current.authState &&
                                            <>
                                                <Image
                                                    source={require('../../assets/pattern_1.png')}
                                                    style={{
                                                        height: '100%',
                                                        width: '100%',
                                                        opacity: 0.02,
                                                        position: 'absolute',
                                                        zIndex: -10
                                                    }}
                                                />
                                                <View style={{}}>
                                                    <View style={{ flexDirection: 'column', alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <View
                                                            style={{
                                                                width: windowWidth,
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                height: HeightRatio(60),
                                                                // backgroundColor: '#1f1f27',
                                                                marginBottom: HeightRatio(10),
                                                                marginTop: HeightRatio(20)
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    ...Styling.modalScoringVarText,
                                                                    fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                                                    color: THEME_FONT_COLOR_BLACK
                                                                }}
                                                                allowFontScaling={false}>
                                                                User Details
                                                            </Text>
                                                        </View>
                                                        
                                                        <UserDetails nav={navigation} />
                                                    </View>

                                                    {userByID?.user.premium.status &&
                                                        <LinearGradient
                                                            colors={['#ff3172', '#c30735']}
                                                            start={{ x: 0, y: 0 }}
                                                            end={{ x: 1, y: 1 }}
                                                            style={{
                                                                ...styles.button_Drop_Shadow,
                                                                display: 'flex',
                                                                justifyContent: 'flex-start',
                                                                padding: HeightRatio(5),
                                                                borderRadius: HeightRatio(100),
                                                                alignSelf: 'center',
                                                                width: windowWidth - WidthRatio(50),
                                                                margin: HeightRatio(10)
                                                            }}
                                                        >
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    openGooglePlaySubscriptions();
                                                                    setMainState({ userTouch: true })
                                                                }}
                                                                style={Styling.modalWordButton}>
                                                                <View
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        flexDirection: 'row'
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            height: HeightRatio(40),
                                                                            width: HeightRatio(40),
                                                                            borderRadius: HeightRatio(100),
                                                                            borderWidth: 3,
                                                                            borderColor: 'white',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            marginRight: HeightRatio(10),
                                                                            marginLeft: HeightRatio(10)
                                                                        }}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faSolid, faGlasses}
                                                                            style={{ color: THEME_FONT_COLOR_WHITE }}
                                                                            size={25}
                                                                        />
                                                                    </View>
                                                                    <Text
                                                                        style={{
                                                                            color: THEME_FONT_COLOR_WHITE,
                                                                            fontSize: HeightRatio(24),
                                                                            alignSelf: 'center',
                                                                            fontFamily: 'SofiaSansSemiCondensed-ExtraBold'
                                                                        }}
                                                                        allowFontScaling={false}
                                                                    >
                                                                        Cancel Premium Service
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </LinearGradient>
                                                    }
                                                    
                                                    <LinearGradient
                                                        colors={['#f64f69', '#b81aeb']}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 1 }}
                                                        style={{
                                                            ...styles.button_Drop_Shadow,
                                                            display: 'flex',
                                                            justifyContent: 'flex-start',
                                                            padding: HeightRatio(5),
                                                            borderRadius: HeightRatio(100),
                                                            alignSelf: 'center',
                                                            width: windowWidth - WidthRatio(50),
                                                            margin: HeightRatio(10)
                                                        }}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                deleteKey('cosmicKey');
                                                                setTimeout(() => {
                                                                    setDisplaySetUpCosmicKeyModal(true)
                                                                }, 500)
                                                                setMainState({ userTouch: true })
                                                            }}
                                                            style={Styling.modalWordButton}>
                                                            <View
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flexDirection: 'row'
                                                                }}
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faSolid, faCircleMinus}
                                                                    style={{ color: THEME_FONT_COLOR_WHITE, marginRight: HeightRatio(20) }}
                                                                    size={40}
                                                                />
                                                                <Text
                                                                    style={{
                                                                        color: THEME_FONT_COLOR_WHITE,
                                                                        fontSize: HeightRatio(24),
                                                                        alignSelf: 'center',
                                                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold'
                                                                    }}
                                                                    allowFontScaling={false}
                                                                >
                                                                    Remove/Reset Keycode
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </LinearGradient>
                                                    <LinearGradient
                                                        colors={['#2990ef', '#b81aeb']}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 1 }}
                                                        style={{
                                                            ...styles.button_Drop_Shadow,
                                                            display: 'flex',
                                                            justifyContent: 'flex-start',
                                                            padding: HeightRatio(5),
                                                            borderRadius: HeightRatio(100),
                                                            alignSelf: 'center',
                                                            width: windowWidth - WidthRatio(50),
                                                            margin: HeightRatio(10)
                                                        }}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                deleteKey('cosmicKey');

                                                                setMainState({
                                                                    bearerToken: null,
                                                                    userID: null,
                                                                    authState: false
                                                                })
                                                                setMainState({ userTouch: true })
                                                                // navigation.dispatch(resetActionAuth)
                                                                navigation.navigate('Auth')
                                                            }}
                                                            style={{
                                                                ...Styling.modalWordButton,
                                                                marginTop: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >

                                                            <FontAwesomeIcon
                                                                icon={faSolid, faToggleOff}
                                                                style={{ color: THEME_FONT_COLOR_WHITE, marginRight: HeightRatio(20) }}
                                                                size={40}
                                                            />
                                                            <Text
                                                                style={{
                                                                    color: THEME_FONT_COLOR_WHITE,
                                                                    fontSize: HeightRatio(24),
                                                                    // fontWeight: 'bold',
                                                                    alignSelf: 'center',
                                                                    fontFamily: 'SofiaSansSemiCondensed-ExtraBold'
                                                                }}
                                                                allowFontScaling={false}
                                                            >
                                                                Switch User
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </LinearGradient>
                                                    {userByID?.user.role[0] == 'Admin' &&
                                                        <LinearGradient
                                                            colors={['#2990ef', '#b81aeb']}
                                                            start={{ x: 0, y: 0 }}
                                                            end={{ x: 1, y: 1 }}
                                                            style={{
                                                                ...styles.button_Drop_Shadow,
                                                                display: 'flex',
                                                                justifyContent: 'flex-start',
                                                                padding: HeightRatio(5),
                                                                borderRadius: HeightRatio(100),
                                                                alignSelf: 'center',
                                                                width: windowWidth - WidthRatio(50),
                                                                margin: HeightRatio(10)
                                                            }}
                                                        >
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setMainState({ userTouch: true })
                                                                    // navigation.dispatch(resetActionAdmin)
                                                                    navigation.navigate('Admin')
                                                                }}
                                                                style={{
                                                                    ...Styling.modalWordButton,
                                                                    marginTop: 0,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        color: THEME_FONT_COLOR_WHITE,
                                                                        fontSize: HeightRatio(24),
                                                                        // fontWeight: 'bold',
                                                                        alignSelf: 'center',
                                                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold'
                                                                    }}
                                                                    allowFontScaling={false}
                                                                >
                                                                    ADMIN
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </LinearGradient>
                                                    }

                                                </View>

                                                <View style={{ marginBottom: 200 }}></View>
                                            </>
                                        }
                                    </View >
                                </ScrollView>
                            </SafeAreaView>
                        </LinearGradient>


                    </View>
                </>
                :
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: HeightRatio(505),
                        backgroundColor: THEME_COLOR_BACKDROP_DARK
                    }}
                >
                    <Loading />
                </View>
            }

            {displayNavbar && !displayTokens &&
                <Navbar nav={navigation} auth={mainState.current.authState} position={'absolute'} from={'profile'} />
            }
            {displayTokens &&
                <View style={{ position: 'absolute', zIndex: 20, width: windowWidth, height: windowHeight }}>
                    {/* <PurchaseFilter nav={navigation} from={'profile'} /> */}
                    <View style={{ alignSelf: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                setDisplayTokens(false)
                                setMainState({ userTouch: true })
                            }}
                            style={{
                                borderWidth: 3,
                                borderColor: THEME_COLOR_NEGATIVE,
                                borderRadius: 100,
                                height: HeightRatio(60),
                                width: HeightRatio(60),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faSolid, faX}
                                style={{
                                    color: THEME_COLOR_NEGATIVE,
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                </View>
            }
            <Modal
                animationType="slide"
                transparent={true}
                visible={displaySetUpCosmicKeyModal}
                onRequestClose={() => {
                    setDisplaySetUpCosmicKeyModal(!displaySetUpCosmicKeyModal);
                }}
            >
                <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ecece6' }}>
                    <View style={{ padding: HeightRatio(20) }}>
                        <View style={{ flexDirection: 'column' }}>

                            <SecureStorage />

                            <TouchableOpacity
                                onPress={() => {setDisplaySetUpCosmicKeyModal(!displaySetUpCosmicKeyModal); setMainState({ userTouch: true })}}
                                style={Styling.modalWordButton}>
                                <View style={{
                                    backgroundColor: THEME_COLOR_ATTENTION,
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: HeightRatio(20),
                                    borderRadius: HeightRatio(10),
                                    alignSelf: 'center',
                                    width: windowWidth - WidthRatio(150),
                                    ...styles.button_Drop_Shadow,
                                }}>
                                    <Text
                                        style={{
                                            color: THEME_FONT_COLOR_BLACK,
                                            fontSize: HeightRatio(30),
                                            alignSelf: 'center',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular'
                                        }}
                                        allowFontScaling={false}
                                    >
                                        Close
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* 
            <Modal
                animationType="slide"
                transparent={true}
                visible={displayTokens}
                onRequestClose={() => {
                    setDisplayTokens(!displayTokens);
                }}>
                    <View
                        style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}
                    >
                        <GoogleProducts from={'profile'} />
                    </View>
            </Modal> */}

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
    }
});