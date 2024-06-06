import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text,TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

const intro = ({ navigation }) => {
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
    let timer;
    if (currentStage === 0) {
      playSound(require('@/assets/audio/tutoR1.mp3'));
      timer = setTimeout(() => {
        setCurrentStage(1);
      }, 5000);
    } else if (currentStage === 1) {
      playSound(require('@/assets/audio/tutoR2.mp3'));
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
          source={require('@/assets/images/screens/intro1.jpg')}
          style={styles.image}
        />
      )}
      {currentStage === 1 && (
        <><Image
          source={require('@/assets/images/screens/intro2.jpg')}
          style={styles.image}
        />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TutorialScreen')}>
                <Text style={styles.buttonText}>متابعه</Text>
            </TouchableOpacity>
          </View>
        </>
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

export default intro;
