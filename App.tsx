import { NativeBaseProvider } from "native-base";
import {NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { UserDataProvider } from "./src/store/UserData.context";
import { registerRootComponent } from 'expo';

import Login from "./src/screens/Login/login.screen";
import Register  from "./src/screens/Register/register.screen";
import { SalonScreen } from "./src/screens/Salon/salon.screen";

import {DrawerContent} from './src/navigation/drawer/drawer-content';
import MainTab from "./src/navigation/tab";
import {createDrawerNavigator} from "@react-navigation/drawer";

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
                <Drawer.Navigator initialRouteName="HomeDrawer" drawerContent={(props: any) => <DrawerContent {...props}/> } >
                    <Drawer.Screen name="Login" component={Login}/>
                    <Drawer.Screen name="Register" component={Register}/>
                    <Drawer.Screen options={{ headerShown: false }} name="HomeDrawer" component={MainTab} />
                    <Drawer.Screen options={{ headerShown: false }} name="Salon" component={SalonScreen} />
                </Drawer.Navigator>
            </UserDataProvider>
        </NativeBaseProvider>
    </NavigationContainer>
  );
}

registerRootComponent(App);