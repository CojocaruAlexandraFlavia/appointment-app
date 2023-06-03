import {collection, doc, getDocs, updateDoc} from "firebase/firestore";
import {firestore} from "../../../utils/firebase";
import {salonConverter} from "../../Salon/salon.class";
import {Salon} from "../../../utils/types";
import React, {useCallback, useEffect, useState} from "react";
import {Avatar, Box, Button, Center, FlatList, Heading, Row, Text, Column, ScrollView, Input} from "native-base";
import {Image, ImageBackground, ListRenderItemInfo, SafeAreaView, StyleSheet, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {Loading} from "../../../components/activity-indicator.component";
import home_adminStyles from "./home-admin.styles"

const HomeAdmin = () => {

    const styles = home_adminStyles()

    const [salons, setSalons] = useState<Salon[]>([])
    const [loading, setLoading] = useState(false)
    const [filteredSalons, setFilteredSalons] = useState<Salon[]>([])

    const retrieveAllSalons = async () => {
        const salonCollectionRef = collection(firestore, "salons").withConverter(salonConverter)
        const salonDocs = await getDocs(salonCollectionRef)

        try {
            let salonList: Salon[] = []
            salonDocs.forEach( documentSnapshot =>  {
                const salon = documentSnapshot.data()
                salonList.push({...salon, images: [salon.image], id: documentSnapshot.id, reviews: []})
            })
            setFilteredSalons(salonList)
            setSalons(salonList)
        } catch (e) {
            console.log("error: " + e)
        }
    }

    const onChangeSearchInput = (text: String) => {
        if (text !== "") {
            const filteredSalons = salons.filter(salon => salon.name.toLowerCase().includes(text.toLowerCase()))
            setFilteredSalons(filteredSalons)
        } else {
            setFilteredSalons(salons)
        }
    }

    const renderItem = useCallback(({item}: ListRenderItemInfo<Salon>) => {
        return (
            <Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}} borderColor="muted.800" py={1}>
                <Row alignItems={"center"}>
                    <Column w="1/4">
                        <Avatar size="md" source={{uri: item.images[0]}}/>
                    </Column>
                    <Column w="1/2">
                        <Heading style={{ fontSize: 15}}>{item.name}</Heading>
                        <Text>{item.address}, {item.city}, {item.country}</Text>
                        <Text>{item.phoneNumber}</Text>
                    </Column>
                    <Column w="1/4">
                        {
                            item.enabled? <Button alignSelf="center" colorScheme="red" onPress={() => changeSalonAvailability(item, false)}>
                                <Icon name="trash-bin"/>
                            </Button>: <Button alignSelf="center" colorScheme="green" onPress={() => changeSalonAvailability(item, true)}>
                                <Icon name="checkmark"/>
                            </Button>
                        }
                    </Column>
                </Row>
            </Box>)
    }, [])

    useEffect(() => {
        retrieveAllSalons()
    }, [])

    const changeSalonAvailability = async (salon: Salon, status: boolean) => {
        try {
            if (salon !== undefined) {
                setLoading(true)
                const salonRef = doc(firestore, "salons", salon.id).withConverter(salonConverter)
                await updateDoc(salonRef, {
                    ...salon,
                    enabled: status
                })
                await retrieveAllSalons()
                setLoading(false)
            }
        } catch (e: any) {
            console.log(e)
        }
    }


    return(
        <ScrollView>
            <Center w="100%">
                <SafeAreaView >
                    <Box safeArea p="5" py="5">
                        {
                            loading && <Loading/>
                        }
                        <View style={styles.container}>
                            <Image style={styles.logo} source={require('../../../../assets/logo.png')} />
                        </View>
                        <Heading paddingTop={3} mb={5} alignSelf="center">Salons</Heading>
                        <Input w={'100%'} mb={4} rounded={"lg"} backgroundColor="white" alignSelf="center" variant="underlined"
                               onChangeText={onChangeSearchInput} px={4} placeholder='Find a salon'
                               _focus={{backgroundColor: "gray.50", borderColor: "none"}}
                               InputRightElement={
                                   <Icon
                                       name="ios-search"
                                       size={25}
                                       color="#000"/>}/>
                        <ScrollView px={4} rounded={"lg"} horizontal={true} backgroundColor={'white'}>
                            <FlatList data={filteredSalons} renderItem={renderItem} keyExtractor={item => item.id.toString()}/>
                        </ScrollView>
                    </Box>
                </SafeAreaView>
            </Center>
        </ScrollView>

    )
}

export default HomeAdmin