import AsyncStorage from '@react-native-async-storage/async-storage';

const SCORE_KEY = '@game_score';

// Function to save score
export const saveScore = async (score) => {
  try {
    await AsyncStorage.setItem(SCORE_KEY, score.toString());
  } catch (e) {
    console.error('Failed to save the score.', e);
  }
};

// Function to get score
export const getScore = async () => {
  try {
    const score = await AsyncStorage.getItem(SCORE_KEY);
    return score !== null ? parseInt(score, 10) : 0;
  } catch (e) {
    console.error('Failed to load the score.', e);
    return 0;
  }
};

// Function to increment score
export const incrementScore = async (value) => {
  const currentScore = await getScore();
  const newScore = currentScore + value;
  await saveScore(newScore);
  return newScore;
};

// Function to reset score
export const resetScore = async () => {
  try {
    await AsyncStorage.setItem(SCORE_KEY, '0');
  } catch (e) {
    console.error('Failed to reset the score.', e);
  }
};
