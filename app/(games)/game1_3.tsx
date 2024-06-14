import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import Timer from '@/components/Timer';
import WasteBins from "@/components/WasteBins";
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/reducer/ui/ModalSlice';
import { LevelContext } from '@/hooks/ContextLevel';
const game1_3 = () => {
  const navigation = useNavigation();
  const [score, setScore] = useState(0);
  const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
  const dispatch = useDispatch();
  const handleOpenModal = () => {
    dispatch(openModal({ componentName: 'YourComponentName', modalText: ' لننتقل إلى المرحلة التالية',navigateTo:'tri_game'}));
  };
  // Individual states for each waste bin's visibility
  const [isTrash1Visible, setIsTrash1Visible] = useState(true);
  const [isTrash2Visible, setIsTrash2Visible] = useState(true);
  const [isTrash3Visible, setIsTrash3Visible] = useState(true);

  useEffect(() => {
    const loadSounds = async () => {
      const { sound: click } = await Audio.Sound.createAsync(require('@/assets/audio/tap.mp3'));
      setClickSound(click);
    };
    startTimer();
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

      // Handle visibility and score update based on the clicked waste bin
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
  const { unlockLevel } = useContext(LevelContext);
  const levelId = 1; // Replace with the appropriate level ID for this game
  const completeLevel = () => {
    const nextLevel = levelId + 1;
    unlockLevel(nextLevel);
    navigation.navigate('trie_intro'); // Navigate back to home or any other screen
  };
  const updateScore = () => {
    setScore((prevScore) => {
      const newScore = Math.min(prevScore + 1, 3); // Assuming a max score of 3
      if (newScore === 3) {
        stopTimer();
        setTimeout(() => {
          completeLevel();          
        }, 0);
      }
      return newScore;
    });
  };


  const timerRef = useRef();

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
    // Hide tab bar when entering the screen
    hideTabBar();
    // Show tab bar when leaving the screen
    return () => showTabBar();
  }, [navigation]);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/back3.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.timer}>
          <WasteBins wasteBinImages={wasteBinImages} score={score} />
          <Timer ref={timerRef} duration={500} nextScreen={"tri_game"} />
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

export default game1_3;

