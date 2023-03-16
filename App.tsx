import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import {Register} from "./components/Register";

export default function App() {
  return (    
    <View style={styles.container}>
    <StatusBar style="auto" />
    <Text style={styles.title}>React Native App</Text>
        <Text>User Registration</Text>
        <Register />
    </View>
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
