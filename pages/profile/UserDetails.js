import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Button, View, TouchableOpacity, Text, TextInput, StyleSheet, Modal, PixelRatio } from "react-native";
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
            setprompt: setPromptUsernameInput
        },
        {
            title: 'Email',
            detail: userByID?.user.email,
            edit: showEditableFieldEmail,
            setedit: setShowEditableFieldEmail,
            prompt: promptEmailInput,
            setprompt: setPromptEmailInput
        },
        {
            title: 'Password',
            detail: '* * * * *',
            edit: showEditableFieldPassword,
            setedit: setShowEditableFieldPassword,
            prompt: promptPasswordInput1,
            setprompt: setPromptPasswordInput1
        },
        {
            title: 'Delete Account',
            detail: `${userByID?.user._id}`,
            edit: showEditableFieldDelete,
            setedit: setShowEditableFieldDelete,
            prompt: promptDeleteInput,
            setprompt: setPromptDeleteInput
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
                    }}
                >
                    <View
                        style={{
                            borderRadius: HeightRatio(20),
                            padding: HeightRatio(15),
                            width: windowWidth - WidthRatio(50),
                            flexDirection: 'column',
                            margin: HeightRatio(5),
                            alignSelf: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }}

                    >
                        
                        <View style={{ flexDirection: 'column', }}>
                            <Text 
                                style={{
                                    color: 'white',
                                    fontSize: HeightRatio(28),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                    margin: HeightRatio(5)
                                }} 
                                allowFontScaling={false}
                            >{EditableFields[i].title}</Text>

                            <Text
                                style={{
                                    color: '#ffff00',
                                    // alignSelf: 'center', 
                                    fontSize: HeightRatio(15),
                                    fontFamily: 'SofiaSansSemiCondensed-Regular',
                                    margin: HeightRatio(10),
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
                                        backgroundColor: 'rgba(53, 250, 169, 0.50)',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontFamily: 'SofiaSansSemiCondensed-Regular',
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
                                                            <TouchableOpacity onPress={() => copyToClipboard()} style={{}}>
                                                                
                                                                <View style={{
                                                                    backgroundColor: 'rgba(0, 118, 255, 0.10)',
                                                                    display: 'flex',
                                                                    justifyContent: 'flex-start',
                                                                    padding: HeightRatio(20),
                                                                    borderRadius: HeightRatio(10),
                                                                    alignSelf: 'center',
                                                                    width: windowWidth - WidthRatio(80)
                                                                }}>
                                                                    <Text
                                                                        style={{
                                                                            color: 'white',
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
                                                                color: 'white',
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
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                                                    color: 'white',
                                                                    display: 'flex',
                                                                    justifyContent: 'flex-start',
                                                                    padding: 20,
                                                                    borderColor: 'white',
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
                                                                }}
                                                                style={{
                                                                    backgroundColor: 'rgba(30, 228, 168, 0.25)',
                                                                    padding: 10,
                                                                    justifyContent: 'center',
                                                                    margin: HeightRatio(10),
                                                                    borderTopRightRadius: HeightRatio(20),
                                                                    borderBottomRightRadius: HeightRatio(20)
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        color: 'white',
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
                                                            color: 'white',
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
                                                                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                                                color: 'white',
                                                                display: 'flex',
                                                                justifyContent: 'flex-start',
                                                                padding: 20,
                                                                borderColor: 'white',
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
                                                                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                                                color: 'white',
                                                                display: 'flex',
                                                                justifyContent: 'flex-start',
                                                                padding: 20,
                                                                borderColor: 'white',
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
                                                            }}
                                                            style={{
                                                                backgroundColor: 'rgba(30, 228, 168, 0.25)',
                                                                padding: 10,
                                                                justifyContent: 'center',
                                                                margin: HeightRatio(10),
                                                                borderTopRightRadius: HeightRatio(20),
                                                                borderBottomRightRadius: HeightRatio(20)
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: 'white',
                                                                    fontSize: HeightRatio(20),
                                                                    fontFamily: 'GochiHand_400Regular',
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
                                                        style={{ color: 'white', fontSize: HeightRatio(40) }}
                                                        allowFontScaling={false}
                                                    >
                                                        Passwords match!
                                                    </Text>
                                                </View>
                                            }
                                            {promptPasswordInput1 != '' && promptPasswordInput2 != '' && promptPasswordInput1 != promptPasswordInput2 &&
                                                <View style={{ flexDirection: 'row', margin: HeightRatio(20) }}>
                                                    <Text 
                                                        style={{ color: 'red', fontSize: HeightRatio(40) }}
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
                    </View>
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
                                backgroundColor: 'rgba(255, 0, 0, 1)',
                                alignSelf: 'center',
                                borderRadius: 8,
                                position: 'absolute',
                                zIndex: 10,
                                top: 0,
                                right: 0
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => { setDeleteUserModal(!deleteUserModal) }}
                                style={{
                                    borderRadius: 10,
                                    height: 50,
                                    width: 50
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faX}
                                    style={{
                                        color: 'black',
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
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => handleDeleteAccount()}
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
        backgroundColor: "#edf2f4",
        borderRadius: 10,
        borderWidth: 3,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
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
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#d90429'
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#4361ee",
        borderRadius: 10,
        padding: 20
    },
    textStyle: {
        color: "white",
        fontSize: HeightRatio(25),
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: 'black',
        fontSize: HeightRatio(30),
        fontWeight: 'bold'
    }
});