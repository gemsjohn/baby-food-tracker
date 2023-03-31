import React, { useState } from 'react';
import { View, Text, Button, Share, StyleSheet, TouchableOpacity } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { SEND_PDFCONTENT } from '../../../utils/mutations';
import { windowHeight, windowWidth, HeightRatio, WidthRatio } from '../../../Styling';
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
  THEME_FONT_GREY,
  THEME_LIGHT_GREEN
} from '../../../COLOR';

export const PDFGenerator = () => {

  const [sendPDFContent] = useMutation(SEND_PDFCONTENT)
  const htmlContent = `
    <html>
      <head>
        <title>My Simple HTML Page</title>
      </head>
      <body>
        <h1>Hello, world!</h1>
        <p>This is a very simple HTML page.</p>
      </body>
    </html>
`;
  const handleShareContent = async () => {
    try {
      await sendPDFContent({
        variables: {
          email: 'johnrhmartin@gmail.com',
          html: htmlContent

        }
      })
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => {handleShareContent(); setMainState({ userTouch: true })}}>
        <View style={{ ...styles.modalButton, backgroundColor: THEME_COLOR_POSITIVE }}>
          <Text
            style={{ ...styles.modalButton_Text, color: THEME_FONT_COLOR_BLACK }}
            allowFontScaling={false}
          >
            Send Email
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  modalButton: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: HeightRatio(10),
    borderRadius: HeightRatio(10),
    alignSelf: 'center',
    width: (windowWidth - WidthRatio(100)) / 2,
    margin: HeightRatio(10)
  },
  modalButton_Text: {
    color: THEME_FONT_COLOR_WHITE,
    fontSize: HeightRatio(25),
    alignSelf: 'center',
    fontFamily: 'SofiaSansSemiCondensed-Regular'
  },
})