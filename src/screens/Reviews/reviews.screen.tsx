import {Box, Center, FlatList, Heading, HStack, ScrollView, Spacer, Text, View, VStack} from "native-base";
import * as React from "react";
import {ReactElement, useCallback, useEffect, useState} from "react";
import {Rating} from "react-native-ratings";
import {Review, Salon, User} from "../../utils/types";
import {ListRenderItemInfo} from 'react-native';
import 'react-native-gesture-handler';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {collection, doc, getDocs, query, where} from "firebase/firestore";
import {firestore} from "../../utils/firebase";
import {useUserDataContext} from "../../store/user-data.context";
import {SalonClass, salonConverter} from "../Salon/salon.class";
import {userConverter} from "../Profile/user.class";
import {Loading} from "../../components/activity-indicator.component";
import {useIsFocused} from "@react-navigation/native";
import reviewsStyles from "./reviews.styles"

export const Reviews: React.FC = (): ReactElement => {

    const styles = reviewsStyles()

    const [error, setError] = useState(null)
    const [filteredSalons, setFilteredSalons] = useState<Salon[]>([])
    const [loading, setLoading] = useState<boolean|undefined>(undefined)

    const {user} = useUserDataContext()
    const isFocused = useIsFocused();

    const retrieveSalonsWithReviews = async () => {
        try {
            setLoading(true)
            const collectionRef = collection(firestore, "salons")
            const salonsQuery = query(collectionRef, where("nrOfReviews", ">", 0))
                .withConverter(salonConverter)
            const result = await getDocs(salonsQuery)
            const userDocRef = doc(firestore, "users", user.id).withConverter(userConverter)

            let salonList: Salon[] = []
            result.forEach(documentSnapshot => {
                const filteredReviews = documentSnapshot.data().reviews.filter(review => review.client.path == userDocRef.path)
                if (filteredReviews.length > 0) {
                    let newReviewList: Review[] = []
                    filteredReviews.map(filteredReview => newReviewList.push({id: filteredReview.id, message: filteredReview.message, stars: filteredReview.stars, client: {} as User}))
                    salonList.push({...documentSnapshot.data(), id: documentSnapshot.id, reviews: newReviewList, images: []})
                }
            })

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
                            <View key={salon.id} borderBottomWidth="1"  marginBottom={2}>
                                <Text italic style={{fontSize:15, fontWeight: 'bold'}} mb={1}> {"Salon name:   " + salon.name} </Text>
                                    <FlatList scrollEnabled={false} data={salon.reviews} renderItem={renderItemReview} keyExtractor={item => item.id.toString()} />
                            </View>
                        ): <Heading>You haven't post any review yet..</Heading>: null
                    }
                </Box>
            </Center>
        </ScrollView>

    )
}