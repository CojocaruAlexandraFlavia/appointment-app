import React, {useState} from "react";
import {salons} from "../../utils/Constants";
import {Avatar, useTheme} from "react-native-paper";
import HomeClient from "../../screens/Home/Home Client/home-client.screen";
import {HStack, Input} from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import {View} from "react-native-animatable";
import {TouchableOpacity} from "react-native-gesture-handler";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StackNavigatorParamList} from "../navigator.types";

const HomeStack = createNativeStackNavigator<StackNavigatorParamList>();

export const HomeStackScreen = ({navigation}: any) => {

    const [allHomePageSalons, setAllHomePageSalons] = useState(salons)
    const [filteredSalons, setFilteredSalons] = useState(allHomePageSalons)

    const onChangeSearchInput = (text: String) => {
        if (text !== "") {
            const filteredSalons = allHomePageSalons.filter(salon => salon.name.toLowerCase().includes(text.toLowerCase()))
            setFilteredSalons(filteredSalons)
        } else {
            setFilteredSalons(allHomePageSalons)
        }

    }

    const {colors} = useTheme();
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background
                },
                headerTintColor: "#000",
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <HomeStack.Screen
                name="HomeClient"
                children={() => <HomeClient data={filteredSalons} navigation={navigation}/>}
                options={{
                    title: '',
                    headerLeft: () => (
                        <HStack style={{marginLeft: 10}}>
                            <Icon.Button
                                name="ios-menu"
                                size={25}
                                color="#000"
                                backgroundColor={colors.background}
                                onPress={() => navigation.openDrawer()}
                            />
                            <Input variant="underlined" onChangeText={onChangeSearchInput} placeholder='Find a salon'
                                   _focus={{backgroundColor: "gray.50", borderColor: "none"}} width={'72%'}
                                   InputRightElement={
                                       <Icon
                                           name="ios-search"
                                           size={15}
                                           color="#000"/>}/>
                        </HStack>
                    ),
                    headerRight: () => (
                        <View style={{flexDirection: 'row', marginRight: 10}}>
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