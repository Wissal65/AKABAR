import { StyleSheet, Text, View, Dimensions, ImageBackground, Image, Animated, Easing, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from 'expo-router';
const { width: initialWidth, height: initialHeight } = Dimensions.get('window');
import backgrond from '@/assets/images/screens/screen2.jpg';

const recyclingTuto = () => {
    const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
    const navigation = useNavigation();

    const animatedValues = [useRef(new Animated.Value(-initialWidth)).current, useRef(new Animated.Value(initialWidth)).current, useRef(new Animated.Value(-initialWidth)).current];
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
                    <Text style={styles.title}>مراحل الصنع</Text>
                </View>
                <View style={styles.cards}>
                    <Animated.View style={[styles.cardContainer, { transform: [{ translateX: animatedValues[0] }] }]}>
                       <View style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row"}}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image source={require("@/assets/images/icons/tuto1.png")} style={styles.img} />
                            </View>
                            <View>
                                <View style={styles.nbrContainer}>
                                    <View style={styles.circle}>
                                        <Text style={{ fontFamily: "AlmaraiExtraBold", fontSize: 24,color:"white" }}>1</Text>
                                    </View>       
                                </View>
                                <View>
                                    <Text style={{ fontFamily: "AlmaraiBold", fontSize: 20, marginRight: 5 }}>المرحلة الولى</Text>
                                    <Text style={{ fontFamily: "AlmaraiLight", fontSize: 16, marginRight: 5 }}> نقوم بقطع قنينه بواسطه المقص</Text>
                                </View>
                            </View>  
                       </View>  
                    </Animated.View>
                    <Animated.View style={[styles.cardContainer, { transform: [{ translateX: animatedValues[1] }] }]}>
                       <View style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row"}}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image source={require("@/assets/images/icons/tuto2.png")} style={styles.img} />
                            </View>
                            <View>
                                <View style={styles.nbrContainer}>
                                    <View style={styles.circle}>
                                        <Text style={{ fontFamily: "AlmaraiExtraBold", fontSize: 24,color:"white" }}>2</Text>
                                    </View>       
                                </View>
                                <View>
                                    <Text style={{ fontFamily: "AlmaraiBold", fontSize: 20, marginRight: 5 }}>المرحلة الثانية</Text>
                                    <Text style={{ fontFamily: "AlmaraiLight", fontSize: 16, marginRight: 5 }}> ثم نملا الأصيص بالتراب</Text>
                                </View>
                            </View>  
                       </View>  
                    </Animated.View>
                    <Animated.View style={[styles.cardContainer, { transform: [{ translateX: animatedValues[2] }] }]}>
                       <View style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row"}}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image source={require("@/assets/images/icons/tuto3.png")} style={styles.img} />
                            </View>
                            <View>
                                <View style={styles.nbrContainer}>
                                    <View style={styles.circle}>
                                        <Text style={{ fontFamily: "AlmaraiExtraBold", fontSize: 24,color:"white" }}>3</Text>
                                    </View>       
                                </View>
                                <View>
                                    <Text style={{ fontFamily: "AlmaraiBold", fontSize: 20, marginRight: 5 }}>المرحلة الثالثة</Text>
                                    <Text style={{ fontFamily: "AlmaraiLight", fontSize: 16, marginRight: 5 }}> ثم نزرع الورود في الأصيص</Text>
                                </View>
                            </View>  
                       </View>  
                    </Animated.View>
                </View>
               <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TutorialScreen')}>
                        <Text style={styles.buttonText}>متابعه</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}


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
        fontSize: 24,
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
export default recyclingTuto
