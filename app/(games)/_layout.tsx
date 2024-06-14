import React, { useContext, useEffect, useState } from 'react';
import { Tabs, Stack } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { LevelContext } from '@/hooks/ContextLevel';

export default function TabLayout() {
  const { unlockedLevels } = useContext(LevelContext);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finalScore"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      {unlockedLevels.includes(1) && (
        <Tabs.Screen
          name="game1_1"
          options={{
            title: 'game1_1',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="game1_2"
        options={{
          title: 'game1_2',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="game1_3"
        options={{
          title: 'game1_3',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      {unlockedLevels.includes(2) && (
        <Tabs.Screen
          name="tri_game"
          options={{
            title: 'tri_game',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
      )}
      {unlockedLevels.includes(10) && (
        <Tabs.Screen
          name="game1"
          options={{
            title: 'Game',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
      )}
      {unlockedLevels.includes(11) && (
        <Tabs.Screen
          name="recycling"
          options={{
            title: 'Game game',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
      )}
      {unlockedLevels.includes(3) && (
        <Tabs.Screen
          name="cardSlider"
          options={{
            title: 'tuto',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
      )}
      {unlockedLevels.includes(4) && (
        <Tabs.Screen
          name="calculeFacture"
          options={{
            title: 'calculeFacture',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
      )}
      {unlockedLevels.includes(6) && (
        <Tabs.Screen
          name="puzzle_game"
          options={{
            title: 'puzzle_game',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
      )}
      {unlockedLevels.includes(7) && (
        <Tabs.Screen
          name="flip_game"
          options={{
            title: 'puzzle_game',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
      )}
      {unlockedLevels.includes(11) && (
        <Tabs.Screen
          name="game2"
          options={{
            title: 'game2',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
