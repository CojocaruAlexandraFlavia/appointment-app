import { Avatar, Box, Center, FlatList, Heading, HStack, Text, VStack } from "native-base";
import { ReactElement, useState } from "react";
import StarRating from 'react-native-star-rating';

type Salon = {
    name: string,
    phoneNumber: string,
    rating: number,
    location: string,
    images: string[]
}

const HomeClient = ({navigation}: any): ReactElement => {

    const [salons, setSalons] = useState<Salon[]>([])

    const mockData: Salon[] = [
        {
            name: "Salon1",
            phoneNumber: "089878987",
            rating: 4.5,
            location: "Str. 1, Nr.1",
            images: ["img1", "img2"]
        },
        {
            name: "Salon2",
            phoneNumber: "089878987",
            rating: 3.5,
            location: "Str. 1, Nr.1",
            images: ["img1", "img2"]
        },
    ]

    return (
        <Center w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290">
                <Heading size={"lg"} mb={4} alignSelf={"center"}>Salons</Heading>
                <FlatList data={mockData} renderItem={({item}) => 
                    <Box borderBottomWidth="1" _dark={{ borderColor: "muted.50"}} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                        <HStack space={[2, 3]} justifyContent="space-evenly">
                        <Avatar size="48px" source={{uri: item.images[0]}} />
                        <VStack>
                            <Text>{item.name}</Text>
                            <StarRating rating={item.rating} disabled halfStarEnabled starSize={30} fullStarColor={'red'}/>
                            <Text>{item.phoneNumber}</Text>
                        </VStack>
                        </HStack>
                    </Box>}>

                </FlatList>
            </Box>
        </Center>
    )

}

export default HomeClient