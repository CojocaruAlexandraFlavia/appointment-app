import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Login from "../../screens/Login/login.screen";
import Register from "../../screens/Register/register.screen";
import {StackNavigatorParamList} from "../navigator.types";
import {Drawer} from "../drawer";

const Stack = createNativeStackNavigator<StackNavigatorParamList>();

export const Authentication = () => {

    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register"  component={Register}/>
            <Stack.Screen name="HomeClient" component={Drawer}/>
        </Stack.Navigator>
    )

}