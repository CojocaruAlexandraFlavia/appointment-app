import { NativeBaseProvider } from "native-base";
import { UserDataProvider } from "./src/store/user-data.context";
import { registerRootComponent } from 'expo';
import { Navigator} from "./src/navigation/navigator";
import React from 'react'

export default function App() {

    return (
        <NativeBaseProvider>
            <UserDataProvider>
                <Navigator/>
            </UserDataProvider>
        </NativeBaseProvider>
  );
}

registerRootComponent(App);