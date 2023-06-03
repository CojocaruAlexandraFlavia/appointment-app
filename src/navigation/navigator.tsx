import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {Authentication} from "./Client/authentication";
import {ExpoPushTokenProvider} from "../store/expo-push-token.context";

const CustomTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'white'
    },
};

export const Navigator = () => {

    return(
        <NavigationContainer theme={CustomTheme}>
            <ExpoPushTokenProvider>
                <Authentication/>
            </ExpoPushTokenProvider>
        </NavigationContainer>
    )

}