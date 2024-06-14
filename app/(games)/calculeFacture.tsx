// MainCalculationScreen.js
import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Image, TouchableWithoutFeedback, StyleSheet, Animated, Text, TextInput, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import backgrond from '@/assets/images/screens/caclcule.jpg';
import { useDispatch } from 'react-redux';
import { openModal } from '../../store/reducer/ui/ModalSlice';
import { useNavigation } from 'expo-router';
import { Audio } from 'expo-av';
import CountdownTimer from '@/components/CountdownTimer';
import { LevelContext } from '@/hooks/ContextLevel';

const calculeFacture = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateXValue = useRef(new Animated.Value(0)).current;  const [volume, setVolume] = useState('');
  const [nbr, setNbr] = useState('');
  const [result, setResult] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const window = Dimensions.get('window');
  const { width, height } = window;
  const [victorySound, setVictorySound] = useState();
  const [loseSound, setLoseSound] = useState();
  const { unlockLevel } = useContext(LevelContext);
  const levelId = 3; // Replace with the appropriate level ID for this game
  const completeLevel = () => {
    const nextLevel = levelId + 1;
    unlockLevel(nextLevel);
    navigation.navigate('home'); // Navigate back to home or any other screen
  };
  useEffect(() => {
    const loadSounds = async () => {
      const victory = await Audio.Sound.createAsync(
        require('../../assets/audio/win.mp3')
      );
      const lose = await Audio.Sound.createAsync(
        require('../../assets/audio/lose.mp3')
      );
      setVictorySound(victory.sound);
      setLoseSound(lose.sound);
    };

    loadSounds();

    return () => {
      if (victorySound) {
        victorySound.unloadAsync();
      }
      if (loseSound) {
        loseSound.unloadAsync();
      }
    };
  }, []);
  const playVictorySound = async () => {
    if (victorySound) {
      await victorySound.replayAsync();
    }
  };

  const playLoseSound = async () => {
    if (loseSound) {
      await loseSound.replayAsync();
    }
  };
  const toggleZoom = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: isZoomed ? 1 : 2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateXValue, {
        toValue: isZoomed ? 0 : -100, // Adjust -100 based on how far right you want to zoom
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsZoomed(!isZoomed);
    });
  };

  const handleOpenModal = (text) => {
    dispatch(openModal({ componentName: 'YourComponentName', modalText: text }));
  };

  const calculeResult = () => {
    if (volume && nbr) {
      const num1 = parseFloat(volume);
      const num2 = parseFloat(nbr);

      if (!isNaN(num1) && !isNaN(num2) && num2 !== 0) {
        const calculation = (num1 / (num2 * 10)) / num2;
        setResult(calculation.toFixed(2)); // Limiting to 2 decimal places
        console.log(calculation); // Log the immediate 
        if(calculation.toFixed(2) == 1.59){
          playVictorySound();
          //handleOpenModal('نتوصل الى ان عائله سلوى عائله مقتصده للكهرباء لان استهلاك الفرد فيها يقل عن المعدل الوطني لاستهلاك الكهرباء لان 1.59 اصغر من 2.81 ');
          completeLevel();
        }else{
          playLoseSound();
          handleOpenModal('لقد ارتكبت خطأ، يرجى المحاولة مرة أخرى');
        }
      } else {
        setResult('Invalid input');
      }
    } else {
      console.log('error');
      handleOpenModal('لم تملأ جميع الخانات');
    }
  };

  const navigateToNextScreen = () => {
    navigation.navigate('');
  };

  useEffect(() => {
    const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    startTimer();
    hideTabBar();

    return () => showTabBar();
  }, [navigation]);
  const timerRef = useRef();

  const startTimer = () => {
    if (timerRef.current) {
      timerRef.current.startTimer();
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      timerRef.current.stopTimer();
    }
  };
  return (
    <ImageBackground 
      source={backgrond} 
      style={[styles.background, { width, height }]}
      blurRadius={7}
    >
      <View style={styles.timer}>
      <CountdownTimer ref={timerRef} duration={30} nextScreen={"recycling"}  />
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={{fontFamily:"AlmaraiLight"}}>انقر على الصورة للتكبير</Text>
        <View style={styles.imageContainer}>
          <TouchableWithoutFeedback onPress={toggleZoom}>
            <Animated.Image
              source={require('@/assets/images/energie.png')}
              style={[styles.image, {
                transform: [
                  { scale: scaleValue },
                  { translateX: translateXValue }
                ]
              }]}
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
        </View>
        <Text style={styles.description}>
          توصلت عائلة سلوي بفاتورة الكهرباء، تبين بأن الاستهلاك الشهري للعائلة المكونة من ثلاثة أفراد هو 143 كيلو / واط ساعة
        </Text>
      </View>
     {volume !== '' && nbr !== '' && (
       <View style={styles.calculation}>
        <Text style={{ fontSize: 40 }}>({volume ? volume : ' ... '}÷{nbr ? nbr * 10 : ' ... '}) ÷ {nbr ? nbr : ' ... '}</Text>
      </View>
     )}
      <View style={[styles.inputContainer, { width: width * 0.8 }]}>
        <TextInput
          style={styles.input}
          placeholder="عدد أفراد الأسرة"
          placeholderTextColor="#BEBEBE"
          keyboardType="numeric"
          onChangeText={(value) => setNbr(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="الحجم"
          placeholderTextColor="#BEBEBE"
          keyboardType="numeric"
          onChangeText={(value) => setVolume(value)}
        />
      </View>
      
      <View style={{ marginHorizontal: 10 }}>
        <TouchableOpacity style={styles.button} onPress={calculeResult}>
          <Text style={styles.buttonText}>حساب</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('TutorialScreen')}>
          <Text style={styles.buttonText1}>عرض الخطوات</Text>
        </TouchableOpacity>
      </View>
      {result !== '' && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Result: {result}</Text>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    paddingTop: '5%',
  },
  timer:{
    width:"100%",
    alignItems:"flex-end",
    marginTop:"4%",
    paddingRight:"4%",
  },
  imageContainer: {
    zIndex: 2,
    width: 'auto',
    height: 280,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 350,
    height: 400,
  },
  imageZoomed: {
    width: 600,
    height: 500,
    marginBottom: 20,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    width: '100%',
    marginVertical: '2%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: '#FFBE0B',
  },
  description: {
    zIndex: 1,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderRadius: 5,
    width: '48%',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#fff',
    fontFamily: 'AlmaraiBold',
    color: 'red',
    borderColor: '#FFBE0B',
    borderWidth: 3,
    marginHorizontal:5,
  },
  calculation: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: '2%',
    borderRadius: 8,
    borderColor: '#FFBE0B',
    borderWidth: 3,
    marginBottom:5,
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 8,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    textShadowColor: 'black', // Shadow color
    textShadowOffset: { width: -1, height: 1 }, // Shadow offset
    textShadowRadius: 1, // Shadow radius
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
  },
  button1: {
    backgroundColor: '#06604e',
    padding: 10,
    borderRadius: 8,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText1: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    color:"white"
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontFamily: 'AlmaraiBold',
    color: '#000',
  },
});

export default calculeFacture;
