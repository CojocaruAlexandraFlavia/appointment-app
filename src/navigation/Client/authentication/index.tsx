import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Login from "../../../screens/Login/login.screen";
import Register from "../../../screens/Register/register.screen";
import {StackNavigatorParamList} from "../../navigator.types";
import {Drawer} from "../drawer";
import Salons from "../../../screens/Salon";
import {ConfirmAppointment} from "../../../screens/Appointments/Confirm appointment/confirm-appointment.screen";
import Appointments from "../../../screens/Appointments/See appointments";
import Reviews from "../../../screens/Reviews"
import Profile from "../../../screens/Profile/See Profile";
import Notifications from "../../../screens/Notifications";
import AddSalon from "../../../screens/Salon/add-salon.screen";
import HomeAdmin from "../../../screens/Home/Home Admin/home-admin.screen";
import {useUserDataContext} from "../../../store/user-data.context";
import {Fragment} from "react";
import MainTab from "../../Admin/tab";

const Stack = createNativeStackNavigator<StackNavigatorParamList>();

export const Authentication = () => {

    const { user, setUser } = useUserDataContext()

    return(
        <Stack.Navigator initialRouteName="Login" screenOptions={{
            headerShown: false,
            contentStyle: {backgroundColor: '#cda9e6'}
        }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register"  component={Register}/>
            {
                user.role === "CLIENT"? <Stack.Group>
                    <Stack.Screen name="Drawer" component={Drawer}/>
                    <Stack.Screen name="Salons" component={Salons} />
                    <Stack.Screen name="ConfirmAppointment" component={ConfirmAppointment} />
                    <Stack.Screen name="Profile" component={Profile} />
                    <Stack.Screen name="Appointments" component={Appointments} />
                    <Stack.Screen name="Reviews" component={Reviews} />
                    <Stack.Screen name="Notifications" component={Notifications} />
                </Stack.Group>: <Stack.Group>
                    <Stack.Screen name="HomeAdmin" component={HomeAdmin}/>
                    <Stack.Screen name="AddSalon" component={AddSalon}/>
                    <Stack.Screen name="Tabs" component={MainTab}/>
                </Stack.Group>
            }

        </Stack.Navigator>
    )

}