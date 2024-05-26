import React, { useEffect,useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert,ImageBackground } from 'react-native';
import image from "../../assets/images/screens/sick.jpg";
import FlipCard from 'react-native-flip-card'
const game1 =()=> {
  const [isFlipped, setIsFlipped] = useState(false);
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  const navigation = useNavigation();
  useEffect(() => {
      const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
      const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });
  
      // Hide tab bar when entering the screen
      hideTabBar();
  
      // Show tab bar when leaving the screen
      return () => showTabBar();
    }, [navigation]);
    
    const [selectedLetters, setSelectedLetters] = useState(Array(4).fill(''));
    const [letters] = useState(['و', 'ب', 'ح', 'ي', 'س', 'ب', 'ط', 'ش', 'ح', 'و']);

    const correctAnswer = ['ط', 'ب', 'ي', 'ب'];

    const handleLetterPress = (letter) => {
        const newSelectedLetters = [...selectedLetters];
        const firstEmptyIndex = newSelectedLetters.findIndex(item => item === '');
        if (firstEmptyIndex !== -1) {
          newSelectedLetters[firstEmptyIndex] = letter;
          setSelectedLetters(newSelectedLetters);
        }
      };
    
      const handleCheckAnswer = () => {
        if (JSON.stringify(selectedLetters) === JSON.stringify(correctAnswer)) {
          toggleFlip();
      } else {
          Alert.alert('Try Again', 'The answer is incorrect.');
        }
      };
    
      const handleReset = () => {
        setSelectedLetters(Array(4).fill(''));
      };
    

    return (
      <ImageBackground source={image} resizeMode="cover"  style={styles.container}>
        <View style={styles.card}>
          <FlipCard 
            friction={6}
            perspective={500}
            flipHorizontal={true}
            flipVertical={false}
            flip={isFlipped}
            clickable={false}
            >
            {/* Face Side */}
            <View style={styles.imageContainer}>
              <View style={styles.backgroundImage}>
                  <Image source={require('../../assets/images/doctorShadow.png')} style={styles.silhouetteImage} /> 
              </View>
            </View>
            {/* Back Side */}
            <View style={styles.imageContainer}>
              <View style={styles.backgroundImage}>
                  <Image source={require('../../assets/images/doctor.png')} style={styles.silhouetteImage} /> 
              </View>
            </View>
          </FlipCard>  
      </View>
      <View style={styles.hintTextContainer}>
        <Text style={styles.hintText}>أقوم بتشخيص نوع حساسية المريض فمن أكون:</Text>
      </View>
      <View style={styles.answerContainer}>
        {selectedLetters.map((letter, index) => (
          <View key={index} style={styles.answerBox}>
            <Text style={styles.answerLetter}>{letter}</Text>
          </View>
        )).reverse()}
      </View>
      <View style={styles.lettersContainer}>
        {letters.map((letter, index) => (
          <TouchableOpacity key={index} style={styles.letterBox} onPress={() => handleLetterPress(letter)}>
            <Text style={styles.letter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button2} onPress={handleReset}>
          <Text style={styles.buttonText}>إعادة ضبط</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCheckAnswer}>
          <Text style={styles.buttonText}>تحقق</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: 10,
    },
    imageContainer: {
      position: 'relative',
    },
    backgroundImage: {
      width: 180,
      height: 240,
      backgroundColor:"#fff",
      alignItems:"center",
      justifyContent:"center",
      borderRadius:16,
      borderWidth:4,
      borderColor:"#FFBE0B"
    },
    card:{
      marginTop:100,
      height:285,
    },
    silhouetteImage: {
      width: 150,
      height: 200,
    },
    hintTextContainer:{
      height:80,
      backgroundColor:"#fff",
      width:"120%",
      borderWidth:6,
      borderColor:"#FFBE0B",
      justifyContent:"center",
      alignItems:"center",
      marginBottom:10,
    },
    hintText: {
      fontSize: 18,
      textAlign: 'center',
      fontFamily:"AlmaraiBold"
    },
    answerContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    answerBox: {
      width: 80,
      height: 53,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
      borderRadius:8,
      borderWidth:3,
      borderColor:"#FFBE0B",
      backgroundColor: '#fff',
    },
    answerLetter: {
      fontSize: 24,
      fontFamily:"AlmaraiBold"

    },
    lettersContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    letterBox: {
      width: 53,
      height: 53,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
      borderRadius:8,
      borderWidth:3,
      borderColor:"#3A86FF",
      backgroundColor: '#fff',
    },
    letter: {
      fontSize: 24,
      fontFamily:"AlmaraiBold"

    },
    buttonsContainer:{
      flexDirection:"row",
      justifyContent:"space-between",
      width:"90%"
    },
    button: {
      marginTop: 20,
      padding: 10,
      backgroundColor: "#FFBE0B",
      borderRadius: 50,
      paddingHorizontal:25,
    },
    button2: {
      marginTop: 20,
      padding: 10,
      backgroundColor: "#FF5555",
      borderRadius: 50,
      paddingHorizontal:25,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontFamily:"AlmaraiBold"

    },
  });
  
export default game1