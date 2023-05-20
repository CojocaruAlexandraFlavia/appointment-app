import {collection, doc, getDocs, updateDoc} from "firebase/firestore";
import {firestore} from "../../../utils/firebase";
import {salonConverter} from "../../Salon/salon.class";
import {Salon} from "../../../utils/types";
import React, {useCallback, useEffect, useState} from "react";
import {Avatar, Box, Button, Center, FlatList, Heading, Row, Text, Column, ScrollView} from "native-base";
import {Image, ImageBackground, ListRenderItemInfo, SafeAreaView, StyleSheet, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {Loading} from "../../../components/activity-indicator.component";

const HomeAdmin = () => {

    const [salons, setSalons] = useState<Salon[]>([])
    const [loading, setLoading] = useState(false)

    const retrieveAllSalons = async () => {
        const salonCollectionRef = collection(firestore, "salons").withConverter(salonConverter)
        const salonDocs = await getDocs(salonCollectionRef)

        try {
            let salonList: Salon[] = []
            salonDocs.forEach( documentSnapshot =>  {
                const salon = documentSnapshot.data()
                salonList.push({...salon, images: [salon.image], id: documentSnapshot.id, reviews: []})
            })
            setSalons(salonList)
        } catch (e) {
            console.log("error: " + e)
        }
    }

    const renderItem = useCallback(({item}: ListRenderItemInfo<Salon>) => {
        return (
            <Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}} borderColor="muted.800" py="2" w="100%">
                <Row alignItems={"center"}>
                    <Column w="1/4">
                        <Avatar size="48px" source={{uri: item.images[0]}}/>
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

    const styles = StyleSheet.create({
        container: {
            paddingTop: 0,
        },
        logo: {
            width: 125,
            height: 140,
            alignSelf: 'center',
            borderRadius: 200/2
        },
        backgroundImage: {
            flex: 1,
            width: 400,
            // height: null,
            resizeMode: 'cover', // or 'stretch'
            justifyContent: 'center',
            alignItems: 'center',
        }
    });

    return(
        <ScrollView>
        <Center px={4} w="100%">
            <SafeAreaView >
                <ImageBackground  style={styles.backgroundImage} source={require('../../../../assets/background-semi.png')} >
                    <View style={styles.container} >

                        <Box safeArea p="5" py="5" w="100%">
                    {
                        loading && <Loading/>
                    }
                    <View style={styles.container}>
                        <Image style={styles.logo} source={require('../../../../assets/logo.png')} />
                    </View>
                    <Heading paddingTop={3} mb={5} alignSelf="center">Salons</Heading>
                    <FlatList data={salons} renderItem={renderItem} keyExtractor={item => item.id.toString()}/>
                </Box>

                    </View>
                </ImageBackground>
            </SafeAreaView>
        </Center>
        </ScrollView>

    )
}

export default HomeAdmin