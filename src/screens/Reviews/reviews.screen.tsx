import {Avatar, Box, Button, Center, FlatList, FormControl, Heading, HStack, Icon, Link, Modal, Radio, ScrollView, SectionList, Spacer, Text, VStack, WarningOutlineIcon
} from "native-base";
import {ReactElement, useCallback, useEffect, useState} from "react";
import { Rating } from "react-native-ratings";
import {Review, Salon, ServicesListData, ServiceWithTime} from "../../utils/types";
import * as React from 'react';
import {Linking, ListRenderItemInfo, SectionListData, SectionListRenderItemInfo, View} from 'react-native';
import 'react-native-gesture-handler';
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import {ReviewsScreenRouteProp} from "../../navigation/navigator.types";
import {useRoute} from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const Reviews: React.FC = ({navigation}: any): ReactElement => {

    const [reviews] = useState<Review[]>([
        {
            salonName:"Salon Salon1",
            id: "1",
            stars: 4,
            message: "Superb, I had an amazing experience at this salon!",
            client: {
                id: "2",
                email: "email@email.com",
                firstName: "John",
                lastName: "Smith",
                phoneNumber: "+343654765",
                role: "CLIENT",
                profilePicture: 'https://as1.ftcdn.net/v2/jpg/01/16/24/44/1000_F_116244459_pywR1e0T3H7FPk3LTMjG6jsL3UchDpht.jpg',
                city: "Bucharest"
            }
        },
        {
            salonName:"Salon Salon2",
            id: "2",
            stars: 4.5,
            message: "professional team and relaxing atmosphere",
            client: {
                id: "1",
                email: "email@email.com",
                firstName: "Maria",
                lastName: "Kim",
                phoneNumber: "+343654765",
                role: "CLIENT",
                profilePicture: 'https://as1.ftcdn.net/v2/jpg/01/16/24/44/1000_F_116244459_pywR1e0T3H7FPk3LTMjG6jsL3UchDpht.jpg',
                city: "Brasov"
            }
        }
    ])

    const route = useRoute<ReviewsScreenRouteProp>()

    const renderItemReview = useCallback(({item}: ListRenderItemInfo<Review>) =>
        (
            <ScrollView>
                <Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                    <HStack space={[3, 4]} justifyContent="space-between">
                        {/*<Avatar alignSelf={"center"} size="48px" source={{uri: item.client.profilePicture}} />*/}
                        <MaterialCommunityIcons alignSelf={"center"} name="hair-dryer-outline" size={24} color="black" />
                        <VStack alignItems={"flex-start"}>
                            {/*<Text mb={1}> {item.client.firstName} {item.client.lastName} </Text>*/}
                            <Text style={{fontSize:15}} mb={1}> {"SalonName: ..."} </Text>
                            <Rating type="custom" startingValue={item.stars} imageSize={16} readonly />
                            <Text style={{fontSize:13}}>{item.message}</Text>
                        </VStack>
                        <Spacer />
                    </HStack>
                </Box>
            </ScrollView>
        ), [])

    return(
        <Center w="100%">
                {/*<Heading italic bold alignSelf={"center"} mt={3} mb={4}>My Reviews</Heading>*/}
                <FlatList data={reviews} renderItem={renderItemReview} keyExtractor={item => item.id.toString()} />
        </Center>
    )
}