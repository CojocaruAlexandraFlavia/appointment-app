import {Avatar, Box, Center, FlatList, Heading, HStack, Pressable, VStack} from "native-base";
import {useCallback, useEffect, useState} from "react";
import {Rating} from "react-native-ratings";
import {Salon} from "../../../utils/types";
import 'react-native-gesture-handler';
import React from 'react'
import {Image, ListRenderItemInfo, StyleSheet, Text, View} from "react-native";

type Props = {
    data: Salon[],
    navigation: any
}

const HomeClient = ({data, navigation}: Props) => {

    const [allSalons, setAllSalons] = useState<Salon[]>(data)

    useEffect(() => {
        setAllSalons(data)
    }, [data])


    const renderItem = useCallback(({item}: ListRenderItemInfo<Salon>) => <Pressable
        onPress={() => navigation.navigate('Salon', {id: item.id})}>
        <Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}} borderColor="muted.800" pl={["0", "4"]}
             pr={["0", "5"]} py="2">
            <HStack space={"sm"}>
                <Avatar size="48px" source={{uri: item.images[0]}} mr={7}/>
                <VStack>
                    <Heading style={{alignSelf: "center", fontSize: 20}}>{item.name}</Heading>
                    <Rating type="custom" startingValue={item.rating} imageSize={25} readonly/>
                </VStack>
            </HStack>
        </Box>
    </Pressable>, [])


    const [showText, setShowText] = useState(true)
    useEffect(()=> {
        const interval = setInterval(() => {
            setShowText( (showText) => !showText)
        }, 1000) //1000 = 1s
        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <Center w="100%">
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('../../../../assets/logo.png')}
                />
            </View>
            <Box safeArea p="3" py="1" w="100%" maxW="290">
                <Heading size={"lg"} mb={4} alignSelf={"center"}>Salons</Heading>
                {
                    allSalons.length > 0 ?
                        <FlatList data={allSalons} renderItem={renderItem} keyExtractor={item => item.id.toString()}>
                        </FlatList> : null
                }
                <Text style={[ styles.AdvertisementText,  {display: showText ? 'none' : 'flex'} ]} >Book now an appointment!
                </Text>
            </Box>
        </Center>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 10
    },
    logo: {
        width: 135,
        height: 150,
        alignSelf: 'center'
    },
    AdvertisementText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#FF5733'
    },
});

export default HomeClient;