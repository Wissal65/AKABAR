import {View,Text, Image, StyleSheet, Platform,TouchableOpacity,Button} from 'react-native';
import { useEffect ,useRef,useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getScore} from '../../hooks/scoreManager'
import { Link } from 'expo-router';
import ModalComponent from '@/components/ModalComponent';
import { openModal } from '@/store/reducer/ui/ModalSlice';
import { openAssisModal } from '@/store/reducer/ui/MdalAssistantSlice';
import { useDispatch } from 'react-redux';
import diamond from "@/assets/images/icons/diamond.png";
import TrushCapacity from '@/components/trushCapacity';
import Timer from '@/components/Timer';
SplashScreen.preventAutoHideAsync();
 const HomeScreen=()=> {
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    dispatch(openModal({ componentName: 'YourComponentName',modalText:"hello" }));
  };
  const navigation = useNavigation();

  const navigateToGames = () => {
    navigation.navigate('(games)');
  };
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadScore = async () => {
      const savedScore = await getScore();
      setScore(savedScore);
    };

    loadScore();
  }, []);
      
    const [progress, setProgress] = useState(0);
    const segments = [
      { color: '#F95050' }, { color: '#F95050' }, { color: '#F95050' },
      { color: '#ECB575' }, { color: '#ECB575' }, { color: '#E4BA47' },
      { color: '#E4BA47' }, { color: '#E4BA47' }, { color: '#63D447' },
      { color: '#6DEF4C' }, { color: '#5CFF33' }
    ];
  
    const handleIncrement = () => {
      setProgress((prev) => (prev < segments.length ? prev + 1 : prev));
    };
  const timerRef = useRef();

  const startTimer = () => {
    if (timerRef.current) {
      timerRef.current.startTimer();
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      timerRef.current.stopTimer();
    }
  };
  return (
  
  <View style={styles.container}>
    <View style={styles.scoreContainer}>
      <Text style={styles.score}>{score}</Text>
      <Image source={diamond} style={styles.diamond}/>
    </View>
     <TouchableOpacity onPress={navigateToGames}>
       <LinearGradient
        // Button Linear Gradient
        colors={['#BBDB2B', '#4BA503']}
        start={{ x: 0.2, y: 0}}
        end={{x: 0.7, y: 0.8}}
        style={[styles.card]}>
      
        <Image
          source={require('../../assets/images/cards3.png')}
          style={styles.image}
        />
        <View style={styles.textContainer}>
        <Image source={require('../../assets/images/checked.png')} style={styles.checked}/>
          <Text style={styles.lessonNumber}>الحصة الأولى</Text>
          <Text style={styles.lessonTitle}>حماية القرية</Text>
        </View>
      </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity >
       <LinearGradient
        // Button Linear Gradient
        colors={['#18B0B5', '#156B82']}
        start={{ x: 0.2, y: 0}}
        end={{x: 0.7, y: 0.8}}
        style={[styles.card]}>
      
        <Image
          source={require('../../assets/images/cards4.png')}
          style={[styles.image,{width:110,height:110}]}
        />
        <View style={styles.textContainer}>
        <Image source={require('../../assets/images/continue.png')} style={styles.checked}/>
          <Text style={styles.lessonNumber}>الحصة الأولى</Text>
          <Text style={styles.lessonTitle}>حماية القرية</Text>
        </View>
      </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity >
       <LinearGradient
        // Button Linear Gradient
        colors={['#B9B9B9', '#454545']}
        start={{ x: 0.2, y: 0}}
        end={{x: 0.7, y: 0.8}}
        style={[styles.card]}>
      
        <Image
          source={require('../../assets/images/cards5.png')}
          style={[styles.image,{width:110,height:110}]}
        />
        <View style={styles.textContainer}>
        <Image source={require('../../assets/images/continue.png')} style={styles.checked}/>
          <Text style={styles.lessonNumber}>الحصة الأولى</Text>
          <Text style={styles.lessonTitle}>حماية القرية</Text>
        </View>
      </LinearGradient>
      </TouchableOpacity>
      <Timer ref={timerRef} duration={5} nextScreen={'setting'}/>
      <Button title="Start Timer" onPress={startTimer} />
      <Button title="stop Timer" onPress={stopTimer} />
      <Button title="Open Modal" onPress={handleOpenModal} />
      <ModalComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop:50
  },
  scoreContainer:{
    flexDirection:"row",
    justifyContent:"flex-end",
    alignItems:"center",
    width:"100%",
    paddingHorizontal:"5%",
  },
  score:{
    fontFamily:"AlmaraiBold",
    fontSize:20
  },
  diamond:{
    width:25,
    height:25,
    marginLeft:10,
  },
  card: {
    width: "92%",
    height:144,
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 130,
    height: 130,
    marginRight: 10,
    marginBottom:70
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  lessonNumber: {
    fontSize: 14,
    color: '#fff',
    fontFamily:"AlmaraiBold",

  },
  lessonTitle: {
    fontSize: 18,
    fontFamily:"AlmaraiExtraBold",
    color: '#fff',
  },
  icon: {
    fontSize: 24,
    color: '#fff',
  },
  checked:{
    width:30,
    height:30,
    marginBottom:20,
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
 
});
export default HomeScreen;