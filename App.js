import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FrontScreen from './screens/FrontScreen';
import InformationScreen from './screens/InformationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
          <Stack.Screen name="Hoenn Pokédex" component={FrontScreen}/>
          <Stack.Screen name="Pokemon Information" component={InformationScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

