import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated, Text } from 'react-native';
import { HeightRatio, windowHeight, windowWidth } from '../../../../Styling';
import { FoodGroupMetrics } from './FoodGroupMetrics';
import { AllergyTracking } from './AllergyTracking';
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
    THEME_FONT_GREY
} from '../../../../COLOR'
import {
    faSolid,
    faFlagCheckered,
    faSliders,
    faX,
    faArrowRight,
    faArrowLeft,
    faPlus,
    faBars,
    faCheck,
    faChartSimple,
    faStar,
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export const SwipeableViews = (props) => {
    const [activeView, setActiveView] = useState(0);
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx > 0 && activeView > 0) {
                    setActiveView(activeView - 1);
                } else if (gestureState.dx < 0 && activeView < 2) {
                    setActiveView(activeView + 1);
                }
            },
        })
    ).current;

    const views = [
        {
            content:
                <View key={0} style={[styles.view]}>
                    <FoodGroupMetrics
                        date={props.date}
                        subuser={props.subuser}
                    />
                </View>,
            title: "Food Group"

        },
        {
            content:
                <View key={2} style={[styles.view, { backgroundColor: 'blue' }]} />,
            title: "Insights"

        },
        {
            content:
                <View key={1} style={styles.view}>
                    <AllergyTracking 
                        subuser={props.subuser}
                    />
                </View>,
            title: "Allergies"

        },
        
        
        

    ];

    const translateX = useRef(new Animated.Value(0)).current;

    const handleSlide = (index) => {
        setActiveView(index);
        Animated.timing(translateX, {
            toValue: -index * windowWidth,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={{ ...styles.container }}>
            <View style={styles.pagination}>
                {views.map((view, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === activeView && styles.activeDot,
                        ]}
                        onTouchEnd={() => handleSlide(index)}
                    >
                        <Text
                            style={{
                                color: index === activeView ? THEME_FONT_COLOR_BLACK : THEME_FONT_COLOR_WHITE,
                                fontSize: HeightRatio(20),
                                fontFamily: "SofiaSansSemiCondensed-ExtraBold",
                            }}
                            allowFontScaling={false}
                        >
                            {view.title}
                        </Text>
                    </View>
                ))}
            </View>
            <View
                style={{
                    backgroundColor: 'rgba(31, 31, 39, 1.00)',
                    // zIndex: 999,
                    width: windowWidth - HeightRatio(10),
                    padding: HeightRatio(20),
                    borderRadius: HeightRatio(10),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    margin: HeightRatio(10),
                    padding: HeightRatio(20)
                }}
            >
                <Animated.View
                    style={[styles.viewsContainer, { transform: [{ translateX }] }]}
                    {...panResponder.panHandlers}
                >
                    {views.map((view, index) => (
                        <View key={index} style={{ ...styles.viewContainer }}>
                            {view.content}
                        </View>
                    ))}
                </Animated.View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    viewsContainer: {
        flexDirection: 'row',
        width: windowWidth - HeightRatio(30),
        // marginTop: HeightRatio(20)
    },
    viewContainer: {
        width: windowWidth,
        height: windowHeight/1.45,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    view: {
        width: windowWidth - HeightRatio(30),
        height: '100%',
        borderRadius: 10,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: HeightRatio(10),
        padding: HeightRatio(10)
    },
    paginationDot: {
        width: HeightRatio(120),
        height: HeightRatio(30),
        borderRadius: 4,
        marginHorizontal: 5,
        backgroundColor: '#1f1f27',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDot: {
        backgroundColor: THEME_COLOR_POSITIVE,
    },
});
