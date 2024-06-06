import {View,Text, Image, StyleSheet, Platform } from 'react-native';

 const notification=()=> {
  return (
   <View>
      <Text  style={styles.title}>notificaiton</Text>

      <View style={styles.container}>
        <View style={styles.line}>

        </View>
      </View>
   </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color:"white",
    marginTop:100,
  },
  container:{
    width:100,
    height:350,
    borderLeftWidth:2,
    borderRightWidth:2,
    backgroundColor:"#C9BC9C",
    margin:20,
    alignItems:"flex-end",
  },
  line:{
    height:350,
    width:20,
    backgroundColor:"#E7DAC4",
    marginRight:10,
  }
});
export default notification;