{/*import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const SecondGame = () => {
  const [finalScore, setFinalScore] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5000); // 50 seconds timer
  const [gameOver, setGameOver] = useState(false);
  const [trashesClicked, setTrashesClicked] = useState(0);
  const [trash1Opacity] = useState(new Animated.Value(1));
  const [trash2Opacity] = useState(new Animated.Value(1));
  const [trash3Opacity] = useState(new Animated.Value(1));
  const [trash4Opacity] = useState(new Animated.Value(1));
  const [trash5Opacity] = useState(new Animated.Value(1));
  const [trash6Opacity] = useState(new Animated.Value(1));
  const [trash7Opacity] = useState(new Animated.Value(1));
  const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
  const [disappearSound, setDisappearSound] = useState<Audio.Sound | null>(null);
  const [appearSound, setAppearSound] = useState<Audio.Sound | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showGameOverDiv, setShowGameOverDiv] = useState(false);
  const [gameOverDivOpacity] = useState(new Animated.Value(0));
  const [gameOverImagePosition] = useState(new Animated.Value(0));

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
        animateTrash(trash1Opacity);
      } else if (trashNumber === 2) {
        animateTrash(trash2Opacity);
      } else if (trashNumber === 3) {
        animateTrash(trash3Opacity);
      }else if (trashNumber === 4) {
        animateTrash(trash4Opacity);
      }else if (trashNumber === 5) {
        animateTrash(trash5Opacity);
      }else if (trashNumber === 6) {
        animateTrash(trash6Opacity);
      }else if (trashNumber === 7) {
        animateTrash(trash7Opacity);
      }
    }
  };

  const animateTrash = (opacity:Animated.Value) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      console.log('Animation completed');
      playSound(disappearSound);
       // Increment trashesClicked after the animation is complete
       setTrashesClicked((prevTrashesClicked) => {
        const newTrashesClicked = prevTrashesClicked + 1;
        setScore(newTrashesClicked);
        if (newTrashesClicked === 7) {
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
    // setFinalScore(finalScore);
    setShowOverlay(true);
    setShowGameOverDiv(true);

    try {
      await AsyncStorage.setItem('finalScore', finalScore.toString());
      console.log('Final score saved successfully.');
    } catch (error) {
      console.error('Error saving final score:', error);
    }

    // Show the game over message with animation
    Animated.timing(gameOverDivOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      playSound(appearSound);
    });

    // Animate the game over image position
    Animated.timing(gameOverImagePosition, {
      toValue: 100, // Adjust as needed
      duration: 1000, // Adjust as needed
      useNativeDriver: true,
    }).start();
    // Navigate to the new screen after 10 seconds
    setTimeout(() => {
      // navigation.navigate('NewScreen');
      router.push("/game2");
    }, 10000);
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

  useEffect(() => {
    // Retrieve the final score from AsyncStorage when the component mounts
    const retrieveFinalScore = async () => {
      try {
        const score = await AsyncStorage.getItem('finalScore');
        if (score !== null) {
          setFinalScore(parseInt(score, 10)); // Parse score to integer
        }
      } catch (error) {
        console.error('Error retrieving final score:', error);
      }
    };

    retrieveFinalScore();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/back3.png')}
        style={styles.backgroundImage}
      >
        {showOverlay && (
          <View style={styles.overlay} />
        )}

        <TouchableOpacity style={styles.container} onPress={handleScreenClick} activeOpacity={1}>
          {showGameOverDiv && (
            <Animated.View style={[styles.gameOverDiv, { opacity: gameOverDivOpacity }]}>
              <Animated.Image
                source={require('@/assets/images/A3.png')}
                style={[styles.gameOverImage, { transform: [{ translateY: gameOverImagePosition }] }]}
              />
            </Animated.View>
          )}

          <Animated.View style={[styles.trash, { top: '52%', left: '64%', opacity: trash1Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(1)}>
              <Image
                source={require('@/assets/images/trash4.png')}
                style={styles.trash3}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.trash, { top: '59%', left: '68%', opacity: trash4Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(4)}>
              <Image
                source={require('@/assets/images/trash6.png')}
                style={styles.trash5}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.trash, { top: '60%', left: '31%', opacity: trash2Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(2)}>
              <Image
                source={require('@/assets/images/paper_trash.png')}
                style={styles.paper_trash}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.bottle_trash, { top: '89%', right: '1%', opacity: trash3Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(3)}>
              <Image
                source={require('@/assets/images/bottle_trash.png')}
                style={styles.bottle_trash}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles. apple_trash, { top: '76%', right: '82%', opacity: trash5Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(5)}>
              <Image
                source={require('@/assets/images/apple_trash.png')}
                style={styles. apple_trash}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[styles. apple_trash, { top: '83%', right: '84%', opacity: trash6Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(6)}>
              <Image
                source={require('@/assets/images/apple_trash.png')}
                style={styles. apple_trash}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[styles.trash4, { top: '50%', right: '85%', opacity: trash7Opacity }]}>
            <TouchableOpacity onPress={() => handleTrashClick(7)}>
              <Image
                source={require('@/assets/images/trash4.png')}
                style={styles. trash4}
              />
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.scoreText}>Score: {score}</Text>
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
  trash3: {
    position: 'absolute',
    width: 30,
    height:30,
  },

  paper_trash: {
    position: 'absolute',
    width: 40,
    height: 20,
  },
  bottle_trash: {
    position: 'absolute',
    width: 70,
    height: 50,
  },
  trash5: {
    position: 'absolute',
    width: 110,
    height: 70,
  },
  apple_trash: {
    position: 'absolute',
    width: 50,
    height: 30,
  },
  trash4:{
    position: 'absolute',
    width: 50,
    height: 50,
  },
  scoreText: {
    position: 'absolute',
    top: 20,
    left: 10,
    color: 'white',
    fontSize: 20,
  },
  timeText: {
    position: 'absolute',
    top: 20,
    right: 10,
    color: 'white',
    fontSize: 20,
  },
  gameOverDiv: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverImage: {
    width: 250,
    height: 350,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.5,
  },
});

export default SecondGame;
*/}