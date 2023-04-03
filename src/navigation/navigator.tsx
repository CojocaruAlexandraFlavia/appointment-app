import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {Authentication} from "./authentication";

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
            <Authentication/>
        </NavigationContainer>
    )

}