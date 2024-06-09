import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const App = () => {
  const navigation = useNavigation();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50); // 50 seconds timer
  const [gameOver, setGameOver] = useState(false);
  const [trashesClicked, setTrashesClicked] = useState(0);
  const [trash1Opacity] = useState(new Animated.Value(1));
  const [trash2Opacity] = useState(new Animated.Value(1));
  const [trash3Opacity] = useState(new Animated.Value(1));
  const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
  const [disappearSound, setDisappearSound] = useState<Audio.Sound | null>(null);
  const [appearSound, setAppearSound] = useState<Audio.Sound | null>(null);
  const [trashIcons, setTrashIcons] = useState<boolean[]>([true, true, true]);

  useEffect(() => {
    const loadSounds = async () => {
      const { sound: click } = await Audio.Sound.createAsync(require('@/assets/audio/tap.mp3'));
      const { sound: disappear } = await Audio.Sound.createAsync(require('@/assets/audio/disappear.wav'));
      const { sound: appear } = await Audio.Sound.createAsync(require('@/assets/audio/appear.wav'));
      setClickSound(click);
      setDisappearSound(disappear);
      setAppearSound(appear);
    };

    loadSounds();

    return () => {
      if (clickSound) {
        clickSound.unloadAsync();
      }
      if (disappearSound) {
        disappearSound.unloadAsync();
      }
      if (appearSound) {
        appearSound.unloadAsync();
      }
    };
  }, []);

  const playSound = async (sound: Audio.Sound | null) => {
    if (sound) {
      await sound.replayAsync();
    }
  };

  const handleScreenClick = async () => {
    playSound(clickSound);
  };

  const handleTrashClick = (trashNumber: Number) => {
    if (!gameOver) {
      playSound(clickSound);
      if (trashNumber === 1) {
        animateTrash(trash1Opacity, 0);
      } else if (trashNumber === 2) {
        animateTrash(trash2Opacity, 1);
      } else if (trashNumber === 3) {
        animateTrash(trash3Opacity, 2);
      }
    }
  };


  const animateTrash = (opacity: Animated.Value, iconIndex: number) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      console.log('Animation completed');
      playSound(disappearSound);
      setTrashIcons((prevTrashIcons) => {
        const newTrashIcons = [...prevTrashIcons];
        newTrashIcons[iconIndex] = false;
        return newTrashIcons;
      });
      setTrashesClicked((prevTrashesClicked) => {
        const newTrashesClicked = prevTrashesClicked + 1;
        setScore(newTrashesClicked);
        if (newTrashesClicked === 3) {
          handleGameOver();
        }
        return newTrashesClicked;
      });
    });
  };

  const handleGameOver = async () => {
    setGameOver(true);
    const finalScore = trashesClicked + timeLeft;
    setScore(finalScore);
    try {
      await AsyncStorage.setItem('score', score.toString());
      console.log('Score saved successfully.');
    } catch (error) {
      console.error('Error saving score:', error);
    }
    if (trashesClicked === 3) {
      setTimeout(() => {
          router.push("/game1_2");
        }, 1000);
    }
  };


  useEffect(() => {
    if (timeLeft === 0 || gameOver) {
      handleGameOver();
    } else {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameOver]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/back1.png')}
        style={[styles.backgroundImage,
           { width: windowWidth, height: windowHeight,}
          ]}
      >
        <TouchableOpacity style={styles.container} onPress={handleScreenClick} activeOpacity={1}>

           <View style={styles.detectedZonesContainer}>
            {trashIcons.map((visible, index) => (
              visible ? (
                <Icon
                  key={index}
                  name="trash"
                  size={windowWidth * 0.05}
                  color="green"
                  style={{ marginHorizontal: 5 }}
                />
              ) : null
            ))}
          </View>

          <Animated.View style={[ { top: windowHeight * 0.54, left: windowWidth * 0.27, opacity: trash1Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(1)}>
              <Image
                source={require('@/assets/images/trash4.png')}
                style={styles.trash}
              />
            </TouchableOpacity>
          </Animated.View>


          <Animated.View style={[ { top: windowHeight * 0.66, left: windowWidth * 0.73, opacity: trash2Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(2)}>
              <Image
                source={require('@/assets/images/paper_trash.png')}
                style={styles.paper_trash}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[ { top: windowHeight * 0.7, left: windowWidth * 0.05, opacity: trash3Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(3)}>
              <Image
                source={require('@/assets/images/trash4.png')}
                style={styles.trash2}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* <Text style={styles.scoreText}>Score: {score}</Text> */}
          <Text style={styles.timeText}>Time Left: {timeLeft}</Text>
        </TouchableOpacity>
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
  trash: {
    position: 'absolute',
    // width: 65,
    // height: 60,
    width: windowWidth * 0.13, 
    height: (windowWidth * 0.13)/(705 / 647), 
  
  },

  paper_trash: {
    position: 'absolute',
    // width: 90,
    // height: 60,
    width: windowWidth * 0.27, 
    height: (windowWidth * 0.27)/(181 / 102), 
  },
  trash2: {
    position: 'absolute',
    // width: 164,
    // height: 160,
    width: windowWidth * 0.5, 
    height: (windowWidth * 0.5)/(705 / 647), 
  },
  scoreText: {
    position: 'absolute',
    top: windowHeight * 0.03,
    left: windowWidth * 0.05,
    color: 'white',
    fontSize: 20,
  },
  timeText: {
    position: 'absolute',
    top: windowHeight * 0.03,
    right: windowWidth * 0.05,
    color: 'white',
    fontSize: 20,
  },
  detectedZonesContainer: {
    position: 'absolute',
    top: windowHeight * 0.03,
    left: windowWidth * 0.05,
    flexDirection: 'row',
    backgroundColor: 'black',
    opacity: 0.55,
    padding: 6,
    borderRadius: 31,
    gap: 3
  },

});

export default App;

