import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const TrushCapacity = ({ segments, progress }) => {
  return (
    <View style={styles.container}>
      {segments.map((segment, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            { backgroundColor: index < progress ? segment.color : '#d3d3d3' },
          ]}
        />
      ))}
      <Image source={require('@/assets/images/bin1.png')} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    width:"85%"
  },
  segment: {
    flex: 1,
    height: 30,
    width:15,
    margin: 3,
    borderRadius: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 5,
  },
});

export default TrushCapacity;
