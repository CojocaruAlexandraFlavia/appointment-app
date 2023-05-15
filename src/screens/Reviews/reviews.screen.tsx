import {Box, Center, FlatList, Heading, HStack, ScrollView, Spacer, Text, View, VStack} from "native-base";
import * as React from "react";
import {ReactElement, useCallback, useEffect, useState} from "react";
import {Rating} from "react-native-ratings";
import {Review, Salon, User} from "../../utils/types";
import {ListRenderItemInfo} from 'react-native';
import 'react-native-gesture-handler';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {ReviewsScreenRouteProp} from "../../navigation/navigator.types";
import {useRoute} from "@react-navigation/native";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {firestore} from "../../utils/firebase";
import {useUserDataContext} from "../../store/user-data.context";
import {SalonClass, salonConverter} from "../Salon/salon.class";
import {userConverter} from "../Profile/user.class";
import {ReviewClass} from "../Salon/review.class";
import salon from "../Salon";

export const Reviews: React.FC = (): ReactElement => {

    // const [reviews, setReviews] = useState<Review[]>([])
    const [error, setError] = useState(null)
    const [filteredSalons, setFilteredSalons] = useState<Salon[]>([])

    const {user} = useUserDataContext()

    const retrieveSalonsWithReviews = async () => {
        let firestoreSalons: SalonClass[] = []

        try {
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
                    phoneNumber: "",
                    location: "",
                    rating: salon.rating,
                    endTime: "",
                    images: [],
                    startTime: "",
                    // @ts-ignore
                    reviews: reviewList
                })
            }
            setFilteredSalons(salonList)
    } catch (e: any) {
        console.log("Error at retrieving reviews: " + e)
        setError(e)
        }
    }

    useEffect(() => {
            retrieveSalonsWithReviews()
    }, [])

    const renderItemReview = useCallback(({item}: ListRenderItemInfo<Review>) =>
        (
                <Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                    <HStack space={[3, 4]} justifyContent="space-between">
                        <MaterialCommunityIcons alignSelf={"center"} name="hair-dryer-outline" size={24} color="black" />
                        <VStack alignItems={"flex-start"}>
                            <Rating type="custom" startingValue={item.stars} imageSize={16} readonly />
                            <Text style={{fontSize:13}}>{item.message}</Text>
                        </VStack>
                        <Spacer />
                    </HStack>
                </Box>
        ), [])

    return(
        <Center w="100%">
            <ScrollView>
                {
                    filteredSalons.map((salon, index) => <View key={index}>
                            <Text style={{fontSize:15}} mb={1}> {"SalonName: " + salon.name} </Text>
                            <ScrollView horizontal={true}>
                                <FlatList data={salon.reviews} renderItem={renderItemReview} keyExtractor={item => item.id.toString()} />
                            </ScrollView>
                        </View>
                    )
                }
            </ScrollView>
        </Center>
    )
}