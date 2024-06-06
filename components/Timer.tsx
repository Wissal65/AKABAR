import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/reducer/ui/ModalSlice'; // Adjust the import based on your project structure

const Timer = forwardRef(({ duration ,nextScreen}, ref) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef(null);
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    startTimer,
    stopTimer,
  }));

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          handleTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTimeEnd = () => {
    dispatch(openModal({ componentName: 'YourComponentName', modalText: 'آسف، لقد انتهى الوقت لننتقل إلى المرحلة التالية',navigateTo:nextScreen}));
    stopTimer();
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };


  useEffect(() => {
    return () => stopTimer();
  }, []);

  return (
    <View style={styles.container}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
      },
      timerText: {
        fontSize: 32,
        fontFamily:"AlmaraiExtraBold",
        color: 'white', // Primary text color
        textShadowColor: 'black', // Shadow color
        textShadowOffset: { width: -1, height: 1 }, // Shadow offset
        textShadowRadius: 1, // Shadow radius
      },
      
});

export default Timer;
