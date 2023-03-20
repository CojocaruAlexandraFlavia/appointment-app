import { Link } from "@react-navigation/native";
import { Avatar, Box, Center, FlatList, Heading, HStack, Text, VStack } from "native-base";
import { ReactElement, useState } from "react";
import { Rating } from "react-native-ratings";
import { Salon } from "../utils/Types";

const HomeClient = ({navigation}: any): ReactElement => {

    const [salons, setSalons] = useState<Salon[]>([])

    const mockData: Salon[] = [
        {
            id: 1,
            name: "Salon1",
            phoneNumber: "089878987",
            rating: 4.5,
            location: "Str. 1, Nr.1",
            images: ["https://cdn1.treatwell.net/images/view/v2.i5059481.w720.h480.x57F4036F/", "img2"]
        },
        {
            id: 2,
            name: "Salon2",
            phoneNumber: "089878987",
            rating: 3.5,
            location: "Str. 1, Nr.1",
            images: ["https://cdn1.treatwell.net/images/view/v2.i5059481.w720.h480.x57F4036F/", "img2"]
        },
    ]

    return (
        <Center w="100%">
            <Box safeArea p="2" py="8" w="100%" maxW="290">
                <Heading size={"lg"} mb={4} alignSelf={"center"}>Salons</Heading>
                <FlatList data={mockData} renderItem={({item}) => 
                    // <Link to={{screen: 'Salon', params: {id: item.id}}}>
                        <Box borderBottomWidth="1" _dark={{ borderColor: "muted.50"}} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                            <HStack space={"sm"}>
                                <Avatar size="48px" source={{uri: item.images[0]}} mr={7}/>
                                <VStack>
                                    <Link style={{alignSelf:"center", fontSize:20}} to={{screen: 'Salon', params: {id: item.id}}}>{item.name}</Link>
                                    <Rating type="custom" startingValue={item.rating}  imageSize={25} readonly />
                                </VStack>
                            </HStack>
                        </Box>
                    // </Link> 
                    }>
                </FlatList>
            </Box>
        </Center>
    )
}

export default HomeClient