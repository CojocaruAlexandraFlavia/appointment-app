import Login from "./src/components/Login";
import { NativeBaseProvider } from "native-base";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Calendar from "./src/components/Calendar";
import { UserDataProvider } from "./src/store/UserData.context";
import HomeClient from "./src/components/HomeClient";
//import { HomeClient }  from "./src/components/HomeClient";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <NativeBaseProvider>
            <UserDataProvider>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={Login}/>
                    {/* <Stack.Screen name="Register" component={Register}/> */}
                    <Stack.Screen name="Calendar" component={Calendar}/>
                    <Stack.Screen name="HomeClient" component={HomeClient}/>
                </Stack.Navigator>
            </UserDataProvider>
        </NativeBaseProvider>
    </NavigationContainer>
  );
}
