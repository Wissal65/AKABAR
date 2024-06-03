// TutorialScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ImageBackground,Dimensions,Animated,Image ,Easing} from 'react-native';
import backgrond from '../../assets/images/screens/screen2.jpg';
import { useNavigation } from 'expo-router';

const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

const TutorialScreen = () => {
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const animatedValues = [useRef(new Animated.Value(-initialWidth)).current, useRef(new Animated.Value(initialWidth)).current, useRef(new Animated.Value(-initialWidth)).current,useRef(new Animated.Value(initialWidth)).current, useRef(new Animated.Value(-initialWidth)).current];
  const navigation = useNavigation();
  useEffect(() => { 
    const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });

    // Hide tab bar when entering the screen
    hideTabBar();

    // Show tab bar when leaving the screen
    return () => showTabBar();
  }, [navigation]);

  useEffect(() => {
    const handleChange = ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    };

    const subscription = Dimensions.addEventListener('change', handleChange);

    return () => {
      subscription?.remove();
    };
  }, []);
  useEffect(() => {
    const animations = animatedValues.map((animatedValue, index) =>
        Animated.timing(animatedValue, {
            toValue: 0,
            duration: 4000,
            delay: index * 1000, // stagger the animations
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        })
    );

    Animated.stagger(300, animations).start();
}, []);

  return (
    <View style={[styles.container, { width: dimensions.width, height: dimensions.height }]}>
    <ImageBackground 
        source={backgrond} 
        style={styles.background}
        blurRadius={7}
    >
        <View style={styles.titleContainer}>
            <Text style={styles.title}>حساب استهلاك الكهرباء لكل فرد من العائلة</Text>
        </View>
        <ScrollView style={styles.scrollViewContent}>
        <View  style={styles.cards}>
            <Animated.View style={[styles.cardContainer, { transform: [{ translateX: animatedValues[0] }] }]}>
               <View style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row"}}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                    </View>
                    <View>
                        <View style={styles.nbrContainer}>
                            <View style={styles.circle}>
                                <Text style={{ fontFamily: "AlmaraiExtraBold", fontSize: 24,color:"white" }}>1</Text>
                            </View>       
                        </View>
                        <View>
                            <Text style={{ fontFamily: "AlmaraiBold", fontSize: 20, marginRight: 5 }}>الخطوة الولى</Text>
                            <Text style={{ fontFamily: "AlmaraiLight", fontSize: 16, marginRight: 5 }}>
                              اعثر على إجمالي استهلاك الكهرباء المذكور في الفاتورة. يتم ذكره عادةً بوحدة كيلوواط ساعة (kWh).
                            </Text>
                        </View>
                    </View>  
               </View>  
            </Animated.View>
            <Animated.View style={[styles.cardContainer, { transform: [{ translateX: animatedValues[1] }] }]}>
               <View style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row"}}>
                    <View>
                        <View style={styles.nbrContainer}>
                            <View style={styles.circle}>
                                <Text style={{ fontFamily: "AlmaraiExtraBold", fontSize: 24,color:"white" }}>2</Text>
                            </View>       
                        </View>
                        <View>
                            <Text style={{ fontFamily: "AlmaraiBold", fontSize: 20, marginRight: 5 }}>الخطوة الثانية</Text>
                            <Text style={{ fontFamily: "AlmaraiLight", fontSize: 16, marginRight: 5 }}>
                              عدد أفراد الأسرة: حدد عدد الأشخاص في المنزل.
                            </Text>
                        </View>
                    </View>  
               </View>  
            </Animated.View>
            <Animated.View style={[styles.cardContainer, { transform: [{ translateX: animatedValues[2] }] }]}>
               <View style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row"}}>
                    <View>
                        <View style={styles.nbrContainer}>
                            <View style={styles.circle}>
                                <Text style={{ fontFamily: "AlmaraiExtraBold", fontSize: 24,color:"white" }}>3</Text>
                            </View>       
                        </View>
                        <View>
                            <Text style={{ fontFamily: "AlmaraiBold", fontSize: 20, marginRight: 5 }}>الخطوة الثالثة</Text>
                            <Text style={{ fontFamily: "AlmaraiLight", fontSize: 16, marginRight: 5 }}>
                            الصيغة التي سنستخدمها هي: {'\n'}
        النتيجة = (إجمالي الاستهلاك / (عدد أفراد الأسرة × 10)) / عدد أفراد الأسرة                               
                          </Text>
                        </View>
                    </View>  
               </View>  
            </Animated.View>
            <Animated.View style={[styles.cardContainer, { transform: [{ translateX: animatedValues[3] }] }]}>
               <View style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row"}}>
                    <View>
                        <View style={styles.nbrContainer}>
                            <View style={styles.circle}>
                                <Text style={{ fontFamily: "AlmaraiExtraBold", fontSize: 24,color:"white" }}>4</Text>
                            </View>       
                        </View>
                        <View>
                            <Text style={{ fontFamily: "AlmaraiBold", fontSize: 20, marginRight: 5 }}>الخطوة الرابعه</Text>
                            <Text style={{ fontFamily: "AlmaraiLight", fontSize: 16, marginRight: 5 }}>
                            ونقوم بمقارنة النتيجة بالمعدل الوطني لتحديد ما إذا كان استهلاك هذه الأسرة جيداً أم لا.
                               </Text>
                        </View>
                    </View>  
               </View>  
            </Animated.View>
        </View>
        </ScrollView>
       <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('calculeFacture')}>
                <Text style={styles.buttonText}>متابعه</Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>
</View>
  );
};
const styles = StyleSheet.create({
  container: {},
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
      fontSize: 20,
      textAlign:"center",
  },
  scrollViewContent: {
    flexGrow: 1,
  
  },
  cards: {
      alignItems: "center",
  },
  cardContainer: {
      backgroundColor: "rgba(255, 255, 255, 1)",
      width: "90%",
      height: "auto",
      borderRadius: 16,
      marginTop: 20,
      borderColor: "#FFBE0B",
      borderWidth: 4,
      padding: 10,
      alignItems:"flex-end"
  },
  nbrContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
  },
  circle: {
      borderColor: "#FFBE0B",
      borderWidth: 3,
      width: 50,
      height: 50,
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
  img: {
      height: 100,
      width: 100,
  },
  buttonContainer:{
      justifyContent:"center",
      alignItems:"center",
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
export default TutorialScreen;
