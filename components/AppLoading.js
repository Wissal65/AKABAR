import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const AppLoading = () => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="larg" color="#00CD5E" />
  </View>
);
export default AppLoading
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
