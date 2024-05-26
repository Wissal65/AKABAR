import {View,Text, Image, StyleSheet, Platform } from 'react-native';

 const notification=()=> {
  return (
   <View>
      <Text  style={styles.title}>notificaiton</Text>
   </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color:"white",
    marginTop:100,
  },
});
export default notification;