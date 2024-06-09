import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, TouchableWithoutFeedback, Text, Alert, Dimensions, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';

type CircleZone = {
  cx: number;
  cy: number;
  radius: number;
  color: string;
};

type ImageWithZones = {
  image: any;
  zones: CircleZone[];
};


const imagesWithZones: ImageWithZones[] = [
  {
    image: require('@/assets/images/prob1.png'),
    zones: [
      { cx: 0.79, cy: 0.32, radius: 0.14, color: 'rgba(0, 255, 0, 0)' },
      { cx: 0.8, cy: 0.49, radius: 0.13, color: 'rgba(255, 255, 0, 0)' },
    ],
  },
  
  {
    image: require('@/assets/images/prob2.png'),
    zones: [
        { cx: 0.2, cy: 0.56, radius: 0.12, color: 'rgba(0, 255, 0, 0)' },
        { cx: 0.12, cy: 0.46, radius: 0.06, color: 'rgba(255, 255, 0, 0)' },
        { cx: 0.85, cy: 0.415, radius: 0.06, color: 'rgba(255, 255, 0, 0)' },
    ],
  },
  
  {
    image: require('@/assets/images/prob3.png'),
    zones: [
        { cx: 0.32, cy: 0.64, radius: 0.14, color: 'rgba(0, 255, 0, 0)' },
        { cx: 0.48, cy: 0.32, radius: 0.14, color: 'rgba(255, 255, 0, 0)' },

    ],
  },
  {
    image: require('@/assets/images/prob4.png'),
    zones: [
        { cx: 0.32, cy: 0.54, radius: 0.148, color: 'rgba(0, 255, 0, 0)' },

    ],
  },
  {
    image: require('@/assets/images/prob5.png'),
    zones: [
        { cx: 0.32, cy: 0.54, radius: 0.148, color: 'rgba(0, 255, 0, 0)' },

    ],
  },
  // Add other images with zones here...
];


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const App = () => {
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const [disableClick, setDisableClick] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [clickSound, setClickSound] = useState<Audio.Sound | null>(null);
  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [detectedZones, setDetectedZones] = useState<boolean[]>(new Array(imagesWithZones[0].zones.length).fill(false));
  
  useEffect(() => {
    // Load sounds
    const loadSounds = async () => {
        const { sound: click } = await Audio.Sound.createAsync(require('@/assets/audio/tap.mp3'));
      const { sound: correct } = await Audio.Sound.createAsync(require('@/assets/audio/right.mp3'));
      setClickSound(click);
      setCorrectSound(correct);
    };

    loadSounds();

    return () => {
      // Unload sounds
      if (clickSound) {
        clickSound.unloadAsync();
      }
      if (correctSound) {
        correctSound.unloadAsync();
      }
    };
  }, []);

//   useEffect(() => {
//     const loadScore = async () => {
//       try {
//         const savedScore = await AsyncStorage.getItem('score');
//         if (savedScore !== null) {
//           setScore(parseInt(savedScore, 10));
//         }
//       } catch (error) {
//         console.error('Failed to load score from AsyncStorage', error);
//       }
//     };

//     loadScore();
//   }, []);

  useEffect(() => {
    const saveScore = async () => {
      try {
        await AsyncStorage.setItem('score', score.toString());
      } catch (error) {
        console.error('Failed to save score to AsyncStorage', error);
      }
    };

    saveScore();
  }, [score]);

  const handleGeneralClick = () => {
    if (clickSound) {
      clickSound.replayAsync();
    }
  };

  const handleZonePress = (zoneIndex: number) => {
    if (gameOver || disableClick || selectedZones.includes(zoneIndex)) return;

    if (clickSound) {
      clickSound.replayAsync();
    }

    setSelectedZones((prevSelectedZones) => [...prevSelectedZones, zoneIndex]);
    setScore((prevScore) => prevScore + 1);

    const currentZones = imagesWithZones[currentImageIndex].zones;

    setDetectedZones((prevDetectedZones) => {
      const updatedDetectedZones = [...prevDetectedZones];
      updatedDetectedZones[zoneIndex] = true;
      return updatedDetectedZones;
    });

    if (selectedZones.length + 1 === currentZones.length) {
      if (correctSound) {
        correctSound.replayAsync();
      }

      if (currentImageIndex < imagesWithZones.length - 1) {
        setDisableClick(true);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => prevIndex + 1);
          setSelectedZones([]);
          setDisableClick(false);
          setDetectedZones(new Array(imagesWithZones[currentImageIndex + 1].zones.length).fill(false));
        }, 150);
      } else {
        setGameOver(true);
        setDisableClick(true);
        Alert.alert('Game Over', 'Congratulations! You completed all the images.');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver && timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
      }
      if (timeLeft === 0 && !gameOver) {
        setGameOver(true);
        setDisableClick(true);
        Alert.alert('Game Over', 'Time is up.');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, gameOver]);

  const currentImageWithZones = imagesWithZones[currentImageIndex];

  return (
    <TouchableWithoutFeedback onPress={handleGeneralClick}>
      <View style={styles.container}>
        <ImageBackground
          source={currentImageWithZones.image}
          style={[styles.backgroundImage, { width: windowWidth, height: windowHeight, aspectRatio: window.devicePixelRatio}]}
          resizeMode="cover"// Change to "contain" to maintain aspect ratio
        >
          {currentImageWithZones.zones.map((zone, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => handleZonePress(index)}>
              <View
                style={[
                  styles.zone,
                  {
                    position: 'absolute',
                    top: zone.cy * windowHeight - zone.radius * windowWidth,
                    left: zone.cx * windowWidth - zone.radius * windowWidth,
                    width: zone.radius * 2 * windowWidth,
                    height: zone.radius * 2 * windowWidth,
                    borderRadius: zone.radius * windowWidth,
                    borderWidth: selectedZones.includes(index) ? 2 : 0,
                    borderColor: selectedZones.includes(index) ? 'red' : 'transparent',
                    backgroundColor: selectedZones.includes(index) ? zone.color : 'transparent',
                  },
                ]}
              />
            </TouchableWithoutFeedback>
          ))}
          
          <View style={styles.detectedZonesContainer}>
            {currentImageWithZones.zones.map((zone, index) => (
              <Icon
                key={index}
                name="search"
                size={windowWidth*0.05}
                color="green"
                style={{ opacity: selectedZones.includes(index) ? 1 : 0.7, marginHorizontal: 5 }}
              />
            ))}
          </View>
          {/* <Text style={styles.scoreText}>Score: {score}</Text> */}
          <Text style={styles.timeText}>Time Left: {timeLeft}</Text>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zone: {
  },
  detectedZonesContainer: {
    position: 'absolute',
    top:  30,
    left: 10,
    flexDirection: 'row',
    backgroundColor: 'black',
    opacity: 0.55,
    padding: 6,
    borderRadius: 31,
    gap: 3
  },
  detectedZone: {
    backgroundColor: 'green',
    marginHorizontal: 5,

  },
  scoreText: {
    // position: 'absolute',
    // top: 30,
    // left: 10,
    // color: 'white',
    // fontSize: 20,
  },
  timeText: {
    position: 'absolute',
    top: 30,
    right: 10,
    color: 'white',
    fontSize: 20,
  },
});

export default App;