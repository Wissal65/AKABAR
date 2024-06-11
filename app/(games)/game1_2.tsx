import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SecondGame = () => {
  const navigation = useNavigation();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50); // 50 seconds timer
  const [gameOver, setGameOver] = useState(false);
  const [trashesClicked, setTrashesClicked] = useState(0);
  const [trash1Opacity] = useState(new Animated.Value(1));
  const [trash2Opacity] = useState(new Animated.Value(1));
  const [trash3Opacity] = useState(new Animated.Value(1));
  const [trash4Opacity] = useState(new Animated.Value(1));
  const [trash5Opacity] = useState(new Animated.Value(1));
  const [iconOpacities] = useState([new Animated.Value(0.6), new Animated.Value(0.6), new Animated.Value(0.6), new Animated.Value(0.6), new Animated.Value(0.6)]);
  const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
  const [disappearSound, setDisappearSound] = useState<Audio.Sound | null>(null);
  const [appearSound, setAppearSound] = useState<Audio.Sound | null>(null);


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

  useEffect(() => { 
    const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });

    // Hide tab bar when entering the screen
    hideTabBar();

    // Show tab bar when leaving the screen
    return () => showTabBar();
  }, [navigation]);
  

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
        animateTrash(trash1Opacity,0);
      } else if (trashNumber === 2) {
        animateTrash(trash2Opacity,1);
      } else if (trashNumber === 3) {
        animateTrash(trash3Opacity,2);
      }else if (trashNumber === 4) {
        animateTrash(trash4Opacity,3);
      }else if (trashNumber === 5) {
        animateTrash(trash5Opacity, 4);
      }
    }
  };

  const animateTrash = (opacity: Animated.Value, iconIndex: number) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      playSound(disappearSound);
      Animated.timing(iconOpacities[iconIndex], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setTrashesClicked((prevTrashesClicked) => {
        const newTrashesClicked = prevTrashesClicked + 1;
        setScore(newTrashesClicked);
        if (newTrashesClicked === 5) {
          handleGameOver();
        }
        return newTrashesClicked;
      });
    });
  };
  const handleGameOver = async () => {
    setGameOver(true);
    const currentGameScore = trashesClicked + timeLeft;
    setScore(currentGameScore);
    
    // Retrieve the score from the first game
    let firstGameScore = 0;
    try {
      const storedScore = await AsyncStorage.getItem('score');
      if (storedScore !== null) {
        firstGameScore = parseInt(storedScore, 10);
      }
    } catch (error) {
      console.error('Error retrieving score from the first game:', error);
    }

    const finalScore = currentGameScore + firstGameScore;
    setScore(finalScore);

    try {
      await AsyncStorage.setItem('finalScore', finalScore.toString());
      console.log('Final score saved successfully.');
    } catch (error) {
      console.error('Error saving final score:', error);
    }

    if (trashesClicked === 5) {
      setTimeout(() => {
        router.push("/game1_3");
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

  // useEffect(() => {
  //   // Retrieve the final score from AsyncStorage when the component mounts
  //   const retrieveFinalScore = async () => {
  //     try {
  //       const score = await AsyncStorage.getItem('finalScore');
  //       if (score !== null) {
  //         setFinalScore(parseInt(score, 10)); // Parse score to integer
  //       }
  //     } catch (error) {
  //       console.error('Error retrieving final score:', error);
  //     }
  //   };

  //   retrieveFinalScore();
  // }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/back2.png')}
        style={[styles.backgroundImage, { width: windowWidth, height: windowHeight }]}
      >

        <TouchableOpacity style={styles.container} onPress={handleScreenClick} activeOpacity={1}>
        <View style={styles.detectedZonesContainer}>
            {iconOpacities.map((opacity, index) => (
              <Animated.View key={index} style={{ opacity }}>
                <Image
                  source={require('@/assets/images/trash_icon.png')} // Replace with your icon image
                  style={styles.icon}
                />
              </Animated.View>
            ))}
          </View>
          <Animated.View style={[{ top: windowHeight * 0.56, left: windowWidth * 0.4, opacity: trash1Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(1)}>
              <Image
                source={require('@/assets/images/bottle_trash.png')}
                style={styles.bottle_trash}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[{ top: windowHeight * 0.725, left: windowWidth * 0.77, opacity: trash4Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(4)}>
              <Image
                source={require('@/assets/images/lemonade_trash.png')}
                style={styles.lemonade_trash}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[{ top: windowHeight * 0.608, left: windowWidth * 0.84, opacity: trash2Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(2)}>
              <Image
                source={require('@/assets/images/paper_trash.png')}
                style={styles.paper_trash}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[{ top: windowHeight * 0.745, left: windowWidth * 0.39, opacity: trash3Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(3)}>
              <Image
                source={require('@/assets/images/apple_trash.png')}
                style={styles.apple_trash}
              />
            </TouchableOpacity>
          </Animated.View>
           
          <Animated.View style={[{ top: windowHeight * 0.84, left: windowWidth * 0.05, opacity: trash5Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(5)}>
              <Image
                source={require('@/assets/images/paper2_trash.png')}
                style={styles.paper_trash2}
              />
            </TouchableOpacity>
          </Animated.View>

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
    width: 65,
    height: 60,
  },
  bottle_trash: {
    position: 'absolute',
    width: windowWidth * 0.18,
    height: (windowWidth * 0.16) / (448/ 308),
  },

  paper_trash: {
    position: 'absolute',
    width: windowWidth * 0.19,
    height: (windowWidth * 0.17) / (448/ 308),
  },
  apple_trash: {
    position: 'absolute',
    width: windowWidth * 0.18,
    height: (windowWidth * 0.18) / (448/ 308),
  },
  lemonade_trash: {
    position: 'absolute',
      width: windowWidth * 0.1,
      height: (windowWidth * 0.1) / (448/ 308),
  },
  paper_trash2: {
    position: 'absolute',
    width: windowWidth * 0.35,
    height: (windowWidth * 0.35) / (204/ 116),
  },
  // scoreText: {
  //   position: 'absolute',
  //   top: windowHeight * 0.03,
  //   left: windowWidth * 0.05,
  //   color: 'white',
  //   fontSize: 22,
  // },
  timeText: {
    position: 'absolute',
    top: windowHeight * 0.05,
    right: windowWidth * 0.05,
    color: 'white',
    fontSize: 22,
  },
  detectedZonesContainer: {
    position: 'absolute',
    top: windowHeight * 0.05,
    left: windowWidth * 0.05,
    flexDirection: 'row',
    backgroundColor: 'black',
    opacity: 0.75,
    padding: 6,
    borderRadius: 31,
    gap: 3,
  },
  icon: {
    width: windowWidth * 0.04,
    height: windowWidth * 0.045,
    marginHorizontal: 5,
  },
  
});

export default SecondGame;
