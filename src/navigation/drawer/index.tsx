import {createDrawerNavigator} from "@react-navigation/drawer";
import {DrawerContent} from "./drawer-content";
import MainTab from "../tab";
import Salons from "../../screens/Salon";
import Profile from "../../screens/Profile/See Profile";
import Appointments from "../../screens/Appointments/See appointments";
import Reviews from "../../screens/Reviews"
import Notifications from "../../screens/Notifications";

const DrawerNav = createDrawerNavigator()

export const Drawer = () => {

    return(
        <DrawerNav.Navigator drawerContent={(props: any) => <DrawerContent {...props}/>}>
            <DrawerNav.Screen options={{ headerShown: false }} name="MainTab" component={MainTab} />
            <DrawerNav.Screen name="Salon" component={Salons} />
            <DrawerNav.Screen name="Profile" component={Profile} />
            <DrawerNav.Screen name="Appointments" component={Appointments} />
            <DrawerNav.Screen name="Reviews" component={Reviews} />
            <DrawerNav.Screen name="Notifications" component={Notifications} />
        </DrawerNav.Navigator>
    )

}