import React from "react";
import Login from "./src/components/Login";
import { NativeBaseProvider } from "native-base";
import { LoginFormProvider } from "./src/store/LoginForm.context";

export default function App() {
  return (
    <NativeBaseProvider>
        <LoginFormProvider>
            <Login/>
        </LoginFormProvider> 
    </NativeBaseProvider>
  );
}
