import { Link } from "@react-navigation/native";
import { Avatar, Box, Center, FlatList, Heading, HStack, Text, VStack } from "native-base";
import { ReactElement, useState } from "react";
import { Rating } from "react-native-ratings";
import { Salon } from "../utils/Types";
import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function Home({navigation}: any) {

    const [salons, setSalons] = useState<Salon[]>([])

    const mockData: Salon[] = [
        {
            id: 1,
            name: "Salon1",
            phoneNumber: "089878987",
            rating: 4.5,
            location: "Str. 1, Nr.1",
            images: ["img1", "img2"]
        },
        {
            id: 2,
            name: "Salon2",
            phoneNumber: "089878987",
            rating: 3.5,
            location: "Str. 1, Nr.1",
            images: ["img1", "img2"]
        },
    ]

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Box safeArea p="2" py="8" w="100%" maxW="290">                
                <Heading size={"lg"} mb={4} alignSelf={"center"}>Salons</Heading>
                <FlatList data={mockData} renderItem={({item}) => 
                    // <Link to={{screen: 'Salon', params: {id: item.id}}}>
                        <Box borderBottomWidth="1" _dark={{ borderColor: "muted.50"}} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                            <HStack space={"sm"} justifyContent="space-between">
                                {/* <Avatar size="48px" source={{uri: item.images[0]}} /> */}
                                <VStack>
                                    <Text fontSize={"xl"}>{item.name}</Text>
                                    <Rating type="custom" startingValue={item.rating}  imageSize={30} readonly />
                                    {/* <Text>{item.phoneNumber}</Text> */}
                                </VStack>
                                {/* <Button height={'10'} onPress={() => navigation.navigate('Salon', {id: item.id})}>See details</Button> */}
                                <Link style={{alignSelf:"center"}} to={{screen: 'Salon', params: {id: item.id}}}>See details</Link>
                            </HStack>
                        </Box>
                    // </Link> 
                    }>
                </FlatList>
            </Box>
        </View>
    )
}

function NotificationsScreen({navigation}: any) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={() => navigation.goBack()} title="Go back home" />
      </View>
    );
}

export default function HomeClient() {
    return (
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        </Drawer.Navigator>

    );
}