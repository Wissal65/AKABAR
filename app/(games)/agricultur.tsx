import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ImageBackground, Dimensions } from 'react-native';
import image from '@/assets/images/back2.jpg';
import FlipCard from 'react-native-flip-card';
import { Audio } from 'expo-av';
import { getScore, incrementScore } from '../../hooks/scoreManager';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/reducer/ui/ModalSlice';
import CountdownTimer from '@/components/CountdownTimer';
import Timer from '@/components/Timer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LevelContext } from '@/hooks/ContextLevel';

const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

const agricultural = () => {
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [score, setScore] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState(Array(4).fill(''));
  const [letters] = useState(['ئ', 'ب', 'ح', 'ي', 'س', 'ب', 'ط', 'ش', 'ح', 'ي']);
  const correctAnswer = ['ب', 'ي', 'ئ', 'ي'];

  const [clickSound, setClickSound] = useState();
  const [victorySound, setVictorySound] = useState();
  const [loseSound, setLoseSound] = useState();

  const { unlockLevel } = useContext(LevelContext);
  const levelId = 5; // Replace with the appropriate level ID for this game
  const completeLevel = () => {
    const nextLevel = levelId + 1;
    unlockLevel(nextLevel);
    navigation.navigate('home'); // Navigate back to home or any other screen
  };
  useEffect(() => {
    const handleChange = ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    };

    const subscription = Dimensions.addEventListener('change', handleChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    const loadScore = async () => {
      const savedScore = await getScore();
      setScore(savedScore);
    };

    loadScore();
  }, []);

  useEffect(() => {
    const loadSounds = async () => {
      const click = await Audio.Sound.createAsync(
        require('../../assets/audio/click1.wav')
      );
      const victory = await Audio.Sound.createAsync(
        require('../../assets/audio/win.mp3')
      );
      const lose = await Audio.Sound.createAsync(
        require('../../assets/audio/lose.mp3')
      );
      setClickSound(click.sound);
      setVictorySound(victory.sound);
      setLoseSound(lose.sound);
    };

    loadSounds();

    return () => {
      if (clickSound) {
        clickSound.unloadAsync();
      }
      if (victorySound) {
        victorySound.unloadAsync();
      }
      if (loseSound) {
        loseSound.unloadAsync();
      }
    };
  }, []);

  const playClickSound = async () => {
    if (clickSound) {
      await clickSound.replayAsync();
    }
  };

  const playVictorySound = async () => {
    if (victorySound) {
      await victorySound.replayAsync();
    }
  };

  const playLoseSound = async () => {
    if (loseSound) {
      await loseSound.replayAsync();
    }
  };

  const handleIncrement = async () => {
    const newScore = await incrementScore(10); // Increment score by 10
    setScore(newScore);
  };

  const toggleFlip = () => {
    setIsFlipped((prevIsFlipped) => !prevIsFlipped);
  };

  useEffect(() => { 
    const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    startTimer();
    // Hide tab bar when entering the screen
    hideTabBar();

    // Show tab bar when leaving the screen
    return () => showTabBar();
  }, [navigation]);

  const handleLetterPress = (letter) => {
    const newSelectedLetters = [...selectedLetters];
    const firstEmptyIndex = newSelectedLetters.findIndex(item => item === '');
    if (firstEmptyIndex !== -1) {
      newSelectedLetters[firstEmptyIndex] = letter;
      setSelectedLetters(newSelectedLetters);
      playClickSound();

      // Check if all four letters are selected
      if (firstEmptyIndex === 3) {
        handleCheckAnswer(newSelectedLetters); // Call handleCheckAnswer
      }
    }
  };

  const handleCheckAnswer = (lettersToCheck) => {
    if (JSON.stringify(lettersToCheck) === JSON.stringify(correctAnswer)) {
      toggleFlip();
      playVictorySound();
      handleIncrement();
      stopTimer();
      setTimeout(() => {
        completeLevel();
      }, 4000);
    } else {
      Alert.alert('Try Again', 'The answer is incorrect.');
      playLoseSound();
    }
  };

  const handleReset = () => {
    setSelectedLetters(Array(4).fill(''));
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

  return (
    <ImageBackground source={image} resizeMode="cover" style={[styles.container, { width: dimensions.width, height: dimensions.height+50 }]} blurRadius={5}>
      <View style={styles.timer}>
        <CountdownTimer ref={timerRef} duration={30} nextScreen={"recycling"} />
      </View>
      <View style={styles.card}>
        <FlipCard
          friction={6}
          perspective={500}
          flipHorizontal={true}
          flipVertical={false}
          flip={isFlipped}
          clickable={false}
        >
          {/* Face Side */}
          <View style={styles.imageContainer}>
            <View style={styles.backgroundImage}>
              <Image source={require('../../assets/images/agriculturalShadow.png')} style={styles.silhouetteImage} />
            </View>
          </View>
          {/* Back Side */}
          <View style={styles.imageContainer}>
            <View style={styles.backgroundImage}>
              <Image source={require('../../assets/images/agricultural.png')} style={styles.silhouetteImage} />
            </View>
          </View>
        </FlipCard>
      </View>
      <View style={styles.answar}>
        <View style={styles.hintTextContainer}>
          <Text style={styles.hintText}>أقوم بوضع البرامج البيئية وأقترح حلولا للقضايا البيئية فمن اكون</Text>
        </View>
        <View style={styles.answerContainer}>
          {selectedLetters.map((letter, index) => (
            <View key={index} style={styles.answerBox}>
              <Text style={styles.answerLetter}>{letter}</Text>
            </View>
          )).reverse()}
          <View style={styles.answerBox1}>
            <Text style={styles.answerLetter}>مهندس</Text>
          </View>
        </View>
      </View>
      <View style={styles.clavier}>
        <View style={styles.lettersContainer}>
          {letters.map((letter, index) => (
            <TouchableOpacity key={index} style={styles.letterBox} onPress={() => handleLetterPress(letter)}>
              <Text style={styles.letter}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button2} onPress={handleReset}>
          <Ionicons name="refresh-sharp" size={35} color="#fff"/>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  backgroundImage: {
    width: initialWidth*0.6,
    height: initialHeight*0.4,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#ebe5cd"
  },
  timer: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: "4%",
  },
  card: {
    height: initialHeight*0.25,
  },
  silhouetteImage: {
    width: initialWidth*0.25,
    height: initialHeight*0.36,
  },
  hintTextContainer: {
    height: 80,
    backgroundColor: "#fff",
    width: "120%",
    borderWidth: 3,
    borderColor: "#ebe5cd",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  hintText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: "AlmaraiRegular",
    lineHeight: 30,
  },
  answar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:"15%"
  },
  answerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 0,
    alignItems: "center",
  },
  answerBox: {
    width: 53,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#FFBE0B",
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    marginRight: 3,
  },
  answerBox1: {
    width: "auto",
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#FFBE0B",
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  answerLetter: {
    fontSize: 24,
    fontFamily: "AlmaraiBold",
  },
  clavier: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    backgroundColor:"rgba(235,229,205, 0.5)",
    borderTopRightRadius:16,
    borderTopLeftRadius:16,

  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  letterBox: {
    width: 53,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#ebe5cd",
    backgroundColor: '#fff',
  },
  letter: {
    fontSize: 24,
    fontFamily: "AlmaraiBold"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems:"center",
    width: "90%"
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FFBE0B",
    borderRadius: 8,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  button2: {
    marginTop: 20,
    backgroundColor: "gray",
    width:80,
    height:40,
    borderRadius:100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    alignItems:"center",
    justifyContent:"center"
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: "AlmaraiBold",
    textShadowColor: 'black', // Shadow color
    textShadowOffset: { width: -1, height: 1 }, // Shadow offset
    textShadowRadius: 1, // Shadow radius
  },
  score: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    fontFamily: "AlmaraiBold"
  }
});

export default agricultural;
