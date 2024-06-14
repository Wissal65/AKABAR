// components/Assistant.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { closeAssistant } from '@/store/reducer/ui/AssistantSlice';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';

const Assistant = ({ onClose }) => {
  const dispatch = useDispatch();
  const { isOpen, modalText, audio } = useSelector((state) => state.assistant);

  useEffect(() => {
    let sound;
    const playSound = async () => {
      if (isOpen && audio) {
        sound = new Audio.Sound();
        try {
          await sound.loadAsync(audio);
          await sound.playAsync();
        } catch (error) {
          console.log('Failed to play the sound', error);
        }
      }
    };

    playSound();

    // Cleanup function to release the sound object when the modal is closed
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [isOpen, audio]);

  const handleClose = () => {
    dispatch(closeAssistant());
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <LottieView 
          source={require('../assets/animation/avatar.json')} 
          autoPlay 
          loop 
          style={styles.avatar} 
        />
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalText}</Text>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>حسنا</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 200,
    height: 550,
    marginBottom: '-30%',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: "AlmaraiRegular",
    lineHeight:30,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
    fontFamily: "AlmaraiExtraBold"
  },
});

export default Assistant;
