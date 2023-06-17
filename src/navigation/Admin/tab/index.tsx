import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import {HomeStackScreen} from "./home-stack-screen";
import Icon from "react-native-vector-icons/Ionicons";
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from "react";
import {AddSalonStackScreen} from "./add-salon-stack-screen";
import {Alert, Modal, Text} from "native-base";
import {getAuth, signOut} from "firebase/auth";
import app from "../../../utils/firebase";
import {useUserDataContext} from "../../../store/user-data.context";

const Tab = createMaterialBottomTabNavigator();

const MainTab = () => (
    <Tab.Navigator screenOptions={{tabBarColor: "pink"}} initialRouteName="HomeStackAdmin" activeColor="#fff">
        <Tab.Screen
            name="HomeStackAdmin"
            component={HomeStackScreen}
            options={{
                tabBarLabel: 'Home',
                tabBarColor: 'black',
                tabBarIcon: ({color}) => (
                    <Icon name="home-outline" color={color} size={26} />
                ),
            }}
        />
        <Tab.Screen
            name="AddSalonStack"
            component={AddSalonStackScreen}
            options={{
                tabBarLabel: 'Add salon',
                tabBarColor: 'black',
                tabBarIcon: ({color}) => (
                    <Icon name={"add-outline"} color={color} size={26} />
                ),
            }}
        />
        {/*<Tab.Screen name={"Logout"}*/}
        {/*            options={{tabBarLabel: 'Logout',*/}
        {/*                tabBarColor: 'black',*/}
        {/*                tabBarIcon: ({color}) => (*/}
        {/*                    <Icon name="exit-outline" color={color} size={26} />*/}
        {/*                ),*/}
        {/*            }}*/}
        {/*            children={() => <LogoutModal show={true}/>}*/}
        {/*/>*/}
    </Tab.Navigator>
)

type LogoutProps = {
    show: boolean
}

const LogoutModal = ({show}: LogoutProps) => {
    return(
        <Alert status={"warning"}>
            <Text>Are you sure you want to logout?</Text>
        </Alert>
    )
}

export default MainTab;