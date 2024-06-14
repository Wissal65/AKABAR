// context/LevelContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LevelContext = createContext();

const LevelProvider = ({ children }) => {
  const [unlockedLevels, setUnlockedLevels] = useState([1]);

  useEffect(() => {
    const fetchUnlockedLevels = async () => {
      try {
        const storedLevels = await AsyncStorage.getItem('unlockedLevels');
        if (storedLevels) {
          setUnlockedLevels(JSON.parse(storedLevels));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUnlockedLevels();
  }, []);

  const unlockLevel = async (level) => {
    const newUnlockedLevels = [...unlockedLevels, level];
    setUnlockedLevels(newUnlockedLevels);
    await AsyncStorage.setItem('unlockedLevels', JSON.stringify(newUnlockedLevels));
  };
  const resetLevels = async () => {
    const initialLevels = [1];
    setUnlockedLevels(initialLevels);
    await AsyncStorage.setItem('unlockedLevels', JSON.stringify(initialLevels));
  };

  return (
    <LevelContext.Provider value={{ unlockedLevels, unlockLevel,resetLevels }}>
      {children}
    </LevelContext.Provider>
  );
};

export { LevelContext, LevelProvider };
