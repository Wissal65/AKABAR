// screens/Home.js
import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, Image, ImageBackground,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LevelContext } from '@/hooks/ContextLevel';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonLevel from '@/components/ButtonLevel';
const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const { unlockedLevels } = useContext(LevelContext);
  useEffect(() => { 
    const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    // Hide tab bar when entering the screen
    hideTabBar();
    
    return () => showTabBar();
  }, [navigation]);
  return (
    <ScrollView>
    <View style={styles.container}>
       <LinearGradient
        // Button Linear Gradient
        colors={['#BBDB2B', '#4BA503']}
        start={{ x: 0.2, y: 0}}
        end={{x: 0.7, y: 0.8}}
        style={[styles.header]}>
           <Image
          source={require('../../assets/images/cards3.png')}
          style={styles.image}
        />
      <View>
        <Text style={styles.lessonTitle}>حماية القرية</Text>
      </View>
     </LinearGradient>

    <View  style={[styles.card,{marginTop:10}]}>
        <ImageBackground source={require("@/assets/images/a2.jpg")} style={styles.cardImage} imageStyle={{borderTopLeftRadius:16,borderTopRightRadius:16}} blurRadius={3}>
        <View style={styles.textContainer}>
          <View style={{    backgroundColor:"rgba(0,0,0,0.5)" ,paddingHorizontal:30,borderRadius:20,paddingVertical:7 ,marginBottom:20}}>
            <Text style={{color:"white",fontFamily:"AlmaraiBold",fontSize:18}}>النفايات</Text>
          </View>
        </View>
        <View style={styles.leftLign}>
        <ButtonLevel navigateTo={"intro"} lock={unlockedLevels.includes(1)}  level={"1"} icon={"star"} />
        </View>
        <View style={styles.rightLign}>
        <ButtonLevel navigateTo={"trie_intro"} lock={unlockedLevels.includes(2)} level={"2"} icon={"home"} />
        </View>
        <View style={styles.leftLign}>
          <ButtonLevel navigateTo={"recycling_intro"} lock={unlockedLevels.includes(3)} level={"3"} icon={"home"} />
        </View>
        </ImageBackground>
     </View>
     <View  style={styles.card}>
        <ImageBackground source={require("@/assets/images/a1.jpg")} style={styles.cardImage} imageStyle={{borderBottomRightRadius:16,borderBottomLeftRadius:16}} blurRadius={5}>
        <View style={styles.textContainer}>
          <View style={{backgroundColor:"rgba(0,0,0,0.5)" ,paddingHorizontal:30,borderRadius:20,paddingVertical:7,marginBottom:20}}>
            <Text style={{color:"white",fontFamily:"AlmaraiBold",fontSize:18}}>المياه</Text>
          </View>
        </View>
        <View style={styles.leftLign}>
        <ButtonLevel navigateTo={"hunterStory"} lock={unlockedLevels.includes(4)}  level={"4"} icon={"home"} />
        </View>
        <View style={styles.rightLign}>
        <ButtonLevel navigateTo={"agricultur"} lock={unlockedLevels.includes(5)} level={"5"} icon={"home"} />
        </View>
        <View style={styles.leftLign}>
          <ButtonLevel navigateTo={"agricultur"} lock={unlockedLevels.includes(6)} level={"6"} icon={"home"} />
        </View>
        </ImageBackground>
     </View>
     <View  style={styles.card}>
        <ImageBackground source={require("@/assets/images/a1.jpg")} style={styles.cardImage} imageStyle={{borderBottomRightRadius:16,borderBottomLeftRadius:16}} blurRadius={5}>
        <View style={styles.textContainer}>
          <View style={{    backgroundColor:"rgba(0,0,0,0.5)" ,paddingHorizontal:30,borderRadius:20,paddingVertical:7}}>
            <Text style={{color:"white",fontFamily:"AlmaraiBold",fontSize:18}}>المياه</Text>
          </View>
        </View>
        <View style={styles.leftLign}>
        <ButtonLevel navigateTo={"hunterStory"} lock={unlockedLevels.includes(7)}  level={"7"} icon={"home"} />
        </View>
        <View style={styles.rightLign}>
        <ButtonLevel navigateTo={"game1"} lock={unlockedLevels.includes(8)} level={"8"} icon={"home"} />
        </View>
        <View style={styles.leftLign}>
          <ButtonLevel navigateTo={"agricultur"} lock={unlockedLevels.includes(9)} level={"9"} icon={"home"} />
        </View>
        </ImageBackground>
     </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header:{
    width:"100%",
    marginTop:initialHeight*0.03,
    justifyContent:"space-between",
    alignItems:"center",
    flexDirection:"row",
    paddingHorizontal:10,
  },
  card:{
    width:"90%",
    height:400,
  },
  cardImage:{
    width:"100%", 
    height:"100%",
    borderRadius:12
  },
  textContainer:{
    width:"100%",
    alignItems:"center",
    marginTop:10
  },
  leftLign:{
    width:"100%",
    height:100,
    justifyContent:"center",
    paddingHorizontal:30,
    alignItems:"flex-start",

  },
  rightLign:{
    width:"100%",
    height:100,
    justifyContent:"center",
    alignItems:"flex-end",
    paddingHorizontal:30,

  },
  
  image:{
    width:initialWidth*0.2,
    height:initialHeight*0.1,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 20,
  },
  levelsContainer: {
    width: '80%',
  },
  lessonTitle:{
    fontFamily:"AlmaraiBold",
    fontSize:24,
    color:"white",

  },
});

export default Home;
