import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Avatar, Title, Caption, Drawer} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeClient from '../../screens/Home/Home Client/home-client.screen';
import Profile from '../../screens/Profile/See Profile/profile.screen';
import Appointments from '../../screens/Appointments/See appointments/appointments.screen';
import Reviews from '../../screens/Reviews/reviews.screen';

export const DrawerContent = (props:any) => {

    const paperTheme = useTheme();

    //const { signOut } = React.useContext(AuthContext);

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar.Image
                                source={{
                                    uri:
                                        'https://as1.ftcdn.net/v2/jpg/01/16/24/44/1000_F_116244459_pywR1e0T3H7FPk3LTMjG6jsL3UchDpht.jpg',
                                }}
                                size={50}
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>John Doe</Title>
                                <Caption style={styles.caption}>@j_doe</Caption>
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
                                <Icon name="star" color={color} size={size}/> )}
                            label="Reviews"
                            onPress={() => {props.navigation.navigate('Reviews')}}
                        />
                        <DrawerItem
                            icon={({color, size}:any) => (
                                <Icon name="bell-outline" color={color} size={size}/> )}
                            label="Notifications"
                            onPress={() => {props.navigation.navigate('Notifications')}}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({color, size}:any) => (
                        <Icon name="exit-to-app" color={color} size={size}/> )}
                    label="Logut"
                    onPress={() => {props.navigation.navigate('LoginScreen')}}
                    // onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});