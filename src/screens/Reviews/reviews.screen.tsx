import {Box, Center, FlatList, Heading, HStack, ScrollView, Spacer, Text, View, VStack} from "native-base";
import * as React from "react";
import {ReactElement, useCallback, useEffect, useState} from "react";
import {Rating} from "react-native-ratings";
import {Review, Salon, User} from "../../utils/types";
import {ImageBackground, ListRenderItemInfo, SafeAreaView, StyleSheet} from 'react-native';
import 'react-native-gesture-handler';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {collection, doc, getDocs, query, where} from "firebase/firestore";
import {firestore} from "../../utils/firebase";
import {useUserDataContext} from "../../store/user-data.context";
import {SalonClass, salonConverter} from "../Salon/salon.class";
import {userConverter} from "../Profile/user.class";
import {Loading} from "../../components/activity-indicator.component";
import { useIsFocused } from "@react-navigation/native";

export const Reviews: React.FC = (): ReactElement => {

    const [error, setError] = useState(null)
    const [filteredSalons, setFilteredSalons] = useState<Salon[]>([])
    const [loading, setLoading] = useState<boolean|undefined>(undefined)

    const {user} = useUserDataContext()
    const isFocused = useIsFocused();

    const retrieveSalonsWithReviews = async () => {
        let firestoreSalons: SalonClass[] = []

        try {
            setLoading(true)
            const collectionRef = collection(firestore, "salons")
            const salonsQuery = query(collectionRef, where("nrOfReviews", ">", 0))
                .withConverter(salonConverter)
            const result = await getDocs(salonsQuery)
            const userDocRef = doc(firestore, "users", user.id).withConverter(userConverter)

            result.forEach(documentSnapshot => {
                const filteredReviews = documentSnapshot.data().reviews.filter(review => review.client.path == userDocRef.path)
                if (filteredReviews.length > 0) {
                    firestoreSalons.push({...documentSnapshot.data(), id: documentSnapshot.id})
                }
            })

            let salonList: Salon[] = []
            // @ts-ignore
            for (const salon of firestoreSalons) {
                let reviewList: Review[] = []
                salon.reviews.forEach(review => reviewList.push({
                    client: {} as User,
                    id: review.id,
                    message: review.message,
                    stars: review.stars
                }))
                // @ts-ignore
                salonList.push({
                    id: salon.id,
                    name: salon.name,
                    rating: salon.rating,
                    // @ts-ignore
                    reviews: reviewList
                })
            }
            setFilteredSalons(salonList)
            setLoading(false)
    } catch (e: any) {
            console.log("Error at retrieving reviews: " + e)
            setError(e)
        }
    }

    useEffect(() => {
        if(isFocused) {
            retrieveSalonsWithReviews()
        }
    }, [isFocused])

    const renderItemReview = useCallback(({item}: ListRenderItemInfo<Review>) =>
        (
                <Box style={{ marginRight: 90,  marginLeft: 10, marginTop:2 }} marginBottom={2} width={200}
                     _dark={{borderColor: "muted.50"}} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                    <HStack space={[4, 5]} justifyContent="space-between">
                        <MaterialCommunityIcons alignSelf={"center"} name="hair-dryer-outline" size={24} color="black" />
                        <VStack alignItems={"flex-start"}>
                            <Rating type="custom" startingValue={item.stars} imageSize={16} readonly />
                            <Text style={{fontSize:13}}>{item.message}</Text>
                        </VStack>
                        <Spacer  />
                    </HStack>
                </Box>
        ), [])

    return(
        <ScrollView style={{backgroundColor: '#cda9e6'}}>
            <Center w="100%" >
                <Box mt={30} p="5" w="90%" backgroundColor={'white'} rounded={15}>
                    {
                        loading && <Loading/>
                    }
                    {
                        loading == false? filteredSalons.length > 0? filteredSalons.map((salon, index) =>
                            <View key={index} borderBottomWidth="1"  marginBottom={2}>
                                <Text italic style={{fontSize:15, fontWeight: 'bold'}} mb={1}> {"Salon name:   " + salon.name} </Text>
                                <ScrollView horizontal={true}>
                                    <FlatList data={salon.reviews} renderItem={renderItemReview} keyExtractor={item => item.id.toString()} />
                                </ScrollView>
                            </View>
                        ): <Heading>You haven't post any review yet..</Heading>: null
                    }
                </Box>
            </Center>
        </ScrollView>
    )
}