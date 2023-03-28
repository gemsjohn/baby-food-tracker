import React from 'react';
import { View, Text, Button, Share } from 'react-native';

export const PDFGenerator = () => {

const data = `
    This is a test.
`;
  const handleShareDocument = async () => {
    try {
      await Share.share({
        message: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
        <Button title="Share Document" onPress={handleShareDocument} />
    </View>
  );
}
