import React, { useState ,useRef, useEffect} from 'react';
import { View, Image, TouchableWithoutFeedback, StyleSheet,Animated, Text, TextInput,ImageBackground, TouchableOpacity } from 'react-native';
import backgrond from "@/assets/images/screens/caclcule.jpg";
import { useDispatch } from 'react-redux';
import { openModal } from '../../store/reducer/ui/ModalSlice';
import CountdownTimer from '@/components/CountdownTimer';
import { useNavigation } from 'expo-router';
import { BlurView } from 'expo-blur';

const calculeFacture = () => {
    const [isZoomed, setIsZoomed] = useState(false);
    const scaleValue = useRef(new Animated.Value(1)).current;
    const [volume,setVolume] = useState(0);
    const [nbr,setNbr]=useState(0)
    const [result,setResult]=useState(0)
    const dispatch = useDispatch();
    const navigation=useNavigation();
    const stopTimerRef = useRef(null);
    const toggleZoom = () => {
        Animated.timing(scaleValue, {
          toValue: isZoomed ? 1 : 2, // Zoom in to 2x and zoom out to 1x
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsZoomed(!isZoomed);
        });
      };
      const handleOpenModal = (text) => {
        dispatch(openModal({ componentName: 'YourComponentName', modalText: text }));
      };
      const calculeResult=()=>{
        if(volume && nbr){
            const res = (volume / nbr * 10) / nbr;
            setResult(res);
            console.log(result)
        }else{
            console.log("error")
            handleOpenModal("لم تملأ جميع الخانات");        
        }
      }
      const navigateToNextScreen = () => {
        navigation.navigate('index'); // Replace 'NextScreenName' with the name of your next screen
      };
      
  useEffect(() => {
    const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });

    // Hide tab bar when entering the screen
    hideTabBar();

    // Show tab bar when leaving the screen
    return () => showTabBar();
  }, [navigation]);
    return (
        <ImageBackground 
        source={backgrond} 
        style={styles.background}
        blurRadius={7}
        >
          <CountdownTimer
            totalDuration={30}
            onEnd={handleOpenModal}
            navigateTo={navigateToNextScreen}
            stopTimerRef={stopTimerRef}
        />   
        <View style={styles.descriptionContainer}>
                <View style={styles.imageContainer}>
                    <TouchableWithoutFeedback onPress={toggleZoom}>
                        <Animated.Image
                                source={require('../../assets/images/facture.png')}
                                style={[styles.image, { transform: [{ scale: scaleValue }] }]}
                                resizeMode="contain"
                                />
                    </TouchableWithoutFeedback>
                </View>  
                <Text style={styles.description}>
                توصلت عائلة سلوي بفاتورة الكهرباء، تبين بأن الاستهلاك الشهري للعائلة المكونة من ثلاثة أفراد هو 143 كيلو / واط ساعة
                </Text>
        </View>
        
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="عدد أفراد الأسرة" placeholderTextColor="#BEBEBE" keyboardType="numeric" onChangeText={(value)=>setNbr(value)} />
                <TextInput style={styles.input} placeholder="الحجم" placeholderTextColor="#BEBEBE" keyboardType="numeric"  onChangeText={(value)=>setVolume(value)}/>
            </View>
            <View style={styles.calculation}>
                <Text style={{fontSize:40}}>({volume?volume:" ... "}÷{nbr?nbr*10:" ... "}) ÷ {nbr?nbr:" ... "}</Text>
            </View>
           <View style={{marginHorizontal:10,}}>
                <TouchableOpacity style={styles.button} onPress={calculeResult}>
                    <Text style={styles.buttonText}>حساب</Text>
                </TouchableOpacity>
           </View>
      </ImageBackground>
    );
  };
  
  const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
      },

    imageContainer:{
        zIndex: 2,
        width:"auto",
        height:240,
        backgroundColor:"#fff",
        alignItems:"center",
        justifyContent:"center",
        marginTop:15,

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
    descriptionContainer:{
        backgroundColor:"#fff",
        width:"100%",
        marginVertical:"5%",
        justifyContent:"center",
        alignItems:"center",
        borderTopWidth:5,
        borderBottomWidth:5,
        borderColor:"#FFBE0B"
    },
    description: {
      zIndex: 1,
      textAlign: 'center',
      marginBottom: 20,
      fontSize: 16,
      fontFamily:"AlmaraiBold"
    },
    inputContainer:{
        flexDirection:"row",
        marginHorizontal:100
    },
    input: {
      height: 50,
      borderColor: '#E6E6E6',
      borderWidth: 1,
      borderRadius: 5,
      width: '80%',
      marginBottom: 20,
      textAlign: 'center',
      fontSize: 16,
      backgroundColor:"#fff",
      fontFamily:"AlmaraiBold",
      color:"red",
      margin:10,
    },
    calculation: {
      width:370,
      alignItems:"center",
      justifyContent:"center",
      backgroundColor:"#fff",
      paddingVertical:"5%",
      borderRadius:16,
      borderColor:"#FFBE0B",
      borderWidth:3
    },
    button: {
      backgroundColor: '#FFD700',
      padding: 10,
      borderRadius: 8,
      width:300,
      alignItems:"center",
      justifyContent:"center",
      marginTop:20,
    },
    buttonText: {
      fontSize: 18,
      fontFamily:"AlmaraiBold"
    },
  });
export default calculeFacture

