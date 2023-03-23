import {Avatar, Box, Center, FlatList, Heading, HStack, Pressable, VStack} from "native-base";
import { useState } from "react";
import { Rating } from "react-native-ratings";
import { Salon } from "../utils/Types";
import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import {salons} from "../utils/Constants";

const Drawer = createDrawerNavigator();
function Home({navigation}: any) {

    const [mockData, setMockData] = useState<Salon[]>(salons)

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

export default function HomeClient() {
    return (
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        </Drawer.Navigator>
    );
}