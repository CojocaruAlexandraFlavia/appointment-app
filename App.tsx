import Login from "./src/components/Login";
import { NativeBaseProvider } from "native-base";
import {NavigationContainer, DefaultTheme } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Calendar from "./src/components/Calendar";
import { UserDataProvider } from "./src/store/UserData.context";
import HomeClient from "./src/components/HomeClient";
import { SalonScreen } from "./src/components/Salon";
import { StackNavigatorParamList } from "./src/utils/Types";

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
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={Login}/>
                    {/* <Stack.Screen name="Register" component={Register}/> */}
                    <Stack.Screen name="Calendar" component={Calendar}/>
                    <Stack.Screen name="HomeClient" component={HomeClient}/>
                    <Stack.Screen name="Salon" component={SalonScreen}/>
                </Stack.Navigator>
            </UserDataProvider>
        </NativeBaseProvider>
    </NavigationContainer>
  );
}
