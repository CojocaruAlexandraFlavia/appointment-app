import {
    Avatar,
    Box,
    Center,
    Checkbox,
    FlatList,
    Heading,
    HStack,
    Pressable,
    ScrollView,
    Text,
    VStack
} from "native-base";
import {useCallback, useEffect, useRef, useState} from "react";
import {AirbnbRating} from "react-native-ratings";
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
    TouchableWithoutFeedback, SafeAreaView
} from "react-native";
import {useUserDataContext} from "../../../store/user-data.context";
import {Loading} from "../../../components/activity-indicator.component";
import {useIsFocused} from "@react-navigation/native";

type Props = {
    data: Salon[],
    navigation: any,
    emptySearchResult: boolean
}

const HomeClient = ({data, navigation, emptySearchResult}: Props) => {

    const [allSalons, setAllSalons] = useState<Salon[]>(data)
    const [filteredByCity, setFilteredByCity] = useState<Salon[]>(data)
    const [checked, setChecked] = useState(false)
    const [loading, setLoading] = useState(false)

    const isFocused = useIsFocused()

    const { user } = useUserDataContext()

    useEffect(() => {
        if (isFocused) {
            setLoading(true)
            setAllSalons(data)
            const salonsFiltered = data.filter(salon => salon.city === user.city)
            setFilteredByCity(salonsFiltered)
            setLoading(false)
        }
    }, [data, isFocused])

    const renderItem = useCallback(({item}: ListRenderItemInfo<Salon>) => {
        return (<Pressable
            onPress={() =>
                navigation.navigate('Salon', {id: item.id})
            }>
            <Box w={"100%"} borderBottomWidth="1" _dark={{borderColor: "muted.50"}} borderColor="muted.800" py="2">
                <HStack space={"md"}>
                    <Avatar size={"lg"} source={{uri: item.images[0]}} mr={1}/>
                    <VStack alignItems={"center"}>
                        <Heading style={{fontSize: 17}}>{item.name}</Heading>
                        <AirbnbRating showRating={false} ratingContainerStyle={{marginTop: 0}} size={20} defaultRating={item.rating} isDisabled/>
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

    const style = [
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
    ]

    return (
        <ScrollView>
            <Center w="100%">
                <SafeAreaView>
                    <View>
                        <TouchableWithoutFeedback onPress={animateImage}>
                            <Animated.View style={style}>
                                <Image
                                    style={styles.logo}
                                    source={require('../../../../assets/logo.png')}
                                />
                            </Animated.View>
                        </TouchableWithoutFeedback>

                        <Box safeArea p="5" py="5" w="100%">
                            <View style={styles.container}>
                                <Heading size={"lg"} mb={4} marginBottom={4} alignSelf={"center"}>Salons</Heading>
                                <Checkbox mb={3} value={""} onChange={(isSelected) => setChecked(isSelected)}>
                                    <Text>Show salons from your city</Text>
                                </Checkbox>
                                {
                                    emptySearchResult? <Heading>No result for search input</Heading>:
                                        allSalons.length == 0? <Loading/>:
                                            checked && filteredByCity.length == 0? <Heading>No salons in your city...</Heading>:
                                        allSalons.length > 0? <ScrollView px={4} rounded={"lg"} horizontal={true} backgroundColor={'white'}>
                                            <FlatList data={checked? filteredByCity: allSalons} renderItem={renderItem}
                                                      keyExtractor={item => item.id.toString()}/>
                                        </ScrollView>: null
                                }
                            </View>
                        </Box>
                    </View>
                </SafeAreaView>
            </Center>
        </ScrollView>
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
        width: 355,
        height: 870,
        resizeMode: 'cover', // or 'stretch'
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default HomeClient;