import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Login from "../../screens/Login/login.screen";
import Register from "../../screens/Register/register.screen";
import {StackNavigatorParamList} from "../navigator.types";

const Stack = createNativeStackNavigator<StackNavigatorParamList>();

export const Authentication = () => {

    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register"  component={Register}/>
        </Stack.Navigator>
    )

}