import React from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeClient from './HomeClient';
import NotificationScreen from './NotificationScreen';
import ExploreScreen from './ExploreScreen';
import Profile from './Profile';
import EditProfile from './EditProfile';

import {useTheme, Avatar} from 'react-native-paper';
import {View} from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NavigationContainer} from "@react-navigation/native";

const HomeStack = createStackNavigator();
const NotificationStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTab = () => (
        <Tab.Navigator initialRouteName="Profile" activeColor="#fff">
            <Tab.Screen
                name="HomeClient"
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
                name="Notifications"
                component={NotificationStackScreen}
                options={{
                    tabBarLabel: 'Updates',
                    tabBarColor: '#FF6347',
                    tabBarIcon: ({color}) => (
                        <Icon name="ios-notifications" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStackScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarColor: '#694fad',
                    tabBarIcon: ({color}) => (
                        <Icon name="ios-person" color={color} size={26} />
                    ),
                }}
            />
            {/*<Tab.Screen*/}
            {/*    name="ExploreScreen"*/}
            {/*    component={ExploreScreen}*/}
            {/*    options={{*/}
            {/*        tabBarLabel: 'Explore',*/}
            {/*        tabBarColor: '#d02860',*/}
            {/*        tabBarIcon: ({color}) => (*/}
            {/*            <Icon name="ios-aperture" color={color} size={26} />*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}
        </Tab.Navigator>
);

export default MainTab;

const HomeStackScreen = ({navigation}:any) => {
    const {colors} = useTheme();
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background,
                    shadowColor: colors.background, // iOS
                    elevation: 0, // Android
                },
                headerTintColor: "#000",
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <HomeStack.Screen
                name="HomeClient"
                component={HomeClient}
                options={{
                    title: 'Find a salon',
                    headerLeft: () => (
                        <View style={{marginLeft: 10}}>
                            <Icon.Button
                                name="ios-menu"
                                size={25}
                                color="#000"
                                backgroundColor={colors.background}
                                onPress={() => navigation.openDrawer()}
                            />
                        </View>
                    ),
                    headerRight: () => (
                        <View style={{flexDirection: 'row', marginRight: 10}}>
                            <Icon.Button
                                name="ios-search"
                                size={25}
                                color="#000"
                                backgroundColor={colors.background}
                                onPress={() => {}}
                            />
                            <TouchableOpacity
                                style={{paddingHorizontal: 10, marginTop: 5}}
                                onPress={() => {
                                    navigation.navigate('Profile');
                                }}>
                                <Avatar.Image
                                    source={{
                                        uri:
                                            'https://as1.ftcdn.net/v2/jpg/01/16/24/44/1000_F_116244459_pywR1e0T3H7FPk3LTMjG6jsL3UchDpht.jpg',
                                    }}
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />

        </HomeStack.Navigator>
    );
};

const NotificationStackScreen = ({navigation}:any) => (
    <NotificationStack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: '#FF6347',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}>
        <NotificationStack.Screen
            name="Notifications"
            component={NotificationScreen}
            options={{
                headerLeft: () => (
                    <Icon.Button
                        name="ios-menu"
                        size={25}
                        backgroundColor="#FF6347"
                        onPress={() => navigation.openDrawer()}
                    />
                ),
            }}
        />
    </NotificationStack.Navigator>
);

const ProfileStackScreen = ({navigation}:any) => {
    const {colors} = useTheme();

    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background,
                    shadowColor: colors.background, // iOS
                    elevation: 0, // Android
                },
                headerTintColor: "#000",
            }}>
            <ProfileStack.Screen
                name="Profile"
                component={Profile}
                options={{
                    title: '',
                    headerLeft: () => (
                        <View style={{marginLeft: 10}}>
                            <Icon.Button
                                name="ios-menu"
                                size={25}
                                backgroundColor={colors.background}
                                color="#000"
                                onPress={() => {
                                    console.log(navigation)
                                    navigation?.openDrawer()
                                }}
                            />
                        </View>
                    ),
                    headerRight: () => (
                        <View style={{marginRight: 10}}>
                            <MaterialCommunityIcons.Button
                                name="account-edit"
                                size={25}
                                backgroundColor={colors.background}
                                color="#000"
                                onPress={() => navigation.navigate('EditProfile')}
                            />
                        </View>
                    ),
                }}
            />
            <ProfileStack.Screen
                name="EditProfile"
                options={{
                    title: 'Edit Profile',
                }}
                component={EditProfile}
            />
        </ProfileStack.Navigator>
    );
};