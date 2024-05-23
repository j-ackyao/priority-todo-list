import "react-native-reanimated"; // to fix the navigation after expo upgraded to sdk 51
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/Home';
import Test from './src/Test';
import Todo from './src/todo/Todo';
import Login from './src/user/Login';
import Register from './src/user/Register';
import { createContext, useContext, useEffect, useState } from "react";

const Stack = createNativeStackNavigator();


export default function App() {
  // SERVER_DOMAIN = await readAsStringAsync("server-domain");
  // const navigation: NativeStackNavigationProp<any> = useNavigation<NativeStackNavigationProp<any>>();
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"initialRoute"} screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="Register" component={Register}/>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Test" component={Test} />
          <Stack.Screen name="Todo" component={Todo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
