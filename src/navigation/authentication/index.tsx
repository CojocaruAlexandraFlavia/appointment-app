import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Login from "../../screens/Login/login.screen";
import Register from "../../screens/Register/register.screen";
import {StackNavigatorParamList} from "../navigator.types";
import {Drawer} from "../drawer";
import Salons from "../../screens/Salon";
import {ConfirmAppointment} from "../../screens/Appointments/Confirm appointment/confirm-appointment.screen";
import Appointments from "../../screens/Appointments/See appointments";
import Reviews from "../../screens/Reviews"
import Profile from "../../screens/Profile/See Profile";
import Notifications from "../../screens/Notifications";
import AddSalon from "../../screens/Salon/add-salon.screen";
import HomeAdmin from "../../screens/Home/Home Admin/home-admin.screen";

const Stack = createNativeStackNavigator<StackNavigatorParamList>();

export const Authentication = () => {

    return(
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register"  component={Register}/>
            <Stack.Screen name="Drawer" component={Drawer}/>
            <Stack.Screen name="Salons" component={Salons} />
            <Stack.Screen name="ConfirmAppointment" component={ConfirmAppointment} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Appointments" component={Appointments} />
            <Stack.Screen name="Reviews" component={Reviews} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="AddSalon" component={AddSalon}/>
            <Stack.Screen name="HomeAdmin" component={HomeAdmin}/>
        </Stack.Navigator>
    )

}