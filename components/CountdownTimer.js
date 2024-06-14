import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import ProgressBar from 'react-native-progress/Bar'; // Import ProgressBar from react-native-progress
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/reducer/ui/ModalSlice'; // Adjust the import based on your project structure
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CountdownTimer = forwardRef(({ duration, nextScreen }, ref) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(1); // State for progress bar
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null); // Ref for progress interval
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    startTimer,
    stopTimer,
  }));

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          clearInterval(progressIntervalRef.current);
          handleTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => prev - 1 / duration);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const handleTimeEnd = () => {
    dispatch(openModal({ componentName: 'YourComponentName', modalText: 'آسف، لقد انتهى الوقت لننتقل إلى المرحلة التالية', navigateTo: nextScreen }));
    stopTimer();
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressBar
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
});

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
