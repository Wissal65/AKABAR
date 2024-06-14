import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text,TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { router, useNavigation } from 'expo-router';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/reducer/ui/ModalSlice';

const hunterStory = () => {
  const navigation = useNavigation();
  const [currentStage, setCurrentStage] = useState(0);
  const [sound, setSound] = useState(null);

  async function playSound(uri) {
    const { sound } = await Audio.Sound.createAsync(
      uri,
      { shouldPlay: true }
    );
    setSound(sound);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish && currentStage === 1) {
        setCurrentStage(2);
      }
    });
  }
  useEffect(() => { 
    const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    // Hide tab bar when entering the screen
    hideTabBar();
    
    return () => showTabBar();
  }, [navigation]);
  const dispatch = useDispatch();
  const handleOpenModal = () => {
    dispatch(openModal({ componentName: 'YourComponentName', modalText: ' لننتقل إلى المرحلة التالية',navigateTo:'game1'}));
  };

  useEffect(() => {
    let timer;
    if (currentStage === 0) {
      playSound(require('@/assets/audio/tutoR1.mp3'));
      timer = setTimeout(() => {
        setCurrentStage(1);
      }, 5000);
    } else if (currentStage === 1) {
      handleOpenModal();
    }
  
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentStage]);

  return (
    <View style={styles.container}>
      {currentStage === 0 && (
        <Image
          source={require('@/assets/images/screens/hunterScreen.jpg')}
          style={styles.image}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    zIndex:1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  complete: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer:{
    zIndex:2,
    justifyContent:"center",
    alignItems:"center",
    marginBottom:150,
},
secondScreen:{
    width:"100%",
    height:"100%",
    flex:1,
},
button: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 8,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'AlmaraiExtraBold',
  },
});

export default hunterStory;
