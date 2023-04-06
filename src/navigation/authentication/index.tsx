import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Login from "../../screens/Login/login.screen";
import Register from "../../screens/Register/register.screen";
import {StackNavigatorParamList} from "../navigator.types";
import {Drawer} from "../drawer";
import {SalonScreen} from "../../screens/Salon/salon.screen";
import {ConfirmAppointment} from "../../screens/Appointments/Confirm appointment/confirm-appointment.screen";

const Stack = createNativeStackNavigator<StackNavigatorParamList>();

export const Authentication = () => {

    return(
        <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register"  component={Register}/>
            <Stack.Screen name="HomeClient" component={Drawer}/>
            <Stack.Screen name="Salon" component={SalonScreen} />
            <Stack.Screen name="ConfirmAppointment" component={ConfirmAppointment} />
        </Stack.Navigator>
    )

}