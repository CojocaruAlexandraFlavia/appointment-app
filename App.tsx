import { NativeBaseProvider } from "native-base";
import {NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { UserDataProvider } from "./src/store/UserData.context";
import { registerRootComponent } from 'expo';

import Login from "./src/components/Login";
import Register  from "./src/components/Register";
import { SalonScreen } from "./src/components/Salon";

import {DrawerContent} from './src/components/DrawerContent';
import MainTab from "./src/components/MainTab";
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