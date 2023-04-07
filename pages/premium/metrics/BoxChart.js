import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeightRatio, WidthRatio, windowWidth } from '../../../Styling';

export const BarChart = (props) => {
  const maxValue = 250;
  const barWidth = 30;

  return (
    <>
      <View style={styles.container}>

        <View style={styles.chart}>
          {props.data.map((item, index) => (
            <View key={index} style={[styles.barContainer, { bottom: index * barWidth * 1.5 }]}>
              <View
                style={{
                  margin: HeightRatio(20),
                  width: WidthRatio(70),
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

              <View
                style={[
                  styles.bar,
                  { backgroundColor: item.color },
                  { width: (item.value / maxValue) * WidthRatio(250) },
                  { height: barWidth },
                ]}
              />
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
