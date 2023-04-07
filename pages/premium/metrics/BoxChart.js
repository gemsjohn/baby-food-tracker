import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeightRatio, WidthRatio, windowWidth } from '../../../Styling';
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
} from '../../../COLOR'

export const BarChart = (props) => {
  const maxValue = 250;
  const barWidth = 30;
  const blockMargin = HeightRatio(4);

  return (
    <>
      <View style={styles.container}>

        <View style={styles.chart}>
          {props.data.map((item, index) => (
            <View key={index} style={[styles.barContainer, { bottom: index * barWidth * 1.5 }]}>
              <View
                style={{
                  margin: HeightRatio(20),
                  width: WidthRatio(80),
                }}
              >
                <Text
                  style={styles.label}
                >
                  {item.label}
                </Text>
                <Text
                  style={styles.sublabel}
                >
                  {item.value} Calories
                </Text>
              </View>

              <View style={{ flexDirection: 'row', width: WidthRatio(190)}}>
                {[...Array(Math.floor(Math.max(0, item.value*0.25)))].map((_, index) => (
                  <View
                    key={index}
                    style={[
                      { backgroundColor: item.color },
                      { height: barWidth },
                      { marginRight: blockMargin },
                      { width: HeightRatio(4) },
                    ]}
                  />
                ))}
              </View>

            </View>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: '#F5FCFF',
    padding: HeightRatio(20)
  },
  chart: {
    position: 'relative',
    width: '100%',
    height: 6 * 30 * 1.5,
  },
  barContainer: {
    // position: 'absolute',
    // left: 0,
    // bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: HeightRatio(50),
    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#1f1f27',
    borderRadius: HeightRatio(10)
  },
  bar: {
    borderRadius: HeightRatio(4),
    marginRight: 10,
  },
  
  label: {
    color: THEME_FONT_COLOR_WHITE,
    fontSize: HeightRatio(25),
    fontFamily: 'SofiaSansSemiCondensed-ExtraBold',
  },
  sublabel: {
    color: THEME_COLOR_ATTENTION,
    fontSize: HeightRatio(20),
    fontFamily: 'SofiaSansSemiCondensed-Regular',
  },
  xAxis: {
    width: windowWidth - HeightRatio(150),
    height: 30,
    marginTop: 10,
  },
  xAxisLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: 'black',
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  xAxisLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
