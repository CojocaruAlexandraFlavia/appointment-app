import {createDrawerNavigator} from "@react-navigation/drawer";
import {DrawerContent} from "./drawer-content";
import MainTab from "../tab";
import {SalonScreen} from "../../screens/Salon/salon.screen";

const DrawerNav = createDrawerNavigator()

export const Drawer = () => {

    return(
        <DrawerNav.Navigator drawerContent={(props: any) => <DrawerContent {...props}/>}>
            <DrawerNav.Screen options={{ headerShown: false }} name="HomeDrawer" component={MainTab} />
            <DrawerNav.Screen name="Salon" component={SalonScreen} />
        </DrawerNav.Navigator>
    )

}