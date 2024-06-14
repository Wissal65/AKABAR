import { StyleSheet, Text, View,Dimensions, Image,TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from 'expo-router';
const { width: initialWidth, height: initialHeight } = Dimensions.get('window');
const finalScore = () => {
  const navigation = useNavigation();
  useEffect(() => { 
    const hideTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'none' } });
    const showTabBar = () => navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    // Hide tab bar when entering the screen
    hideTabBar();
    
    return () => showTabBar();
  }, [navigation]);
  
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require("@/assets/images/20.png")} style={styles.image}/>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>تهانينا، لقد أنهيت المرحلة</Text>
      </View>
      <View style={styles.scores}>
        <View style={[styles.item1,{backgroundColor:"#3A86FF",}]}>
          <Text style={{color:"white",fontFamily:"AlmaraiRegular"}}>وقت</Text>
          <View style={styles.souItem}>
            <Text>0:23</Text>
            <Image source={require("@/assets/images/icons/prime-time.png")} style={{width:30,height:30,marginLeft:5}}/>
          </View>
        </View>
        <View style={[styles.item1,{backgroundColor:"#04E762",}]}>
          <Text style={{color:"white",fontFamily:"AlmaraiRegular"}}>وقت</Text>
          <View style={styles.souItem}>
            <Text>80%</Text>
            <Image source={require("@/assets/images/icons/score-eleve.png")} style={{width:30,height:30,marginLeft:5}}/>
          </View>
        </View>
        <View style={[styles.item1,{backgroundColor:"#FFBE0B",}]}>
          <Text style={{color:"white",fontFamily:"AlmaraiRegular"}}>وقت</Text>
          <View style={styles.souItem}>
            <Text>50</Text>
            <Image source={require("@/assets/images/icons/favori.png")} style={{width:30,height:30,marginLeft:5}}/>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate("home")}}>
          <Text style={styles.buttonText}>متابعة</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default finalScore

const styles = StyleSheet.create({
  container:{
    width:initialWidth,
    height:initialHeight,
    alignItems:"center"
  },
  imageContainer:{
    alignItems:"center",
    justifyContent:"center",
    marginTop:initialWidth*0.2,
  },
  image:{
    width:initialWidth * 0.8,
    height:initialWidth * 0.8,
  },
  textContainer:{
    justifyContent:"center",
    alignItems:"center",
  },
  text:{
    fontFamily:"AlmaraiBold",
    fontSize:24
  },
  item1:{
    width:initialWidth*0.3,
    height:initialWidth*0.28,
    borderRadius:16,
    alignItems:"center",
    padding:3,
    margin:3
  },
  scores:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginTop:20,
  },
  souItem:{
    width:initialWidth*0.27,
    height:initialWidth*0.2,
    backgroundColor:"white",
    borderRadius:8,
    justifyContent:"center",
    alignItems:"center",
    flexDirection:"row"
  },
  buttonContainer:{
    justifyContent:"center",
    alignItems:"center",
    position:"absolute",
    bottom:0,
    marginBottom:80,
  },
  button:{
    width:initialWidth * 0.75,
    height:52,
    backgroundColor:"#FFBE0B",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:8,
  },
  buttonText:{
    color: '#fff',
    fontSize: 20,
    textShadowColor: 'black', // Shadow color
    textShadowOffset: { width: -1, height: 1 }, // Shadow offset
    textShadowRadius: 1, // Shadow radius
    fontFamily:"AlmaraiExtraBold"
  }
})