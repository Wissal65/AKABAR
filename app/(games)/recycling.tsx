import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ImageBackground, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import CountdownTimer from '../../components/CountdownTimer';
import backgrond from '../../assets/images/screens/screen2.jpg';
import { useNavigation } from 'expo-router';
import { Audio } from 'expo-av';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/reducer/ui/ModalSlice';
import { getScore, incrementScore } from '../../hooks/scoreManager';

const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

const recycling = () => {
  const [clickSound, setClickSound] = useState();
  const [victorySound, setVictorySound] = useState();
  const [loseSound, setLoseSound] = useState();
  const [score, setScore] = useState(0);
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const [selectedItems, setSelectedItems] = useState([]);
  
  const timerRef = useRef(null);
  const stopTimerRef = useRef(null);

  const items = [
    { id: 'scissors', label: 'Scissors', icon: require('../../assets/images/icons/ciseaux.png') },
    { id: 'soil', label: 'Soil', icon: require('../../assets/images/icons/sol.png') },
    { id: 'flower', label: 'Flower', icon: require('../../assets/images/icons/flower.png') },
    { id: 'tape', label: 'Tape', icon: require('../../assets/images/icons/scotch.png') },
    { id: 'bottle', label: 'Bottle', icon: require('../../assets/images/icons/bottle.png') },
    { id: 'water', label: 'Watering Can', icon: require('../../assets/images/icons/arrose-les-plantes.png') },
  ];

  const correctItems = ['scissors', 'soil', 'flower', 'bottle'];

  const dispatch = useDispatch();
  const navigation = useNavigation();

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

  useEffect(() => {
    const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });

    hideTabBar();

    return () => showTabBar();
  }, [navigation]);

  const handleIncrement = async () => {
    const newScore = await incrementScore(10);
    setScore(newScore);
  };

  const selectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
    playClickSound();
  };

  const checkSelection = () => {
    if (selectedItems.length === 4) {
      if (selectedItems.every(item => correctItems.includes(item))) {
        Alert.alert('Success!', 'You have successfully created the flower vase.');
        playVictorySound();
        handleIncrement();
      } else {
        Alert.alert('Try Again', 'You selected incorrect items.');
        playLoseSound();
      }
    } else {
      Alert.alert('Incomplete', 'Please select three items.');
      playLoseSound();
    }
  };

  const handleOpenModal = (text) => {
    dispatch(openModal({ componentName: 'YourComponentName', modalText: text }));
  };

  const navigateToNextScreen = () => {
    navigation.navigate('calculeFacture');
  };

  return (
    <ImageBackground 
      source={backgrond} 
      style={[styles.background, { width: dimensions.width, height: dimensions.height }]}
    >
      <View style={styles.overlay}>
      <CountdownTimer
        totalDuration={10}
        onEnd={() => handleOpenModal('Welcome to the facturation game')}
        navigateTo={navigateToNextScreen}
        stopTimerRef={stopTimerRef}
      /> 
        <View style={styles.overlay1}>
          <Text style={styles.question}>ماذا يمكننا ان نصنع من هذه القنينة ؟</Text>
        </View>
        <Image 
          source={require('../../assets/images/icons/bottle.png')} 
          style={styles.bottle}
        />
        <View style={styles.options}>
          {items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.option,
                selectedItems.includes(item.id) && styles.selectedItem
              ]}
              onPress={() => selectItem(item.id)}
            >
              <Image source={item.icon} style={styles.icon} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={checkSelection}>
          <Text style={styles.buttonText}>Vérifier</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    borderColor: '#3A86FF',
    borderWidth: 5,
  },
  icon: {
    width: 50,
    height: 50,
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50
  },
  overlay1: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#FFBE0B",
    borderTopWidth: 7,
    borderBottomWidth: 7,
    marginBottom: 50,
  },
  question: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
    margin: 35,
    fontFamily: "AlmaraiBold"
  },
  bottle: {
    width: 100,
    height: 180,
    marginBottom: 10,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  option: {
    margin: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: "#FFBE0B"
  },
  icon: {
    width: 50,
    height: 50,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default recycling;
