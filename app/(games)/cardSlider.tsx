import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ImageBackground ,Image} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import backgrond from '@/assets/images/screens/screen2.jpg';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ColorProperties } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

const { width } = Dimensions.get('window');
const cards = [
    { id: 1, text: ' نقوم بقطع قنينه بواسطه المقص ', sound:require('@/assets/audio/tutoR1.mp3'),step :"المرحلة الولى" , image:require('@/assets/images/icons/tuto1.png'),item:require("@/assets/images/icons/ciseaux.png") },
    { id: 2, text: ' ثم نملا الأصيص بالتراب  ', sound:require('@/assets/audio/tutoR2.mp3'),step :"المرحلة الثانية" , image:require('@/assets/images/icons/tuto2.png'),item:require("@/assets/images/icons/sol.png") },
    { id: 3, text: ' ثم نزرع الورود في الأصيص    ', sound:require('@/assets/audio/tutoR3.mp3'),step :"المرحلة الثالثة" , image:require('@/assets/images/icons/tuto3.png'),item:require("@/assets/images/icons/flower.png") },

  ];
const cardSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(-42);
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const soundRef = useRef(new Audio.Sound());
  useEffect(() => {
    playSound(cards[currentIndex].sound);

    return () => {
      soundRef.current.unloadAsync();
    };
  }, [currentIndex]);

  const playSound = async (soundFile) => {
    try {
      await soundRef.current.unloadAsync();
      await soundRef.current.loadAsync(soundFile);
      await soundRef.current.playAsync();
    } catch (error) {
      console.log('Failed to play the sound', error);
    }
  };
  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      translateX.value = withSpring(-width * (currentIndex + 1.1));
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value + 45 }],
    };
  });

  useEffect(() => {
    const handleChange = ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    };

    const subscription = Dimensions.addEventListener('change', handleChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <View style={[styles.container, { width: dimensions.width, height: dimensions.height }]}>
    <ImageBackground source={backgrond}  style={styles.background} blurRadius={7}>
        <View style={styles.titleContainer}>
            <Text style={styles.title}>مراحل الصنع</Text>
        </View>
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        {cards.map((card) => (
          <View key={card.id} style={styles.card}>
            <View>
                <View>
                    <View style={styles.nbrContainer}>
                        <View style={styles.circleStep}>
                            <Text style={{ fontFamily: "AlmaraiExtraBold", fontSize: 24,color:"white" }}>{card.step}</Text>
                        </View> 
                        <View style={styles.circle}>
                            <Text style={{ fontFamily: "AlmaraiExtraBold", fontSize: 29,color:"white" }}>{card.id}</Text>
                        </View>       
                    </View>
                </View>
                <View style={{justifyContent:"center",alignItems:"center"}}> 
                    <View style={styles.circleItem}>
                        <Image source={card.item} style={{width:50,height:50}}/>
                    </View>  
                </View>   
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Image source={card.image} style={styles.img} />
                </View>
                <Text style={{ fontFamily: "AlmaraiBold", fontSize: 18, marginRight: 5,textAlign:"center",marginVertical:20 }}> {card.text}</Text>
            </View>                       
        </View>
        ))}
      </Animated.View>
      <View style={{alignItems:"center",justifyContent:"center"}}>
        <TouchableOpacity onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>التالي</Text>
            <View style={styles.buttonIcon}>
                <Ionicons name="arrow-forward" color={"white"} size={30}  />
            </View>
        </TouchableOpacity>
      </View>
      </ImageBackground>
    </View>
  )
}

export default cardSlider

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      background: {
        width: "100%",
        height: "100%"
    },
    titleContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        height: 70,
        borderTopColor: "#FFBE0B",
        borderBottomColor: "#FFBE0B",
        borderBottomWidth: 4,
        borderTopWidth: 4,
        marginTop: "10%"
    },
    title: {
        fontFamily: "AlmaraiExtraBold",
        fontSize: 24,
    },
      cardContainer: {
        flexDirection: 'row',
        width: width * cards.length,
        marginTop:width * 0.05,
      },
      card: {
        width:width * 0.95,
        height: "auto",
        backgroundColor: 'white',
        marginHorizontal: 10,
        borderRadius: 16,
        borderWidth:4,
        borderColor:"#FFD700",
        padding:width * 0.03,

      },
      nbrContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    circle: {
        borderColor: "#FFBE0B",
        borderWidth: 3,
        width: 70,
        height: 70,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#06604e",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    circleItem: {
        borderColor: "#FFBE0B",
        margin:20,
        borderWidth: 3,
        width: 90,
        height: 90,
        borderRadius:8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    circleStep: {
        height:70,
        borderColor: "#FFBE0B",
        borderWidth: 3,
        borderRadius: 8,
        marginRight:5,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#06604e",
        paddingHorizontal:width * 0.16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    img: {
        height: 150,
        width: 150,
    },
      cardText: {
        fontSize: 24,
        color: 'white',
      },
      button: {
        marginTop: 20,
        backgroundColor: '#FFD700',
        width:width * 0.95,
        alignItems:"center",
        justifyContent:"space-between",
        borderRadius:8,
        flexDirection:"row",
        height:width*0.15,
      },
      buttonIcon:{
        backgroundColor: '#FFD700',
        height:width*0.15,
        width:width*0.15,
        alignItems:"center",
        justifyContent:"center",
        borderLeftWidth:4,
        borderTopWidth:4,
        borderBottomWidth:4,
        borderColor:"#FFD700",
        borderRadius:8,
      },
      buttonText: {
        color: 'white',
        fontFamily:"AlmaraiBold",
        fontSize:20,
        marginHorizontal:width*0.1,
        marginLeft:width * 0.4,
      },
})