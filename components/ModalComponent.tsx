// components/ModalComponent.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../store/reducer/ui/ModalSlice';
import LottieView from 'lottie-react-native';

const ModalComponent = () => {
  const dispatch = useDispatch();
  const { isOpen, modalText } = useSelector((state) => state.modal);

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="slide"
      onRequestClose={() => dispatch(closeModal())}
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
          <TouchableOpacity style={styles.button} onPress={() => dispatch(closeModal())}>
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
    width: 300,
    height: 500,
    marginBottom: '-30%',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ModalComponent;
