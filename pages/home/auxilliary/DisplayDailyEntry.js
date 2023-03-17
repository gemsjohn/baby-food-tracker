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
    StyleSheet,
    TextInput,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import {
    faSolid,
    faFlagCheckered,
    faSliders,
    faX,
    faArrowRight,
    faArrowLeft,
    faPlus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Styling, windowWidth, windowHeight, HeightRatio, WidthRatio } from '../../../Styling';
import { MainStateContext } from '../../../App';

export const DisplayDailyEntry = (props) => {
    // console.log(props.facts)
    return (
        <View
            style={{
                alignSelf: 'center',
                backgroundColor: "#47426a",
                margin: 20,
                borderRadius: 10,
                padding: HeightRatio(10)
            }}
        >
            {props.facts.nutritionFacts !== [] &&
                <>
                    <View style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: 'white',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: HeightRatio(30),

                            }}
                        >
                            {props.facts.food}
                        </Text>
                        <View
                            style={{
                                backgroundColor: '#0095ff',
                                margin: HeightRatio(10),
                                padding: HeightRatio(10),
                                borderRadius: HeightRatio(20)
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: HeightRatio(20),
                                }}
                            >
                                {props.facts.schedule}
                            </Text>
                        </View>
                    </View>

                    <Text
                        style={{
                            color: 'white',
                            fontSize: HeightRatio(20),
                            marginTop: HeightRatio(5)
                        }}
                    >
                        Nutrition Details
                    </Text>
                    {props.table}
                </>
            }

        </View>
    )
}