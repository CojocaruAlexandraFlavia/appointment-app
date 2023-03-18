import React from "react";
import Login from "./src/components/Login";
import { NativeBaseProvider } from "native-base";
import { Register } from "./src/components/Register";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Calendar from "./src/components/Calendar";
import { UserDataProvider } from "./src/store/UserData.context";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <NativeBaseProvider>
            <UserDataProvider>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={Login}/>
                    <Stack.Screen name="Register" component={Register}/>
                    <Stack.Screen name="Calendar" component={Calendar}/>
                </Stack.Navigator>
            </UserDataProvider>
        </NativeBaseProvider>
    </NavigationContainer>
  );
}
