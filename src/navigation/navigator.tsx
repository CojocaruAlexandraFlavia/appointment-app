import {NavigationContainer} from "@react-navigation/native";
import {Authentication} from "./authentication";
import {Drawer} from "./drawer";
import MainTab from "./tab";


export const Navigator = () => {

    return(
        <NavigationContainer>
            <Authentication/>
            <Drawer/>
            <MainTab/>
        </NavigationContainer>
    )

}