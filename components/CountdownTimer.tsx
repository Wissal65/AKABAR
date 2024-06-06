// components/CountdownTimer.js
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { openModal } from '../store/reducer/ui/ModalSlice';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const CountdownTimer = ({ totalDuration, navigateTo}) => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const [progress, setProgress] = useState(1);
  const intervalRef = useRef(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (navigateTo) {
            navigateTo();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [dispatch, navigateTo]);

  useEffect(() => {
    setProgress(timeLeft / totalDuration);
  }, [timeLeft, totalDuration]);

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={progress}
          width={null}
          height={20}
          color="#FFD700"
          unfilledColor="#D3D3D3"
          borderWidth={0}
          borderRadius={10}
          style={styles.progressBar}
        />
        <Icon name="timer-outline" size={20} color="#000" style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 2,
  },
  progressBar: {
    flex: 1,
    marginRight: 5,
  },
  icon: {
    marginRight: 5,
  },
});

export default CountdownTimer;