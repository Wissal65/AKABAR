// Question.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function Question() {
  return (
    <View style={styles.backQuestion}>
      <Text style={styles.question}>ضع الازبال في القمامة المناسبة</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  question: {
    textAlign: 'center',
    fontSize: width * 0.07, 
  },
  backQuestion: {
    position: 'absolute',
    top: '15%', 
    width: '105%',
    height: '10%', 
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'orange',
    borderWidth: 5,
    justifyContent: 'center',
  },
});
