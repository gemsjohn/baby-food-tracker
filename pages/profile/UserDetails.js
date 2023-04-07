import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Button, View, TouchableOpacity, Text, TextInput, StyleSheet, Modal, PixelRatio, Image } from "react-native";
import { Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSolid, faAddressCard, faEnvelope, faSackDollar, faStar, faX, faPenToSquare, faCopy } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../utils/queries';
import * as Clipboard from 'expo-clipboard';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainStateContext } from '../../App';
import { SecureStorage } from './SecureStorage';
import { windowHeight, windowWidth, HeightRatio, WidthRatio, Styling } from '../../Styling';
import * as SecureStore from 'expo-secure-store';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import {
    UPDATE_USER,
    LOGIN_USER,
    UPDATE_USER_PASSWORD,
    DELETE_USER
} from '../../utils/mutations';
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


async function deleteKey(key) {
    await SecureStore.deleteItemAsync(key);
  }

export const UserDetails = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);

    const [updateUser] = useMutation(UPDATE_USER);
    const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD);
    const [deleteUser] = useMutation(DELETE_USER);

    const [showEditableFieldUsername, setShowEditableFieldUsername] = useState(false);
    const [showEditableFieldEmail, setShowEditableFieldEmail] = useState(false);
    const [showEditableFieldPassword, setShowEditableFieldPassword] = useState(false);
    const [showEditableFieldVerification, setShowEditableFieldVerification] = useState(false);
    const [showEditableFieldDelete, setShowEditableFieldDelete] = useState(false);

    const [promptUsernameInput, setPromptUsernameInput] = useState("")
    const [promptEmailInput, setPromptEmailInput] = useState("")
    const [promptPasswordInput1, setPromptPasswordInput1] = useState("")
    const [promptPasswordInput2, setPromptPasswordInput2] = useState("")
    const [promptVerificationInput, setPromptVerificationInput] = useState("")
    const [promptDeleteInput, setPromptDeleteInput] = useState("")

    const [deleteUserModal, setDeleteUserModal] = useState(false);

    let userDetailsArray = [];
    const userID = useRef(null);


    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: userID.current }
    });

    useEffect(() => {
        userID.current = mainState.current.userID;
    }, [])

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(userID.current);
    };

    const resetActionAuth = CommonActions.reset({
        index: 1,
        routes: [{ name: 'Auth', params: {} }]
    });

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


    // [[[USER DETAILS]]]
    const EditableFields = [
        {
            title: 'Username',
            detail: userByID?.user.username,
            edit: showEditableFieldUsername,
            setedit: setShowEditableFieldUsername,
            prompt: promptUsernameInput,
            setprompt: setPromptUsernameInput,
            image: require('../../assets/grape_img.png')
        },
        {
            title: 'Email',
            detail: userByID?.user.email,
            edit: showEditableFieldEmail,
            setedit: setShowEditableFieldEmail,
            prompt: promptEmailInput,
            setprompt: setPromptEmailInput,
            image: require('../../assets/strawberry_img.png')
        },
        {
            title: 'Password',
            detail: '* * * * *',
            edit: showEditableFieldPassword,
            setedit: setShowEditableFieldPassword,
            prompt: promptPasswordInput1,
            setprompt: setPromptPasswordInput1,
            image: require('../../assets/orange_img.png')
        },
        {
            title: 'Delete Account',
            detail: `${userByID?.user._id}`,
            edit: showEditableFieldDelete,
            setedit: setShowEditableFieldDelete,
            prompt: promptDeleteInput,
            setprompt: setPromptDeleteInput,
            image: require('../../assets/cherry_img.png')
        }
    ]


    // [[[UPDATE USER BASED ON USER DETAIL SELECTED]]]
    const handleFormSubmit = async () => {
        if (showEditableFieldUsername) {
            try {
                await updateUser({
                    variables: {
                        profilepicture: userByID?.user.profilepicture,
                        prevusername: userByID?.user.username,
                        username: promptUsernameInput,
                        email: userByID?.user.email,
                    }
                });
                refetch();
            }
            catch (e) { console.error(e); }
        } else if (showEditableFieldEmail) {
            try {
                await updateUser({
                    variables: {
                        profilepicture: userByID?.user.profilepicture,
                        verified: userByID?.user.verified,
                        username: userByID?.user.username,
                        email: promptEmailInput,
                    }
                });
                refetch();
            }
            catch (e) { console.error(e); }
        } else if (showEditableFieldPassword && promptPasswordInput1 == promptPasswordInput2) {
            try {
                await updateUserPassword({
                    variables: {
                        password: promptPasswordInput1
                    }
                });
                refetch();
            }
            catch (e) { console.error(e); }
        } else if (showEditableFieldDelete && promptDeleteInput != '') {
            setDeleteUserModal(true);
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await deleteUser({
                variables: { deleteUserId: promptDeleteInput }
            });
            setMainState({
                bearerToken: null,
                userID: null,
                authState: false
            })

            deleteKey('cosmicKey');
            props.nav.dispatch(resetActionAuth)
        }
        catch (e) { console.error(e); }
    }

    // [[[PRODUCT USER DETAIL SECTIONS]]]
    for (let i = 0; i < EditableFields.length; i++) {
        userDetailsArray[i] =
            <View style={{ width: windowWidth - WidthRatio(100) }} key={i}>
                <TouchableOpacity
                    onPress={() => {
                        setShowEditableFieldUsername(false);
                        setShowEditableFieldEmail(false);
                        setShowEditableFieldPassword(false);
                        setShowEditableFieldVerification(false);
                        setShowEditableFieldDelete(false);
                        EditableFields[i].setedit(current => !current);
                        setPromptUsernameInput("");
                        setPromptEmailInput("");
                        setPromptPasswordInput1("");
                        setPromptPasswordInput2("");
                        setPromptVerificationInput("");
                        setPromptDeleteInput("");
                        setMainState({ userTouch: true })
                    }}
                >
                    <LinearGradient
                            // colors={['#3b8ba6', '#2991ea']}
                            colors={['#1f1f27', '#1f1f27']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: HeightRatio(20),
                                padding: HeightRatio(15),
                                width: windowWidth - WidthRatio(50),
                                flexDirection: 'column',
                                margin: HeightRatio(5),
                                alignSelf: 'center',
                                backgroundColor: THEME_COLOR_BLACK_LOW_OPACITY,
                                ...styles.button_Drop_Shadow,
                            }}
                        >
                        
                        <View style={{ flexDirection: 'column', }}>
                            <View style={{flexDirection: 'row'}}>
                                <Image
                                    source={EditableFields[i].image}
                                    style={{
                                        height: HeightRatio(25),
                                        width: HeightRatio(25)
                                    }}
                                />
                                <Text 
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        fontSize: HeightRatio(25),
                                        fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                        margin: HeightRatio(5)
                                    }} 
                                    allowFontScaling={false}
                                >{EditableFields[i].title}</Text>
                            </View>

                            <Text
                                style={{
                                    color: THEME_COLOR_ATTENTION,
                                    fontSize: HeightRatio(20),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                    margin: HeightRatio(2),
                                    marginLeft: HeightRatio(20),
                                    width: WidthRatio(150)
                                }}
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                allowFontScaling={false}
                            >
                                {EditableFields[i].detail}
                            </Text>

                            {EditableFields[i].edit ?
                                null
                                :
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 10,
                                        top: HeightRatio(10),
                                        alignSelf: 'center',
                                        right: WidthRatio(20),
                                        padding: HeightRatio(12),
                                        borderRadius: HeightRatio(10),
                                        flexDirection: 'row',
                                        // backgroundColor: THEME_COLOR_POSITIVE,
                                        // ...styles.button_Drop_Shadow
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: THEME_FONT_COLOR_WHITE,
                                            fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
                                            fontSize: HeightRatio(23),
                                            alignSelf: 'flex-end'
                                        }}
                                        allowFontScaling={false}
                                    >
                                        EDIT
                                    </Text>
                                </View>
                            }
                        </View>
                        {EditableFields[i].edit ?
                            <>
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignSelf: 'center', margin: HeightRatio(4) }}>
                                        <View style={{ flexDirection: 'column' }}>
                                            {i != 2 &&
                                                <>
                                                    {i == 3 &&
                                                        <>
                                                            <TouchableOpacity onPress={() => {copyToClipboard(); setMainState({ userTouch: true })}} style={{}}>
                                                                
                                                                <View style={{
                                                                    backgroundColor: THEME_COLOR_POSITIVE,
                                                                    display: 'flex',
                                                                    justifyContent: 'flex-start',
                                                                    padding: HeightRatio(20),
                                                                    borderRadius: HeightRatio(10),
                                                                    alignSelf: 'center',
                                                                    width: windowWidth - WidthRatio(80)
                                                                }}>
                                                                    <Text
                                                                        style={{
                                                                            color: THEME_FONT_COLOR_BLACK,
                                                                            fontSize: HeightRatio(16),
                                                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                                                                            alignSelf: 'center',
                                                                        }}
                                                                        allowFontScaling={false}
                                                                    >
                                                                        COPY ID {userByID?.user._id}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </>
                                                    }
                                                    <View style={{ flexDirection: 'column', alignSelf: 'center', margin: 10 }}>
                                                        <Text 
                                                            style={{
                                                                color: THEME_FONT_COLOR_WHITE,
                                                                fontSize: HeightRatio(20),
                                                                fontFamily: 'SofiaSansSemiCondensed-Regular',
                                                                margin: HeightRatio(10),
                                                                marginTop: HeightRatio(10),
                                                                marginBottom: HeightRatio(20)
                                                            }}
                                                            allowFontScaling={false}
                                                        >
                                                            {i == 3 ? 'Paste ID' : 'New ' + EditableFields[i].title}
                                                        </Text>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <TextInput
                                                                type="text"
                                                                name={EditableFields[i].title}
                                                                placeholder={i == 3 ? 'Paste ID' : EditableFields[i].title}
                                                                placeholderTextColor='white'
                                                                value={EditableFields[i].prompt}
                                                                onChangeText={EditableFields[i].setprompt}
                                                                multiline
                                                                numberOfLines={1}
                                                                allowFontScaling={false}
                                                                style={{
                                                                    backgroundColor: THEME_COLOR_BLACK_LOW_OPACITY,
                                                                    color: THEME_FONT_COLOR_WHITE,
                                                                    display: 'flex',
                                                                    justifyContent: 'flex-start',
                                                                    padding: 20,
                                                                    borderColor: THEME_FONT_COLOR_WHITE,
                                                                    borderWidth: 2,
                                                                    alignSelf: 'center',
                                                                    borderRadius: HeightRatio(20),
                                                                    width: windowWidth - WidthRatio(160)
                                                                }}
                                                            />
                                                            {/* [[[SUBMIT BUTTON]]] */}
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    handleFormSubmit();
                                                                    setShowEditableFieldUsername(false);
                                                                    setShowEditableFieldEmail(false);
                                                                    setShowEditableFieldPassword(false);
                                                                    setShowEditableFieldVerification(false);
                                                                    setShowEditableFieldDelete(false);
                                                                    setMainState({ userTouch: true })
                                                                }}
                                                                style={{
                                                                    backgroundColor: THEME_COLOR_POSITIVE,
                                                                    padding: 10,
                                                                    justifyContent: 'center',
                                                                    margin: HeightRatio(10),
                                                                    borderTopRightRadius: HeightRatio(20),
                                                                    borderBottomRightRadius: HeightRatio(20),
                                                                    ...styles.button_Drop_Shadow
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        color: THEME_FONT_COLOR_BLACK,
                                                                        fontSize: HeightRatio(20),
                                                                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                                                                    }}
                                                                    allowFontScaling={false}
                                                                >SUBMIT &nbsp;</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </>
                                            }


                                            {i == 2 &&
                                                <>
                                                    <Text 
                                                        style={{
                                                            color: THEME_FONT_COLOR_WHITE,
                                                            fontSize: HeightRatio(20),
                                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
                                                            margin: HeightRatio(20)
                                                        }}
                                                        allowFontScaling={false}
                                                    >
                                                        New Password
                                                    </Text>
                                                    <View style={{ flexDirection: 'row', margin: 10 }}>
                                                        <TextInput
                                                            type="password"
                                                            name={EditableFields[i].title}
                                                            placeholder={'New ' + EditableFields[i].title}
                                                            placeholderTextColor='white'
                                                            value={promptPasswordInput1}
                                                            onChangeText={setPromptPasswordInput1}
                                                            secureTextEntry={true}
                                                            allowFontScaling={false}
                                                            style={{
                                                                backgroundColor: THEME_COLOR_BLACK_LOW_OPACITY ,
                                                                color: THEME_FONT_COLOR_WHITE,
                                                                display: 'flex',
                                                                justifyContent: 'flex-start',
                                                                padding: 20,
                                                                borderColor: THEME_FONT_COLOR_WHITE,
                                                                borderWidth: 2,
                                                                // alignSelf: 'center',
                                                                borderRadius: HeightRatio(20),
                                                                width: windowWidth - WidthRatio(160),
                                                            }}
                                                        />
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 10 }}>
                                                        <TextInput
                                                            type="password"
                                                            name={EditableFields[i].title}
                                                            placeholder='Confirm Password'
                                                            placeholderTextColor='white'
                                                            value={promptPasswordInput2}
                                                            onChangeText={setPromptPasswordInput2}
                                                            secureTextEntry={true}
                                                            allowFontScaling={false}
                                                            style={{
                                                                backgroundColor: THEME_COLOR_BLACK_LOW_OPACITY,
                                                                color: THEME_FONT_COLOR_WHITE,
                                                                display: 'flex',
                                                                justifyContent: 'flex-start',
                                                                padding: 20,
                                                                borderColor: THEME_FONT_COLOR_WHITE,
                                                                borderWidth: 2,
                                                                alignSelf: 'center',
                                                                borderRadius: HeightRatio(20),
                                                                width: windowWidth - WidthRatio(160)
                                                            }}
                                                        />
                                                        {/* [[[SUBMIT BUTTON]]] */}
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                handleFormSubmit();
                                                                setShowEditableFieldUsername(false);
                                                                setShowEditableFieldEmail(false);
                                                                setShowEditableFieldPassword(false);
                                                                setShowEditableFieldVerification(false);
                                                                setShowEditableFieldDelete(false);
                                                                setMainState({ userTouch: true })
                                                            }}
                                                            style={{
                                                                backgroundColor: THEME_COLOR_POSITIVE,
                                                                padding: 10,
                                                                justifyContent: 'center',
                                                                margin: HeightRatio(10),
                                                                borderTopRightRadius: HeightRatio(20),
                                                                borderBottomRightRadius: HeightRatio(20),
                                                                ...styles.button_Drop_Shadow
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: THEME_FONT_COLOR_BLACK,
                                                                    fontSize: HeightRatio(20),
                                                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                                                }}
                                                                allowFontScaling={false}
                                                            >SUBMIT &nbsp;</Text>
                                                        </TouchableOpacity>

                                                    </View>

                                                </>
                                            }
                                            {promptPasswordInput1 != '' && promptPasswordInput2 != '' && promptPasswordInput1 == promptPasswordInput2 &&
                                                <View style={{ flexDirection: 'row', margin: HeightRatio(20) }}>
                                                    <Text 
                                                        style={{ color: THEME_FONT_COLOR_WHITE, fontSize: HeightRatio(40) }}
                                                        allowFontScaling={false}
                                                    >
                                                        Passwords match!
                                                    </Text>
                                                </View>
                                            }
                                            {promptPasswordInput1 != '' && promptPasswordInput2 != '' && promptPasswordInput1 != promptPasswordInput2 &&
                                                <View style={{ flexDirection: 'row', margin: HeightRatio(20) }}>
                                                    <Text 
                                                        style={{ color: THEME_COLOR_NEGATIVE, fontSize: HeightRatio(40) }}
                                                        allowFontScaling={false}
                                                    >
                                                        Passwords do not match!
                                                    </Text>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                </View>
                            </>
                            :
                            null
                        }
                    </LinearGradient>
                </TouchableOpacity>
            </View>



    }
    return (
        <View onLayout={onLayoutRootView}>
            {userDetailsArray}
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteUserModal}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setDeleteUserModal(!deleteUserModal);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {/* TOP ROW */}
                        <View
                            style={{
                                backgroundColor: THEME_COLOR_NEGATIVE,
                                alignSelf: 'center',
                                borderRadius: 8,
                                position: 'absolute',
                                zIndex: 10,
                                top: 0,
                                right: 0
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => { {setDeleteUserModal(!deleteUserModal); setMainState({ userTouch: true })} }}
                                style={{
                                    borderRadius: 10,
                                    height: 50,
                                    width: 50
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faX}
                                    style={{
                                        color: THEME_FONT_COLOR_WHITE,
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        marginTop: 17
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        {/* MIDDLE ROW */}
                        <Text 
                            style={styles.modalText}
                            allowFontScaling={false}
                        >Are you sure you want to delete your account?</Text>
                        <TouchableOpacity
                            style={[styles.button]}
                            onPress={() => {handleDeleteAccount(); setMainState({ userTouch: true })}}
                        >
                            <Text 
                                style={styles.textStyle}
                                allowFontScaling={false}
                            >Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );

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
    button: {
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        backgroundColor: THEME_COLOR_NEGATIVE
    },
    // buttonOpen: {
    //     backgroundColor: "#F194FF",
    // },
    buttonClose: {
        backgroundColor: THEME_COLOR_POSITIVE,
        borderRadius: 10,
        padding: 20
    },
    textStyle: {
        color: THEME_FONT_COLOR_WHITE,
        fontSize: HeightRatio(25),
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: THEME_FONT_COLOR_BLACK,
        fontSize: HeightRatio(30),
        fontWeight: 'bold'
    },
    button_Drop_Shadow: {
        padding: HeightRatio(12),
        borderRadius: HeightRatio(20),
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