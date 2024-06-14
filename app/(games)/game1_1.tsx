// App.js
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import Timer from '@/components/Timer';
import WasteBins from "@/components/WasteBins";
import { useDispatch, useSelector } from 'react-redux';
import { openAssistan } from '@/store/reducer/ui/AssistantSlice';
import Assistant from '@/components/Assistant';

const App = () => {
  const navigation = useNavigation();
  const [score, setScore] = useState(0);
  const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
  const dispatch = useDispatch();
  const timerRef = useRef(null);

  // Individual states for each waste bin's visibility
  const [isTrash1Visible, setIsTrash1Visible] = useState(true);
  const [isTrash2Visible, setIsTrash2Visible] = useState(true);
  const [isTrash3Visible, setIsTrash3Visible] = useState(true);

  useEffect(() => {
    const loadSounds = async () => {
      const { sound: click } = await Audio.Sound.createAsync(require('@/assets/audio/tap.mp3'));
      setClickSound(click);
    };
    loadSounds();

    return () => {
      if (clickSound) {
        clickSound.unloadAsync();
      }
    };
  }, []);


  const playSound = async (sound: Audio.Sound | null) => {
    if (sound) {
      await sound.replayAsync();
    }
  };

  const handleTrashClick = (trashNumber: number) => {
    playSound(clickSound);
    if (trashNumber === 1 && isTrash1Visible) {
      setIsTrash1Visible(false);
      updateScore();
    } else if (trashNumber === 2 && isTrash2Visible) {
      setIsTrash2Visible(false);
      updateScore();
    } else if (trashNumber === 3 && isTrash3Visible) {
      setIsTrash3Visible(false);
      updateScore();
    }
  };

  const updateScore = () => {
    setScore((prevScore) => {
      const newScore = Math.min(prevScore + 1, 3); // Assuming a max score of 3
      if (newScore === 3) {
        stopTimer();
        setTimeout(() => {
          navigation.navigate('game1_2');
        }, 0);
      }
      return newScore;
    });
  };

  const startTimer = () => {
    if (timerRef.current) {
      timerRef.current.startTimer();
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      timerRef.current.stopTimer();
    }
  };

  const wasteBinImages = [
    require('@/assets/images/icons/poubelle.png'),
    require('@/assets/images/icons/poubelle.png'),
    require('@/assets/images/icons/poubelle.png'),
  ];

  useEffect(() => {
    const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    hideTabBar();
    startTimer()
    return () => showTabBar();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Assistant onClose={startTimer} />
      <ImageBackground source={require('@/assets/images/back1.png')} style={styles.backgroundImage}>
        <View style={styles.timer}>
          <WasteBins wasteBinImages={wasteBinImages} score={score} />
          <Timer ref={timerRef} duration={15} nextScreen={"game1_2"} />
        </View>
        <View style={styles.clickableArea}>
          {isTrash1Visible && (
            <TouchableOpacity style={[styles.trash, { top: '52%', left: '27%' }]} onPress={() => handleTrashClick(1)}>
              <Image source={require('@/assets/images/trash4.png')} style={styles.trashImage} />
            </TouchableOpacity>
          )}
          {isTrash2Visible && (
            <TouchableOpacity style={[styles.trash, { top: '65%', left: '73%' }]} onPress={() => handleTrashClick(2)}>
              <Image source={require('@/assets/images/paper_trash.png')} style={styles.trashImage} />
            </TouchableOpacity>
          )}
          {isTrash3Visible && (
            <TouchableOpacity style={[styles.trash, { top: '67%', right: '49%' }]} onPress={() => handleTrashClick(3)}>
              <Image source={require('@/assets/images/trash4.png')} style={styles.trashImage1} />
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  clickableArea: {
    ...StyleSheet.absoluteFillObject,
  },
  trash: {
    position: 'absolute',
  },
  trashImage: {
    width: 65,
    height: 60,
  },
  trashImage1: {
    width: 200,
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  timer: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: '4%',
    paddingRight: '4%',
  },
});

export default App;
