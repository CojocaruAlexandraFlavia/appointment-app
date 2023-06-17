import React, {useEffect, useState} from "react";
import {Avatar, useTheme} from "react-native-paper";
import HomeClient from "../../../screens/Home/Home Client/home-client.screen";
import {HStack, Input} from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import {View} from "react-native-animatable";
import {TouchableOpacity} from "react-native-gesture-handler";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StackNavigatorParamList} from "../../navigator.types";
import {collection, getDocs, query, where} from "firebase/firestore";
import {firestore} from "../../../utils/firebase";
import {Salon} from "../../../utils/types";
import {salonConverter} from "../../../screens/Salon/salon.class";
import {useUserDataContext} from "../../../store/user-data.context";

const HomeStack = createNativeStackNavigator<StackNavigatorParamList>();

export const HomeStackScreen = ({navigation}: any) => {

    const [allHomePageSalons, setAllHomePageSalons] = useState<Salon[]>([])
    const [filteredSalons, setFilteredSalons] = useState(allHomePageSalons)
    const [emptySearchResult, setEmptySearchResult] = useState(false)

    const {user} = useUserDataContext()

    const retrieveAllSalons = async () => {
        const salonCollectionRef = collection(firestore, "salons").withConverter(salonConverter)
        const salonDocs = await getDocs(query(salonCollectionRef,
            where("enabled", "==", true)))

        try {
            let salonList: Salon[] = []
            salonDocs.forEach( documentSnapshot =>  {
                const salon = documentSnapshot.data()
                salonList.push({...salon, images: [salon.image], id: documentSnapshot.id, reviews: []})
            })
            setFilteredSalons(salonList)
            setAllHomePageSalons(salonList)
        } catch (e) {
            console.log("error: " + e)
        }
    }

    useEffect(() => {
        retrieveAllSalons().catch(e => console.log("error: " + e))
    }, [])

    const onChangeSearchInput = (text: string) => {
        if (text !== "") {
            const filteredSalons = allHomePageSalons.filter(salon => salon.name.toLowerCase().includes(text.toLowerCase()))
            setEmptySearchResult(filteredSalons.length === 0)
            setFilteredSalons(filteredSalons)
        } else {
            setEmptySearchResult(false)
            setFilteredSalons(allHomePageSalons)
        }
    }

    const {colors} = useTheme();

    return (
        <HomeStack.Navigator
            screenOptions={{
                headerStyle: {backgroundColor: colors.background},
                headerTintColor: "#000",
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                contentStyle: {backgroundColor: '#cda9e6'}
            }}>
            <HomeStack.Screen
                name="HomeClient"
                children={() => <HomeClient data={filteredSalons} navigation={navigation} emptySearchResult={emptySearchResult}/>}
                options={{
                    contentStyle: {backgroundColor: '#cda9e6'},
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
                                    source={{ uri: user.profilePicture }}
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