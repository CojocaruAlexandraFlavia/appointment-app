import { NativeBaseProvider } from "native-base";
import {NavigationContainer, DefaultTheme } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { UserDataProvider } from "./src/store/UserData.context";
import { StackNavigatorParamList } from "./src/utils/Types";
import { registerRootComponent } from 'expo';

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
import {createDrawerNavigator} from "@react-navigation/drawer";
import {AppRegistry} from "react-native";

// const Stack = createNativeStackNavigator<StackNavigatorParamList>();

const Drawer = createDrawerNavigator()

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
                <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/> } >
                    {/*<Stack.Screen name="CalendarPicker" // @ts-ignore*/}
                    {/*              component={CalendarPicker}/>*/}
                    {/*<Stack.Screen name="Login" // @ts-ignore*/}
                    {/*              component={Login}/>*/}
                    {/*<Stack.Screen name="Register" component={Register}/>*/}
                    {/*<Stack.Screen name="HomeClient" component={HomeClient}/>*/}
                    {/*<Stack.Screen name="Salon" component={SalonScreen}/>*/}
                    {/*<Stack.Screen name="MainTab" component={MainTab}/>*/}
                    <Drawer.Screen options={{ headerShown: false }} name="HomeDrawer" component={MainTab} />
                    <Drawer.Screen options={{ headerShown: false }} name="Salon" component={SalonScreen} />
                </Drawer.Navigator>
            </UserDataProvider>
        </NativeBaseProvider>
    </NavigationContainer>
  );
}

registerRootComponent(App);