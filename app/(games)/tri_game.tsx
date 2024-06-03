import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DraxProvider, DraxView } from 'react-native-drax';
import Modal from 'react-native-modal';
import { Audio } from 'expo-av';
import { useNavigation } from 'expo-router';
import Question from '../../components/Question';

const { width, height } = Dimensions.get('window');

const bins = [
  { id: 'paper', label: 'Paper', image: require('../../assets/images/bin3.png') },
  { id: 'glass', label: 'Glass', image: require('../../assets/images/bin2.png') },
  { id: 'plastic', label: 'Plastic', image: require('../../assets/images/bin1.png') },
];

const initialItems = [
  { id: 'item1', label: 'Newspaper', type: 'paper', image: require('../../assets/images/papers.png'), explanation: 'les journaux sont de type papier' },
  { id: 'item2', label: 'Bottle', type: 'glass', image: require('../../assets/images/glass.png'), explanation: 'La bouteille est de type glass' },
  { id: 'item3', label: 'Plastic Bag', type: 'plastic', image: require('../../assets/images/plastic.png'), explanation: 'Les sacs plastiques est de type plastique' },
];

export default function tri_game() {
  const [items, setItems] = useState(initialItems);
  const [currentItem, setCurrentItem] = useState<{ id: string; label: string; type: string; image: any, explanation: string } | null>(items[0]);
  const [score, setScore] = useState(0);
  const [isItemVisible, setIsItemVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalExplanation, setModalExplanation] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isEndModalVisible, setIsEndModalVisible] = useState(false);

  const navigation = useNavigation();

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/audio/throw_trash.wav')
    );
    await sound.setRateAsync(2, true);
    await sound.playAsync();
  };

  const handleReceiveDrag = (binId: string) => {
    playSound();
    if (!currentItem) return;
    let message = '';
    let correct = false;
    let explanation = '';
    if (currentItem.type === binId) {
      message = `Correct! ${currentItem.label} goes in the ${binId} bin.`;
      correct = true;
      setScore(score + 1);
    } else {
      message = `Wrong! ${currentItem.label} does not go in the ${binId} bin.`;
      correct = false;
      explanation = currentItem.explanation;
    }

    setModalMessage(message);
    setModalExplanation(explanation);
    setIsCorrect(correct);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsItemVisible(false);

    const remainingItems = items.filter(item => item.id !== currentItem?.id);
    if (remainingItems.length === 0) {
      setTimeout(() => {
        setIsEndModalVisible(true);
      }, 500);
    } else {
      const nextItem = remainingItems[0];
      setCurrentItem(nextItem);
      setIsItemVisible(true);
      setItems(remainingItems);
    }
  };

  const handleEndModalClose = () => {
    setIsEndModalVisible(false);
    setItems(initialItems);
    setCurrentItem(initialItems[0]);
    setIsItemVisible(true);
    setScore(0);
  };

  const resetItemPosition = () => {
    setIsItemVisible(false);
    setTimeout(() => {
      setIsItemVisible(true);
    }, 0);
  };

  useEffect(() => {
    const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });

    hideTabBar();

    return () => showTabBar();
  }, [navigation]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/images/back_tri.jpg')}
        style={styles.background}
      >
        <DraxProvider>
          <View style={styles.container}>
            <Question />
            <Text style={styles.score}>Score: {score}</Text>
            <View style={styles.initialPosition}>
              <View style={styles.circle} />
              {isItemVisible && currentItem && (
                <DraxView
                  style={styles.draggable}
                  draggingStyle={styles.dragging}
                  dragPayload={currentItem.type}
                  onDragEnd={resetItemPosition}
                >
                  <Image source={currentItem.image} style={styles.itemImage} />
                </DraxView>
              )}
            </View>
            <View style={styles.binsContainer}>
              {bins.map((bin) => (
                <DraxView
                  key={bin.id}
                  style={styles.bin}
                  receivingStyle={styles.receiving}
                  onReceiveDragDrop={() => handleReceiveDrag(bin.id)}
                >
                  <Image source={bin.image} style={styles.binImage} />
                </DraxView>
              ))}
            </View>
          </View>
          <Modal isVisible={isModalVisible}>
            <View style={styles.modalContent}>
              <Image
                source={isCorrect ? require('../../assets/images/check.jpg') : require('../../assets/images/che.png')}
                style={styles.modalImage}
              />
              <Text style={styles.modalText}>{modalMessage}</Text>
              {!isCorrect && (
                <Text style={styles.modalExplanation}>{modalExplanation}</Text>
              )}
              <TouchableOpacity onPress={handleModalClose} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={isEndModalVisible}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Congratulations! You've completed the game.</Text>
              <TouchableOpacity onPress={handleEndModalClose} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Restart</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </DraxProvider>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    top: '5%',
    right: '70%',
    zIndex: 1,
  },
  initialPosition: {
    position: 'absolute',
    top: '35%',
    alignItems: 'center',
  },
  circle: {
    width: width * 0.35,
    height: width * 0.35,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: width * 0.5,
    borderColor: 'orange',
    borderWidth: 2,
    position: 'absolute',
    zIndex: 1,
  },
  binsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: '3%',
  },
  bin: {
    width: width * 0.4,
    height: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  binImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  receiving: {
    width: width * 0.45,
    height: width * 0.45,
  },
  draggable: {
    width: width * 0.32,
    height: width * 0.32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 2,
    zIndex: 2,
  },
  dragging: {
    opacity: 0,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '8%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.03,
  },
  modalImage: {
    width: width * 0.1,
    height: width * 0.1,
    marginBottom: height * 0.02,
  },
  modalText: {
    fontSize: width * 0.045,
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  modalExplanation: {
    fontSize: width * 0.04,
    color: 'gray',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  modalButton: {
    backgroundColor: 'orange',
    padding: width * 0.03,
    borderRadius: width * 0.02,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
