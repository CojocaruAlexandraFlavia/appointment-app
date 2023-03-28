import { NativeBaseProvider } from "native-base";
import {NavigationContainer, DefaultTheme } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { UserDataProvider } from "./src/store/UserData.context";
import { StackNavigatorParamList } from "./src/utils/Types";

import Login from "./src/components/Login";
import Register  from "./src/components/Register";
import CalendarPicker from "./src/components/CalendarPicker";
import HomeClient from "./src/components/HomeClient";
import { SalonScreen } from "./src/components/Salon";

import NotificationScreen from './src/components/NotificationScreen';
import ExploreScreen from './src/components/ExploreScreen';
import Profile from './src/components/Profile';
import EditProfile from './src/components/EditProfile';
import {DrawerContent} from './src/components/DrawerContent';
import MainTab from "./src/components/MainTab";

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
                <Stack.Navigator initialRouteName="HomeClient">
                    <Stack.Screen name="CalendarPicker" // @ts-ignore
                                  component={CalendarPicker}/>
                    <Stack.Screen name="Login" // @ts-ignore
                                  component={Login}/>
                    <Stack.Screen name="Register" component={Register}/>
                    <Stack.Screen name="HomeClient" component={HomeClient}/>
                    <Stack.Screen name="Salon" component={SalonScreen}/>
                    {/*<Stack.Screen name="MainTab" component={MainTab}/>*/}
                </Stack.Navigator>
            </UserDataProvider>
        </NativeBaseProvider>
    </NavigationContainer>
  );
}