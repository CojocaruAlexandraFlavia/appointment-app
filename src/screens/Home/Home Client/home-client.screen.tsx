import {Avatar, Box, Center, FlatList, Heading, HStack, Pressable, VStack} from "native-base";
import {useCallback, useEffect, useRef, useState} from "react";
import {Rating} from "react-native-ratings";
import {Salon} from "../../../utils/types";
import 'react-native-gesture-handler';
import React from 'react'
import {
    Animated,
    useAnimatedValue,
    Image,
    ListRenderItemInfo,
    StyleSheet,
    View,
    TouchableWithoutFeedback, SafeAreaView, ImageBackground
} from "react-native";

type Props = {
    data: Salon[],
    navigation: any
}

const HomeClient = ({data, navigation}: Props) => {

    const [allSalons, setAllSalons] = useState<Salon[]>(data)

    useEffect(() => {
        setAllSalons(data)
    }, [data])


    const renderItem = useCallback(({item}: ListRenderItemInfo<Salon>) => {
        return (<Pressable
            onPress={() =>
                navigation.navigate('Salon', {id: item.id})
            }>
            <Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}} borderColor="muted.800" py="2">
                <HStack space={"md"}>
                    <Avatar size="48px" source={{uri: item.images[0]}} mr={7}/>
                    <VStack>
                        <Heading style={{alignSelf: "center", fontSize: 15}}>{item.name}</Heading>
                        <Rating type="custom" startingValue={item.rating} imageSize={25} readonly/>
                    </VStack>
                </HStack>
            </Box>
        </Pressable>)
    }, [])

    const yPosition = useRef(new Animated.Value(0)).current;
    const xPosition = useRef(new Animated.Value(0)).current;
    const fadeAnim = useAnimatedValue(0)

    const animateImage = () => {
        Animated.timing(yPosition, {
            toValue: 100,
            useNativeDriver: true,
            duration: 1000,
        }).start(() => {
            Animated.timing(yPosition, {
                toValue: 0,
                useNativeDriver: true,
                duration: 500,
            }).start(() => {
                animateImage();
            });
        });
    };

    return (
        <Center w="100%">
            <SafeAreaView >
                <ImageBackground  style={styles.backgroundImage} source={require('../../../../assets/background-semi.png')} >
                    <View style={styles.container} >

                        <TouchableWithoutFeedback onPress={animateImage}>
                            <Animated.View
                                style={[
                                    {
                                        opacity: fadeAnim.interpolate({
                                            inputRange: [0, 100],
                                            outputRange: [1, 0],
                                        }),
                                        transform: [
                                            {
                                                translateY: yPosition,
                                            },
                                            {
                                                translateX: xPosition,
                                            },
                                        ],
                                    },
                                ]}
                            >
                                    <Image
                                        style={styles.logo}
                                        source={require('../../../../assets/logo.png')}
                                    />
                            </Animated.View>
                        </TouchableWithoutFeedback>

                        <Box safeArea p="3" py="12" w="100%" maxW="290">
                            <View style={styles.container}>
                                <Heading size={"lg"} mb={4} marginBottom={4} alignSelf={"center"}>Salons</Heading>
                                {
                                    allSalons.length > 0 ?
                                        <FlatList data={allSalons} renderItem={renderItem} keyExtractor={item => item.id.toString()}/>: null
                                }
                            </View>
                        </Box>

                    </View>
                </ImageBackground>
            </SafeAreaView>
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
        alignSelf: 'center',
        borderRadius: 200/2,
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

export default HomeClient;