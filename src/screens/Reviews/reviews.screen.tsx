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

export const Reviews: React.FC = ({navigation}: any): ReactElement => {

    const [reviews] = useState<Review[]>([
        {
            id: "1",
            stars: 4,
            message: "superb",
            client: {
                id: "2",
                email: "email@email.com",
                firstName: "John",
                lastName: "Smith",
                phoneNumber: "+343654765",
                role: "CLIENT",
                profilePicture: "img1",
                city: "Bucharest"
            }
        },
        {
            id: "2",
            stars: 5,
            message: "professional team",
            client: {
                id: "1",
                email: "email@email.com",
                firstName: "Maria",
                lastName: "K",
                phoneNumber: "+343654765",
                role: "CLIENT",
                profilePicture: "img2",
                city: "Brasov"
            }
        }
    ])

    const route = useRoute<ReviewsScreenRouteProp>()

    const renderItemReview = useCallback(({item}: ListRenderItemInfo<Review>) => (<Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}}
                                                                                       borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
        <HStack space={[2, 3]} justifyContent="space-between">
            <Avatar alignSelf={"center"} size="48px" source={{uri: item.client.profilePicture}} />
            <VStack alignItems={"flex-start"}>
                <Text mb={1}> {item.client.firstName} {item.client.lastName} </Text>
                <Rating type="custom" startingValue={item.stars} imageSize={15} readonly />
                <Text style={{fontSize:12}}>{item.message}</Text>
            </VStack>
            <Spacer />
        </HStack>
    </Box>), [])

    return(
        <Center w="100%">
                {/*<Heading italic bold alignSelf={"center"} mb={2}>Reviews</Heading>*/}
                <FlatList data={reviews} renderItem={renderItemReview} keyExtractor={item => item.id.toString()} />
        </Center>
    )

}