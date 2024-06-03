import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ImageBackground, Modal, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation } from 'expo-router';

const { width, height } = Dimensions.get('window');
const icons = [
  { name: 'apple', description: 'This is the Apple logo' },
  { name: 'android', description: 'This is the Android logo' },
  { name: 'windows', description: 'This is the Windows logo' },
  { name: 'github', description: 'This is the GitHub logo' },
  { name: 'facebook', description: 'This is the Facebook logo' },
  { name: 'twitter', description: 'This is the Twitter logo' },
];
const initialCards = [...icons, ...icons].sort(() => 0.5 - Math.random());

const backgroundImg = require('../../assets/images/back1.jpg');

const FlipCardGame = () => {
  const [cards, setCards] = useState(initialCards);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [matchedIcon, setMatchedIcon] = useState({ name: '', description: '' });
  const animatedValues = useRef(cards.map(() => new Animated.Value(0))).current;
  const [timeLeft, setTimeLeft] = useState(60); 
  const navigation = useNavigation();

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].name === cards[secondIndex].name) {
        setMatchedIndices([...matchedIndices, firstIndex, secondIndex]);
        setMatchedIcon(cards[firstIndex]);
        setModalVisible(true);
      }
      setTimeout(() => {
        setFlippedIndices([]);
        if (cards[firstIndex].name !== cards[secondIndex].name) {
          Animated.spring(animatedValues[firstIndex], {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          Animated.spring(animatedValues[secondIndex], {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }, 1000);
    }
  }, [flippedIndices]);

  const handleCardPress = (index: number) => {
    if (flippedIndices.length < 2 && !flippedIndices.includes(index) && !matchedIndices.includes(index)) {
      flipCard(index);
      setFlippedIndices([...flippedIndices, index]);
    }
  };

  const flipCard = (index: number) => {
    const currentAnimatedValue = animatedValues[index];
    const isFlipped = flippedIndices.includes(index) || matchedIndices.includes(index);

    Animated.spring(currentAnimatedValue, {
      toValue: isFlipped ? 0 : 180,
      useNativeDriver: true,
    }).start();
  };

  const renderCard = (icon: { name: string; description: string }, index: number) => {
    const animatedStyleFront = {
      transform: [
        {
          rotateY: animatedValues[index].interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
          }),
        },
      ],
      backfaceVisibility: 'hidden' as 'hidden'
    };

    const animatedStyleBack = {
      transform: [
        {
          rotateY: animatedValues[index].interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg'],
          }),
        },
      ],
      backfaceVisibility: 'hidden' as 'hidden',
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
    useEffect(() => {
        const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
        const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    
        hideTabBar();
    
        return () => showTabBar();
      }, [navigation]);
    return (
      <TouchableOpacity key={index} style={styles.card} onPress={() => handleCardPress(index)}>
        <Animated.View style={[styles.cardFace, animatedStyleFront]}>
          <Icon name="question" size={50} color="black" />
        </Animated.View>
        <Animated.View style={[styles.cardFace, styles.cardBack, animatedStyleBack]}>
          <Icon name={icon.name} size={50} color="black" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (matchedIndices.length === cards.length) {
      Alert.alert('Congratulations!', 'You found all pairs!');
    }
  }, [matchedIndices]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      Alert.alert('Time\'s up!', 'You ran out of time!');
    }
  }, [timeLeft]);

  return (
    <ImageBackground source={backgroundImg} style={styles.container}>
      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
          size={100}
          width={10}
          fill={(timeLeft / 60) * 100}
          tintColor="#FFBE0B"
          backgroundColor="#3d5875"
        >
          {() => <Text>{timeLeft}s</Text>}
        </AnimatedCircularProgress>
      </View>
      <View style={styles.cardContainer}>
        {cards.map((icon, index) => renderCard(icon, index))}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>You found a pair!</Text>
            <Icon name={matchedIcon.name} size={50} color="black" />
            <Text style={styles.descriptionText}>{matchedIcon.description}</Text>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.1,
  },
  progressContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  card: {
    width: 80,
    height: 80,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFace: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  descriptionText: {
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default FlipCardGame;
