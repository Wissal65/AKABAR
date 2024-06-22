import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image } from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Images from '@/assets/Images';
import Const from '@/assets/Constants';
import Floor from '@/components/Floor';
import Bird from '@/components/Bird';
import Physics, { resetPipes } from '@/Physics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 

const Game = () => {
    const [running, setRunning] = useState(true);
    const [score, setScore] = useState(0);
    const gameEngine = useRef(null);
    const [pipesPassed, setPipesPassed] = useState(0);
    const [attemptsLeft, setAttemptsLeft] = useState(2);
    const [won, setWon] = useState(false);
    const navigation = useNavigation();

    const saveScore = async (newScore) => {
        try {
            await AsyncStorage.setItem('score', newScore.toString());
        } catch (e) {
            console.error('Failed to save the score.', e);
        }
    };

    const setupWorld = useCallback(() => {
        let engine = Matter.Engine.create({ enableSleeping: false });
        let world = engine.world;
        world.gravity.y = 0.0;

        let bird = Matter.Bodies.rectangle(Const.MAX_WIDTH / 2, Const.MAX_HEIGHT / 2, Const.BIRD_WIDTH, Const.BIRD_HEIGHT);

        let floor1 = Matter.Bodies.rectangle(
            Const.MAX_WIDTH / 2,
            Const.MAX_HEIGHT - 25,
            Const.MAX_WIDTH + 4,
            50,
            { isStatic: true, label: 'ground' }
        );

        let floor2 = Matter.Bodies.rectangle(
            Const.MAX_WIDTH + (Const.MAX_WIDTH / 2),
            Const.MAX_HEIGHT - 25,
            Const.MAX_WIDTH + 4,
            50,
            { isStatic: true, label: 'ground' }
        );

        Matter.World.add(world, [bird, floor1, floor2]);

        Matter.Events.on(engine, 'collisionStart', (event) => {
            if (gameEngine.current) {
                var pairs = event.pairs;
                pairs.forEach((pair) => {
                    const { bodyA, bodyB } = pair;
                    const bodies = [bodyA, bodyB];

                    const isBird = bodies.some(body => body === bird);
                    const isPipeOrGround = bodies.some(body => body.label === 'pipe' || body.label === 'ground');

                    if (isBird && isPipeOrGround) {
                        gameEngine.current.dispatch({ type: "game-over" });
                    }
                });
            }
        });

        return {
            physics: { engine: engine, world: world },
            floor1: { body: floor1, renderer: Floor },
            floor2: { body: floor2, renderer: Floor },
            bird: { body: bird, renderer: Bird },
        };
    }, [gameEngine]);

    const [entities, setEntities] = useState(setupWorld);

    const onEvent = useCallback((e) => {
        if (e.type === "game-over") {
            setRunning(false);
            saveScore(score);
        } else if (e.type === "score") {
            setScore(prevScore => prevScore + 1);
            setPipesPassed(prevPipes => prevPipes + 1);
            if (pipesPassed + 1 === 5) {
                setWon(true);
                setRunning(false);
            }
        } else if (e.type === 'bonus' && e.score !== undefined) {
            setScore(prevScore => prevScore + e.score);
        }
    }, [pipesPassed, score]);

    const RestartGame = useCallback(() => {
        if (won || attemptsLeft === 0) {
            navigation.navigate('WinScreen'); // Navigate to WinScreen upon winning or no attempts left
        } else {
            resetPipes();
            setEntities(setupWorld()); // Update entities with new setup
            setScore(0);
            setPipesPassed(0);
            setAttemptsLeft(attemptsLeft - 1);
            setRunning(true); // Start running the game again
            
            if (gameEngine.current) {
                gameEngine.current.swap(setupWorld());
            }
        }
    }, [attemptsLeft, navigation, score, setupWorld, won]);

    useEffect(() => {
        setEntities(setupWorld());
    }, [setupWorld]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Reset game state when the component is focused (navigated back from WinScreen)
            setWon(false);             // Reset the 'won' state to false
            setAttemptsLeft(2);        // Reset the attempts left to 2 (or initial value)
            RestartGame();             // Restart the game when navigating back from WinScreen
        });
    
        return unsubscribe; // Clean up the listener when the component unmounts or changes
    }, [navigation, RestartGame]);
    

    return (
        <View style={styles.container}>
            {/* <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" /> */}
            <GameEngine
                ref={gameEngine}
                style={styles.gameContainer}
                systems={[Physics]}
                running={running}
                onEvent={onEvent}
                entities={entities}>
                <StatusBar hidden={true} />
            </GameEngine>
            <Text style={styles.score}>{score}</Text>
            {!running && (
                <TouchableOpacity style={styles.fullScreenButton} onPress={RestartGame}>
                    <View style={styles.fullScreen}>
                    <Text style={styles.gameOverText}>{won ? "Game Over" : "Game Over"}</Text>
                    {attemptsLeft > 0 && !won && <Text style={styles.gameOverSubText}>Try Again</Text>}
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#55C7FF',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: Const.MAX_WIDTH,
        height: Const.MAX_HEIGHT
    },
    gameContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    gameOverText: {
        color: 'white',
        fontSize: 48,
        fontFamily: '04b_19'
    },
    gameOverSubText: {
        color: 'white',
        fontSize: 24,
        fontFamily: '04b_19'
    },
    fullScreen: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    score: {
        position: 'absolute',
        color: 'white',
        fontSize: 72,
        top: 50,
        left: Const.MAX_WIDTH / 2 - 20,
        textShadowColor: '#444444',
        textShadowOffset: { width: 2, height: 2},
        textShadowRadius: 2,
        fontFamily: '04b_19'
    },
    fullScreenButton: {
        ...StyleSheet.absoluteFillObject,
    }
});

export default Game;
