import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Title, Caption, Drawer} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeClient from '../../../screens/Home/Home Client';
import Profile from '../../../screens/Profile/See Profile';
import Appointments from '../../../screens/Appointments/See appointments';
import Reviews from '../../../screens/Reviews';
import Notifications from '../../../screens/Notifications';
import {useUserDataContext} from "../../../store/user-data.context";
import {getAuth, signOut} from 'firebase/auth';
import app from "../../../utils/firebase";
import drawer_contentStyles from "./drawer-content.style";

export const DrawerContent = (props:any) => {

    const styles = drawer_contentStyles()

    const { user, setUser } = useUserDataContext()

    const logout = () => {
        setUser({})
        signOut(getAuth(app)).then(() => props.navigation.navigate('Login'))
    }

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar.Image
                                source={ !user.profilePicture? { uri: 'https://as1.ftcdn.net/v2/jpg/01/16/24/44/1000_F_116244459_pywR1e0T3H7FPk3LTMjG6jsL3UchDpht.jpg'}:
                                    { uri: user.profilePicture} }
                                size={50}
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>{`${user.firstName} ${user.lastName}`}</Title>
                                <Caption style={styles.caption}>{user.username}</Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({color, size}:any) => (
                                <Icon name="home-outline" color={color} size={size}/> )}
                            label="Home"
                            onPress={() => {props.navigation.navigate('HomeClient')}}
                        />
                        <DrawerItem
                            icon={({color, size}:any) => (
                                <Icon name="account-outline" color={color} size={size} /> )}
                            label="Profile"
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        <DrawerItem
                            icon={({color, size}:any) => (
                                <Icon name="calendar" color={color} size={size}/> )}
                            label="Appointments"
                            onPress={() => {props.navigation.navigate('Appointments')}}
                        />
                        <DrawerItem
                            icon={({color, size}:any) => (
                                <Icon name="star-outline" color={color} size={size}/> )}
                            label="Reviews"
                            onPress={() => {props.navigation.navigate('Reviews')}}
                        />
                        {/*<DrawerItem*/}
                        {/*    icon={({color, size}:any) => (*/}
                        {/*        <Icon name="bell-outline" color={color} size={size}/> )}*/}
                        {/*    label="Notifications"*/}
                        {/*    onPress={() => {props.navigation.navigate('Notifications')}}*/}
                        {/*/>*/}
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>

            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({color, size}:any) => (
                        <Icon name="exit-to-app" color={color} size={size}/> )}
                    label="Logout"
                    onPress={logout}
                />
            </Drawer.Section>
        </View>
    );
}