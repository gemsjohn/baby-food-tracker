import { useEffect, useState } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { Styling, HeightRatio, WidthRatio, windowHeight, windowWidth } from '../Styling';
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
} from '../COLOR';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';


export const Loading = () => {
    const [startTime, setStartTime] = useState(moment());
    const [elapsedTime, setElapsedTime] = useState(moment.duration(0));

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(moment.duration(moment().diff(startTime)));
        }, 100);

        return () => clearInterval(interval);
    }, [startTime]);

    return (
        <View>
            <LinearGradient
                colors={['#8bccde', '#d05bb6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.homePrimary_Container}
            >
                <Image
                    source={require('../assets/favicon_0.png')}
                    style={{
                        height: HeightRatio(80),
                        width: HeightRatio(80),
                        alignSelf: 'center'
                    }}
                />
                <Text
                    style={{
                        fontFamily: 'SofiaSansSemiCondensed-Regular',
                        color: THEME_FONT_COLOR_BLACK,
                        fontSize: HeightRatio(50),
                        top: HeightRatio(20),
                        textAlign: 'center',
                        width: WidthRatio(200)
                    }}
                    allowFontScaling={false}
                >Baby Food Tracker</Text>
                <View
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: HeightRatio(10),
                        padding: HeightRatio(20)
                    }}
                >
                    <ActivityIndicator size={100} color={'#f7ff6c'} />
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
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    homePrimary_Container: {
        flex: 1,
        backgroundColor: THEME_COLOR_BACKDROP_DARK,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth,
    },
})