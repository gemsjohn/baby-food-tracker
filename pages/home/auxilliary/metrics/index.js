import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';
import { HeightRatio, windowWidth } from '../../../../Styling';
import { FoodGroupMetrics } from './FoodGroupMetrics';

export const SwipeableViews = () => {
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
    <View key={0} style={[styles.view, { backgroundColor: '#9b59b6' }]} />,
    <View key={1} style={[styles.view, { backgroundColor: '#1abc9c' }]} />,
    <View key={2} style={[styles.view, { backgroundColor: 'blue' }]} />,

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
    <View style={{...styles.container, backgroundColor: 'red'}}>
        <View style={styles.pagination}>
            {views.map((view, index) => (
            <View
                key={index}
                style={[
                styles.paginationDot,
                index === activeView && styles.activeDot,
                ]}
                onTouchEnd={() => handleSlide(index)}
            />
            ))}
        </View>
      <Animated.View
        style={[styles.viewsContainer, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {views.map((view, index) => (
          <View key={index} style={{...styles.viewContainer}}>
            {view}
          </View>
        ))}
      </Animated.View>
      
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
    marginTop: HeightRatio(20)
  },
  viewContainer: {
    width: windowWidth,
    height: 200,
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
  },
  paginationDot: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: 'gray',
  },
  activeDot: {
    backgroundColor: 'black',
  },
});
