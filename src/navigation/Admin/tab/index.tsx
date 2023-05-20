import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import {HomeStackScreen} from "./home-stack-screen";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import {AddSalonStackScreen} from "./add-salon-stack-screen";

const Tab = createMaterialBottomTabNavigator();

const MainTab = () => (
    <Tab.Navigator initialRouteName="HomeStackAdmin" activeColor="#fff">
        <Tab.Screen
            name="HomeStackAdmin"
            component={HomeStackScreen}
            options={{
                tabBarLabel: 'Home',
                tabBarColor: '#FF6347',
                tabBarIcon: ({color}) => (
                    <Icon name="ios-home" color={color} size={26} />
                ),
            }}
        />
        <Tab.Screen
            name="AddSalonStack"
            component={AddSalonStackScreen}
            options={{
                tabBarLabel: 'Add salon',
                tabBarColor: '#FF6347',
                tabBarIcon: ({color}) => (
                    <Icon name="add" color={color} size={26} />
                ),
            }}
        />
    </Tab.Navigator>
)

export default MainTab;