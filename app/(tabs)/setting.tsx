import { Text, View,StyleSheet } from 'react-native'
import React, { Component } from 'react'

const setting=()=>{
  
    return (
      <View style={styles.container}>
        <Text style={styles.txt}>setting</Text>
      </View>
    )
  
}
const styles = StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
        backgroundColor:"white",
    },
    txt:{
        color:"white"
    }
}) 
export default setting;