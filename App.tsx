import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Login from "./src/components/Login";
import { NativeBaseProvider } from "native-base";
import { LoginFormProvider } from "./src/store/LoginForm.context";
import {Register} from "./src/components/Register";
import Calendar from "./src/components/Calendar";

export default function App() {
  return (    
    <NativeBaseProvider>
        <LoginFormProvider>
            <Login/>
        </LoginFormProvider> 
    </NativeBaseProvider>

    // <View style={styles.container}>
    // <StatusBar style="auto" />
    // <Text style={styles.title}>React Native App</Text>
    //     <Text>User Registration</Text>
    //     <Register />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 60,
    paddingRight: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
