import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const WasteBins = ({ wasteBinImages, score }) => {
  return (
    <View style={styles.container}>
      {wasteBinImages.map((image, index) => (
        <Image
          key={index}
          source={image}
          style={[styles.wasteBin, { opacity: index < score ? 1 : 0.3 }]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 50,
    padding: 7,
  },
  wasteBin: {
    width: 30,
    height: 30,
    margin: 2,
  },
});

export default WasteBins;
