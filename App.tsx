import { NativeBaseProvider } from "native-base";
import { UserDataProvider } from "./src/store/user-data.context";
import { registerRootComponent } from 'expo';
import { Navigator} from "./src/navigation/navigator";
import React from 'react'
import { ExpoPushTokenProvider } from "./src/store/expo-push-token.context";

export default function App() {
    return (
        <NativeBaseProvider>
            <UserDataProvider>
                <ExpoPushTokenProvider>
                    <Navigator/>
                </ExpoPushTokenProvider>
            </UserDataProvider>
        </NativeBaseProvider>
  );
}

registerRootComponent(App);