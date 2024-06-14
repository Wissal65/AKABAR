import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { useNavigation } from 'expo-router';
import { useDispatch } from 'react-redux';
import { openAssistan } from '@/store/reducer/ui/AssistantSlice';
import Assistant from '@/components/Assistant';

const Intro = () => {
  const navigation = useNavigation();
  const [currentStage, setCurrentStage] = useState(0);
  const [sound, setSound] = useState(null);
  const dispatch = useDispatch();

  const imageScale = useSharedValue(1); // Initialize scale value

  // Function to animate image scale
  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: imageScale.value }],
    };
  });

  // Function to handle stage changes
  const handleStageChange = (nextStage) => {
    imageScale.value = withTiming(1.2, { duration: 20000 }); // Zoom in effect
    setTimeout(() => {
      setCurrentStage(nextStage);
    }, 500); // Change stage after 500ms
  };

  async function playSound(uri) {
    const { sound } = await Audio.Sound.createAsync(uri, { shouldPlay: true });
    setSound(sound);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish && currentStage === 1) {
        handleStageChange(2);
      } else if (status.didJustFinish && currentStage === 2) {
        handleOpenModal();
      }
    });
  }

  const handleOpenModal = () => {
    dispatch(
      openAssistan({
        modalText: 'هل انت مستعد',
        audio: require('@/assets/audio/collecte4.mp3'),
      })
    );
  };

  useEffect(() => {
    const hideTabBar = () =>
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () =>
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    // Hide tab bar when entering the screen
    hideTabBar();

    return () => showTabBar();
  }, [navigation]);

  useEffect(() => {
    let timer;

    if (currentStage === 0) {
      playSound(require('@/assets/audio/farmerCollect.mp3'));
      timer = setTimeout(() => {
        handleStageChange(1);
      }, 8000);
    } else if (currentStage === 1) {
      playSound(require('@/assets/audio/collecte2.mp3'));
      timer = setTimeout(() => {
        handleStageChange(2);
      }, 24000);
    } else if (currentStage === 2) {
      playSound(require('@/assets/audio/collecte3.mp3'));
      timer = setTimeout(() => {
        handleOpenModal();
      }, 29000);
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

  const navigateTo = () => {
    navigation.navigate('game1_1');
  };

  return (
    <View style={styles.container}>
      {currentStage === 0 && (
        <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
          <Image
            source={require('@/assets/images/screens/farmerCollect.png')}
            style={styles.image}
          />
        </Animated.View>
      )}
      {currentStage === 1 && (
        <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
          <Image
            source={require('@/assets/images/screens/collecte2.png')}
            style={styles.image}
          />
        </Animated.View>
      )}
      {currentStage === 2 && (
        <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
          <Image
            source={require('@/assets/images/screens/collecte3.png')}
            style={styles.image}
          />
        </Animated.View>
      )}
      <Assistant onClose={navigateTo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Intro;
