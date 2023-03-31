import React, { useEffect, useRef, useState, useContext } from 'react';
import { Platform, Text, View, FlatList, Alert, TouchableOpacity, Modal, Image, ActivityIndicator, } from 'react-native';
import { MainStateContext } from '../../../../App';
import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { HeightRatio, WidthRatio, windowHeight, windowWidth } from '../../../../Styling';
import { useMutation, useQuery } from '@apollo/client';
// import { UPDATE_TOKEN_COUNT } from '../../../../utils/mutations';

const APIKeys = {
    google: "goog_PtovwMUfzvQILIKWYsMVFKDRZCZ",
};


export const GoogleProducts = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    // const [updateTokenCount] = useMutation(UPDATE_TOKEN_COUNT);

    // - State for all available package
    const [packages, setPackages] = useState([]);

    // - State for displaying an overlay view
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [loading, setLoading] = useState(false);

    const transactionLength = useRef(null);
    const [updateComplete, setUpdateComplete] = useState(false);
    const [displayModal, setDisplayModal] = useState(mainState.current.tokens_display)
    const [isPuchaseSuccessful, setIsPurchaseSuccessful] = useState(mainState.current.tokens_isPurchaseSuccessful)

    useEffect(() => {
        const getPackages = async () => {
            console.log("# - purchase/GoogProducts/getPackages - 1")
            Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
            await Purchases.configure({ apiKey: APIKeys.google, appUserID: props.userID });
            try {
                console.log("# - purchase/GoogProducts/getPackages - 2")
                const offerings = await Purchases.getOfferings();

                if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                    setPackages(offerings.current.availablePackages);
                }
            } catch (e) {
                console.error(e)
            }
        };

        getPackages();
    }, []);

    const onSelection = async (input) => {
        setIsPurchasing(true);
        setIsPurchaseSuccessful(false);
        setMainState({
            tokens_isPurchaseSuccessful: false
        })

        const customerInfo = await Purchases.getCustomerInfo();
        transactionLength.current = customerInfo.nonSubscriptionTransactions.length;
        console.log("# - onSelection")
        console.log(customerInfo)

        try {
            setDisplayModal(false)
            // setLoading(true)
            setMainState({
                tokens_display: false
            })
            await Purchases.purchasePackage(input);
        } catch (e) {
            if (!e.userCancelled) {
                // Alert.alert('Error purchasing package', e.message);
            }
        } finally {
            checkCustomerInfo(input)
            // setLoading(true)
            setIsPurchasing(false);
        }
    };

    const checkCustomerInfo = async (input) => {
        const customerInfo = await Purchases.getCustomerInfo();
        console.log("# - purchase/GoogProducts/checkCustomerInfo")
        console.log("# - input: ")
        console.log(input)
        console.log("# - transactionLength.current: " + transactionLength.current)
        console.log("# - cusomterInfo.nonSubscriptionTransaction: ")
        console.log(customerInfo.nonSubscriptionTransactions)

        

        const intervalID = setInterval(() => {
            if (
                customerInfo.nonSubscriptionTransactions.length > transactionLength.current &&
                customerInfo.nonSubscriptionTransactions[customerInfo.nonSubscriptionTransactions.length - 1].productIdentifier == `${input.product.identifier}`
            ) {
                console.log('# - purchase/GoogProducts/intervalID - 0')

                if (!updateComplete) {
                    setUpdateComplete(true)
                    // setLoading(false)
                    console.log('# - purchase/GoogProducts/intervalID - 1')
                    console.log(input.product.identifier)

                    // const handleUpdateTokenCount = async () => {
                    //     if (input.identifier === 'npc_token_1') {
                    //         await updateTokenCount({
                    //             variables: {
                    //                 remove: "false",
                    //                 add: "true",
                    //                 amount: "1",
                    //                 userid: props.userID
                    //             }
                    //         });
                    //     } else if (input.identifier === 'npc_token_2') {
                    //         await updateTokenCount({
                    //             variables: {
                    //                 remove: "false",
                    //                 add: "true",
                    //                 amount: "2",
                    //                 userid: props.userID
                    //             }
                    //         });
                    //     } else if (input.identifier === 'npc_token_5') {
                    //         await updateTokenCount({
                    //             variables: {
                    //                 remove: "false",
                    //                 add: "true",
                    //                 amount: "5",
                    //                 userid: props.userID
                    //             }
                    //         });
                    //     }
                    // }

                    // handleUpdateTokenCount();

                    clearInterval(intervalID);
                    setIsPurchaseSuccessful(true);
                    setMainState({
                        tokens_isPurchaseSuccessful: true
                    })
                }



            } else {
                if (updateComplete) {
                    console.log('# - purchase/GoogProducts/intervalID - 2')
                    clearInterval(intervalID);
                    return;
                }
            }
        }, 5000)

        setTimeout(() => {
            console.log('# - purchase/GoogProducts/intervalID - clearInterval')
            clearInterval(intervalID);
            setUpdateComplete(false)
            // setLoading(false)
        }, 300000);




    }

    const Item = ({ title, identifier, description, priceString, purchasePackage }) => (
        <TouchableOpacity
            onPress={() => {onSelection(purchasePackage); setMainState({ userTouch: true });}}
        >

            <View>
                {identifier == 'npc_token_1' &&
                    <>
                        <View style={{
                            backgroundColor: 'rgba(30, 228, 168, 0.5)',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            padding: HeightRatio(20),
                            borderRadius: HeightRatio(10),
                            alignSelf: 'center',
                            width: windowWidth - WidthRatio(50),
                            margin: HeightRatio(4)
                        }}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: HeightRatio(30),
                                    alignSelf: 'center',
                                    fontFamily: 'SofiaSansSemiCondensed-Regular'
                                }}
                                allowFontScaling={false}
                            >
                                1 Token - $0.25
                            </Text>
                        </View>
                    </>
                }

                {identifier == 'npc_token_2' &&
                    <>
                        <View style={{
                            backgroundColor: 'rgba(30, 228, 168, 0.5)',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            padding: HeightRatio(20),
                            borderRadius: HeightRatio(10),
                            alignSelf: 'center',
                            width: windowWidth - WidthRatio(50),
                            margin: HeightRatio(4)
                        }}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: HeightRatio(30),
                                    alignSelf: 'center',
                                    fontFamily: 'SofiaSansSemiCondensed-Regular'
                                }}
                                allowFontScaling={false}
                            >
                                2 Token - $0.48
                            </Text>
                        </View>
                    </>
                }

                {identifier == 'npc_token_5' &&
                    <>
                        <View style={{
                            backgroundColor: 'rgba(30, 228, 168, 0.5)',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            padding: HeightRatio(20),
                            borderRadius: HeightRatio(10),
                            alignSelf: 'center',
                            width: windowWidth - WidthRatio(50),
                            margin: HeightRatio(4)
                        }}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: HeightRatio(30),
                                    alignSelf: 'center',
                                    fontFamily: 'SofiaSansSemiCondensed-Regular'
                                }}
                                allowFontScaling={false}
                            >
                                5 Token - $1.00
                            </Text>
                        </View>
                    </>
                }

            </View>

        </TouchableOpacity>
    );

    return (
        <>
            <FlatList
                data={packages}
                renderItem={({ item }) =>
                    <View style={{ alignSelf: 'center' }}>
                        <Item
                            title={item.product.title}
                            identifier={item.product.identifier}
                            description={item.product.description}
                            priceString={item.product.priceString}
                            purchasePackage={item}
                        />
                    </View>
                }
                keyExtractor={(item) => item.identifier}
            />
            {loading &&
                <View
                    style={{
                        zIndex: 100,
                        position: 'absolute',
                        top: HeightRatio(60),
                        left: HeightRatio(20),
                        width: HeightRatio(600),
                        backgroundColor: 'black',
                        // alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: HeightRatio(30), padding: HeightRatio(20),
                        borderWidth: 2,
                        borderColor: 'white'
                    }}
                >
                    <ActivityIndicator
                        size="large"
                        color="#00ff00"

                    />

                </View>
            }
            {isPuchaseSuccessful &&
                <View
                    style={{
                        zIndex: 100,
                        position: 'absolute',
                        top: HeightRatio(60),
                        left: HeightRatio(20),
                        width: HeightRatio(600),
                        backgroundColor: 'black',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: HeightRatio(30), padding: HeightRatio(20),
                        borderWidth: 2,
                        borderColor: 'white'
                    }}
                >
                    <Text
                        allowFontScaling={false}
                        style={{ color: 'white', fontSize: HeightRatio(40), width: HeightRatio(500), margin: HeightRatio(10) }}>
                        Purchase successful. <Text allowFontScaling={false} style={{ color: '#35faa9' }}>Refresh.</Text>
                    </Text>

                </View>
            }

            {isPurchasing && <View />}
        </>
    );


}