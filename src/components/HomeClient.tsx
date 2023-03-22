import {Avatar, Box, Center, FlatList, Heading, HStack, Icon, Pressable, VStack} from "native-base";
import { useState } from "react";
import { Rating } from "react-native-ratings";
import { Salon } from "../utils/Types";
import * as React from 'react';
import { Button, View } from 'react-native';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import {BellOutlined,} from '@ant-design/icons';
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";


const Drawer = createDrawerNavigator();
function Home({navigation}: any) {

    const [salons, setSalons] = useState<Salon[]>([])

    const mockData: Salon[] = [
        {
            id: 1,
            name: "Salon1",
            phoneNumber: "089878987",
            rating: 4.5,
            location: "Str. 1, Nr.1",
            images: ["https://cdn1.treatwell.net/images/view/v2.i5059481.w720.h480.x57F4036F/", "img1"]
        },
        {
            id: 2,
            name: "Salon2",
            phoneNumber: "089878987",
            rating: 3.5,
            location: "Str. 1, Nr.1",
            images: ["https://www.rd.com/wp-content/uploads/2020/06/GettyImages-1139132195.jpg", "img2"]
        },
    ]

    return (
        <Center w="100%">
            <Box safeArea p="2" py="8" w="100%" maxW="290">
                <Heading size={"lg"} mb={4} alignSelf={"center"}>Salons</Heading>
                <FlatList data={mockData} renderItem={({item}) =>
                    <Pressable onPress={() => navigation.navigate('Salon', {id: item.id})}>
                        <Box borderBottomWidth="1" _dark={{ borderColor: "muted.50"}} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                            <HStack space={"sm"}>
                                <Avatar size="48px" source={{uri: item.images[0]}} mr={7}/>
                                <VStack>
                                    <Heading style={{alignSelf:"center", fontSize:20}}>{item.name}</Heading>
                                    <Rating type="custom" startingValue={item.rating}  imageSize={25} readonly />
                                </VStack>
                            </HStack>
                        </Box>
                    </Pressable> }>
                </FlatList>
            </Box>
        </Center>
    )
}

function NotificationsScreen({navigation}: any) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button onPress={() => navigation.goBack()} title="Go back home" />
      </View>
    );
}

function ProfileScreen({navigation}: any) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.goBack()} title="Go back home" />
        </View>
    );
}

function EditScreen({navigation}: any) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.goBack()} title="Go back home" />
        </View>
    );
}

function AppointmentsScreen({navigation}: any) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.goBack()} title="Go back home" />
        </View>
    );
}

function ReviewsScreen({navigation}: any) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.goBack()} title="Go back home" />
        </View>
    );
}

function LogoutScreen({navigation}: any) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.navigate("Login")} title="Logout" />
        </View>
    );
}


export default function HomeClient() {

    return (
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={Home} options={{ drawerIcon: (config: any) =>
                 <Icon size="6" as={AntDesign} name="home" color="black"/>}} />

            <Drawer.Screen name="Notifications" component={NotificationsScreen} options={{ drawerIcon: (config: any) =>
                <Icon size="6" as={AntDesign} name="bells" color="black"/>}} />



            <Drawer.Screen name="Appointments" component={AppointmentsScreen} options={{ drawerIcon: (config: any) =>
                    <Icon size="6" as={AntDesign} name="calendar" color="black"/>}} />

            <Drawer.Screen name="Reviews" component={ReviewsScreen} options={{ drawerIcon: (config: any) =>
                    <Icon size="6" as={AntDesign} name="staro" color="black"/>}} />



            <Drawer.Screen name="Profile" component={ProfileScreen} options={{ drawerIcon: (config: any) =>
                    <Icon size="6" as={AntDesign} name="user" color="black"/>}} />

            <Drawer.Screen name="Edit Profile" component={EditScreen} options={{ drawerIcon: (config: any) =>
                    <Icon size="6" as={AntDesign} name="edit" color="black"/>}} />



            <Drawer.Screen name="Logout" component={LogoutScreen} options={{ drawerIcon: (config: any) =>
                    <Icon size="6" as={Feather} name="log-out" color="black"/>}} />








        </Drawer.Navigator>
    );
}