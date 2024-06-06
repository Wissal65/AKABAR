import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ImageBackground, Dimensions } from 'react-native';
import image from '@/assets/images/screens/sick.jpg';
import FlipCard from 'react-native-flip-card';
import { Audio } from 'expo-av';
import { getScore, incrementScore } from '../../hooks/scoreManager';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/reducer/ui/ModalSlice';
import Timer from '@/components/Timer';

const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

const Game1 = () => {
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [score, setScore] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState(Array(4).fill(''));
  const [letters] = useState(['و', 'ب', 'ح', 'ي', 'س', 'ب', 'ط', 'ش', 'ح', 'و']);
  const correctAnswer = ['ط', 'ب', 'ي', 'ب'];

  const [clickSound, setClickSound] = useState();
  const [victorySound, setVictorySound] = useState();
  const [loseSound, setLoseSound] = useState();

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
    }
  };

  const handleCheckAnswer = () => {
    if (JSON.stringify(selectedLetters) === JSON.stringify(correctAnswer)) {
      toggleFlip();
      playVictorySound();
      handleIncrement();
      stopTimer();
      setTimeout(() => {
        navigation.navigate('recycling');
      }, 4000);
    } else {
      Alert.alert('Try Again', 'The answer is incorrect.');
      playLoseSound();
    }
  };

  const handleReset = () => {
    setSelectedLetters(Array(4).fill(''));
  };

  const handleOpenModal = (text) => {
    dispatch(openModal({ componentName: 'YourComponentName', modalText: text }));
  };

  const navigateToNextScreen = () => {
    navigation.navigate('recycling'); // Replace 'NextScreenName' with the name of your next screen
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
    <ImageBackground source={image} resizeMode="cover" style={[styles.container, { width: dimensions.width, height: dimensions.height }]}>
      <View style={styles.timer}>
        <Timer ref={timerRef} duration={10} nextScreen={"recycling"} /> 
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
              <Image source={require('../../assets/images/doctorShadow.png')} style={styles.silhouetteImage} />
            </View>
          </View>
          {/* Back Side */}
          <View style={styles.imageContainer}>
            <View style={styles.backgroundImage}>
              <Image source={require('../../assets/images/doctor.png')} style={styles.silhouetteImage} />
            </View>
          </View>
        </FlipCard>
      </View>
      <View style={styles.hintTextContainer}>
        <Text style={styles.hintText}>أقوم بوضع البرامج البيئية وأقترح حلولا للقضايا البيئية فمن اكون</Text>
      </View>
      <View style={styles.answerContainer}>
        {selectedLetters.map((letter, index) => (
          <View key={index} style={styles.answerBox}>
            <Text style={styles.answerLetter}>{letter}</Text>
          </View>
        )).reverse()}
      </View>
      <View style={styles.lettersContainer}>
        {letters.map((letter, index) => (
          <TouchableOpacity key={index} style={styles.letterBox} onPress={() => handleLetterPress(letter)}>
            <Text style={styles.letter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button2} onPress={handleReset}>
          <Text style={styles.buttonText}>إعادة ضبط</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCheckAnswer}>
          <Text style={styles.buttonText}>تحقق</Text>
        </TouchableOpacity>
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
    width: 180,
    height: 240,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#FFBE0B"
  },
  timer:{
    width:"100%",
    alignItems:"flex-end",
    marginTop:"4%",
    paddingRight:"4%",
  },
  card: {
    height: 285,
    marginTop:41,
  },
  silhouetteImage: {
    width: 150,
    height: 200,
  },
  hintTextContainer: {
    height: 80,
    backgroundColor: "#fff",
    width: "120%",
    borderWidth: 6,
    borderColor: "#FFBE0B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  hintText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: "AlmaraiBold"
  },
  answerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  answerBox: {
    width: 80,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#FFBE0B",
    backgroundColor: '#fff',
  },
  answerLetter: {
    fontSize: 24,
    fontFamily: "AlmaraiBold"
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
    borderColor: "#3A86FF",
    backgroundColor: '#fff',
  },
  letter: {
    fontSize: 24,
    fontFamily: "AlmaraiBold"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    padding: 10,
    backgroundColor: "#FF5555",
    borderRadius: 8,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
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

export default Game1;
