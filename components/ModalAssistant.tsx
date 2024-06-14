// components/ModalComponent.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../store/reducer/ui/ModalSlice';
import LottieView from 'lottie-react-native';
import { useNavigation } from 'expo-router';
const ModalComponent = () => {
  const dispatch = useDispatch();
  const { isOpen, modalText, navigateTo } = useSelector((state) => state.modal);
 const navigate = useNavigation();
  const handelNavigate=()=>{
    navigate.navigate(navigateTo);
  }
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
          <TouchableOpacity style={styles.button} onPress={() => {dispatch(closeModal()); handelNavigate()}}>
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
    fontFamily:"AlmaraiRegular"
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
    textShadowColor: 'black', // Shadow color
    textShadowOffset: { width: -1, height: 1 }, // Shadow offset
    textShadowRadius: 1, // Shadow radius
    fontFamily:"AlmaraiExtraBold"
  },
});

export default ModalComponent;
