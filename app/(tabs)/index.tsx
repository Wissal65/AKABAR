import {View,Text, Image, StyleSheet, Platform,TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
import { useNavigation } from '@react-navigation/native';
SplashScreen.preventAutoHideAsync();

 const HomeScreen=()=> {
  const navigation = useNavigation();

  const navigateToGames = () => {
    navigation.navigate('(games)');
  };
  return (
    <View style={styles.container}>
     <TouchableOpacity onPress={navigateToGames}>
       <LinearGradient
        // Button Linear Gradient
        colors={['#BBDB2B', '#4BA503']}
        start={{ x: 0.2, y: 0}}
        end={{x: 0.7, y: 0.8}}
        style={[styles.card]}>
      
        <Image
          source={require('../../assets/images/cards3.png')}
          style={styles.image}
        />
        <View style={styles.textContainer}>
        <Image source={require('../../assets/images/checked.png')} style={styles.checked}/>
          <Text style={styles.lessonNumber}>الحصة الأولى</Text>
          <Text style={styles.lessonTitle}>حماية القرية</Text>
        </View>
      </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity >
       <LinearGradient
        // Button Linear Gradient
        colors={['#18B0B5', '#156B82']}
        start={{ x: 0.2, y: 0}}
        end={{x: 0.7, y: 0.8}}
        style={[styles.card]}>
      
        <Image
          source={require('../../assets/images/cards4.png')}
          style={[styles.image,{width:110,height:110}]}
        />
        <View style={styles.textContainer}>
        <Image source={require('../../assets/images/continue.png')} style={styles.checked}/>
          <Text style={styles.lessonNumber}>الحصة الأولى</Text>
          <Text style={styles.lessonTitle}>حماية القرية</Text>
        </View>
      </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity >
       <LinearGradient
        // Button Linear Gradient
        colors={['#B9B9B9', '#454545']}
        start={{ x: 0.2, y: 0}}
        end={{x: 0.7, y: 0.8}}
        style={[styles.card]}>
      
        <Image
          source={require('../../assets/images/cards5.png')}
          style={[styles.image,{width:110,height:110}]}
        />
        <View style={styles.textContainer}>
        <Image source={require('../../assets/images/continue.png')} style={styles.checked}/>
          <Text style={styles.lessonNumber}>الحصة الأولى</Text>
          <Text style={styles.lessonTitle}>حماية القرية</Text>
        </View>
      </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop:100
  },
  card: {
    width: "92%",
    height:144,
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 130,
    height: 130,
    marginRight: 10,
    marginBottom:70
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  lessonNumber: {
    fontSize: 14,
    color: '#fff',
    fontFamily:"AlmaraiBold",

  },
  lessonTitle: {
    fontSize: 18,
    fontFamily:"AlmaraiExtraBold",
    color: '#fff',
  },
  icon: {
    fontSize: 24,
    color: '#fff',
  },
  checked:{
    width:30,
    height:30,
    marginBottom:20,
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
 
});
export default HomeScreen;