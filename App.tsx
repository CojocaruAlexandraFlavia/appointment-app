import { NativeBaseProvider } from "native-base";
import {NavigationContainer, DefaultTheme } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { UserDataProvider } from "./src/store/UserData.context";
import { StackNavigatorParamList } from "./src/utils/Types";

import Login from "./src/components/Login";
import Register from "./src/components/Register";
import CalendarPicker from "./src/components/CalendarPicker";
import HomeClient from "./src/components/HomeClient";
import { SalonScreen } from "./src/components/Salon";

const Stack = createNativeStackNavigator<StackNavigatorParamList>();

const CustomTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white'
    },
  };

export default function App() {
  return (
    <NavigationContainer theme={CustomTheme}>
        <NativeBaseProvider>
            <UserDataProvider>
                <Stack.Navigator initialRouteName="CalendarPicker">
                    <Stack.Screen name="CalendarPicker" component={CalendarPicker}/>
                    <Stack.Screen name="Login" component={Login}/>
                    <Stack.Screen name="Register" component={Register}/>
                    <Stack.Screen name="HomeClient" component={HomeClient}/>
                    <Stack.Screen name="Salon" component={SalonScreen}/>
                </Stack.Navigator>
            </UserDataProvider>
        </NativeBaseProvider>
    </NavigationContainer>
  );
}