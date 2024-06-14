import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import ButtonIcon from "@/components/ButtonIcon"
const ButtonLevel = ({level,lock,navigateTo}) => {
    const navigation= useNavigation();
    const buttonStyle = lock ? styles.unlockedButton : styles.lockedButton;
    const navigateToGame = (game) => {
        navigation.navigate(game);
      };
    
  return (
      <TouchableOpacity onPress={()=>navigateToGame(navigateTo)} disabled={!lock ? true : false}>
          <View style={styles.button}>
          <ButtonIcon
            color1={'#898989'}
            color2={lock ? '#ff0' : '#E5E5E5'}
            iconName={lock ? 'star' : 'lock-closed'}
            locked={lock}
          />
            <Text style={[styles.buttonText]} >مرحلة  {level}</Text>
          </View>
      </TouchableOpacity>
  )
}

export default ButtonLevel

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        marginBottom: 5,
       
      },
      iconContainer: {
        width: 80, // Adjust width to create an oval shape
        height: 60, // Adjust height to create an oval shape
        borderRadius: 30, // Half of the height to create an oval shape
        backgroundColor: '#8DF967',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 1,
        marginBottom:10,
      },
      icon: {
        fontSize: 30,
        color: 'white',
      },
      buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: "AlmaraiBold"
      },
      unlockedButton: {
        backgroundColor: '#8DF967',
      },
      lockedButton: {
        backgroundColor: 'gray',
      },
      unlockedButtonText: {
        fontFamily: "AlmaraiBold",
      },
      lockedButtonText: {
        fontFamily: "AlmaraiRegular",
        color: 'white', // Change color to differentiate locked buttons
      }
})