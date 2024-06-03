import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions, Text, Modal, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from 'expo-router';

const imageSource = require('../../assets/images/piece.jpg');
const backgroundImage = require('../../assets/images/back2.jpg'); 
const windowWidth = Dimensions.get('window').width;
const puzzleWidth = windowWidth * 0.9; 
const pieceSize = puzzleWidth / 3; 

const playSound = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('../../assets/audio/switching.wav')
  );
  await sound.setRateAsync(2, true); 
  await sound.playAsync();
};
const playSound2 = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('../../assets/audio/click.wav')
  );
  await sound.setRateAsync(2, true); 
  await sound.playAsync();
};

const Explore = () => {
  const [pieces, setPieces] = useState([...Array(9).keys()]);
  const [moves, setMoves] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false); 
  const navigation = useNavigation();

  useEffect(() => {
    shufflePieces();
  }, []);

  const shufflePieces = () => {
    playSound2()
    const shuffledPieces = [...pieces];
    for (let i = shuffledPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPieces[i], shuffledPieces[j]] = [shuffledPieces[j], shuffledPieces[i]];
    }
    setPieces(shuffledPieces);
    setMoves(0);
    setSelectedPiece(null);
    setModalVisible(false); 
  };

  const handlePieceClick = (index: number) => {
    if (selectedPiece === null) {
      setSelectedPiece(index);
    } else {
      switchPieces(selectedPiece, index);
      setSelectedPiece(null);
    }
  };

  const switchPieces = (index1: number, index2: number) => {
    playSound();
    const newPieces = [...pieces];
    [newPieces[index1], newPieces[index2]] = [newPieces[index2], newPieces[index1]];
    setPieces(newPieces);
    setMoves(moves + 1);

    if (checkWin(newPieces)) {
      setModalVisible(true); 
    }
  };

  const checkWin = (newPieces: number[]) => {
    for (let i = 0; i < newPieces.length; i++) {
      if (newPieces[i] !== i) {
        return false;
      }
    }
    return true;
  };

  const getPieceStyle = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return [
      styles.piece,
      {
        top: row * pieceSize,
        left: col * pieceSize,
        backgroundColor: selectedPiece === pieces.indexOf(index) ? 'lightgreen' : 'lightblue',
      },
    ];
  };

  const getImageStyle = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      position: 'absolute' as 'absolute',
      top: -row * pieceSize,
      left: -col * pieceSize,
      width: pieceSize * 3,
      height: pieceSize * 3,
    };
  };
  useEffect(() => {
    const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });

    hideTabBar();

    return () => showTabBar();
  }, [navigation]);

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.puzzleContainer}>
            {pieces.map((index) => (
              <TouchableOpacity
                key={index}
                style={getPieceStyle(pieces.indexOf(index))}
                onPress={() => handlePieceClick(pieces.indexOf(index))}
              >
                <Image source={imageSource} style={getImageStyle(index)} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={shufflePieces} >
          <Text style={styles.buttonText}>Réinitialiser</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Félicitations! Vous avez complété le puzzle!</Text>
              <TouchableOpacity style={styles.button2} onPress={shufflePieces}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#fff', 
  },
  moves: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
    paddingLeft: 190,
    paddingTop: 5,
  },
  puzzleContainer: {
    width: puzzleWidth, 
    height: puzzleWidth, 
    position: 'relative',
  },
  piece: {
    position: 'absolute',
    width: pieceSize,
    height: pieceSize,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 130,
    borderRadius: 5,
    marginTop: 20,
    position: 'absolute',
    bottom: 20, 
  },
  button2: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: 'relative',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Explore;
