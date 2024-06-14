import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import {StyleSheet} from "react-native"

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle:{...styles.bottom},
        tabBarShowLabel: false,
      }}
      >
      <Tabs.Screen
      name="index"
      options={{
        title: 'home',
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon name={focused ? 'home' : 'home-outline'} color={"black"} />

        )
      }}
    />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Notification',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'notifications' : 'notifications-outline'} color={"black"} />
          ),
        }}
    
      />
       <Tabs.Screen
        name="setting"
        options={{
          title: 'Setting',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cog' : 'cog-outline'} color={"black"} />
          ),
        }}
      />
    </Tabs>
  );
}
const styles=StyleSheet.create({
  bottom:{
    backgroundColor:"#BB86FC",
    margin:5,
    height:70,
    borderRadius:16,
    paddingBottom:5
  },

})