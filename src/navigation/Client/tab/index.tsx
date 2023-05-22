import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import {HomeStackScreen} from "./home-stack-screen";
import {NotificationStackScreen} from "./notification-stack-screen";
import {ProfileStackScreen} from "./profile-stack-screen";

const Tab = createMaterialBottomTabNavigator();

const MainTab = () => (
        <Tab.Navigator initialRouteName="HomeStackClient" activeColor="#fff">
            <Tab.Screen
                name="HomeStackClient"
                component={HomeStackScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarColor: '#FF6347',
                    tabBarIcon: ({color}) => (
                        <Icon name="ios-home" color={color} size={26} />
                    ),
                }}
            />
            {/*<Tab.Screen*/}
            {/*    name="NotificationsStack"*/}
            {/*    component={NotificationStackScreen}*/}
            {/*    options={{*/}
            {/*        tabBarLabel: 'Updates',*/}
            {/*        tabBarColor: '#FF6347',*/}
            {/*        tabBarIcon: ({color}) => (*/}
            {/*            <Icon name="ios-notifications" color={color} size={26} />*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}
            <Tab.Screen
                name="ProfileStack"
                component={ProfileStackScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarColor: '#694fad',
                    tabBarIcon: ({color}) => (
                        <Icon name="ios-person" color={color} size={26} />
                    ),
                }}
            />

        </Tab.Navigator>
    )

export default MainTab;