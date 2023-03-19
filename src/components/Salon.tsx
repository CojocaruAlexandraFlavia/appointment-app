import { Box, Center, Heading, Text } from "native-base";
import { useRoute } from '@react-navigation/native';
import { ReactElement } from "react";
import { SliderBox } from "react-native-image-slider-box";
import { Salon, SalonScreenRouteProp } from "../utils/Types";
import { Rating } from "react-native-ratings";


export const SalonScreen = (): ReactElement => {

    const route = useRoute<SalonScreenRouteProp>()
    const { id } = route.params;

    const salon: Salon = {
        id: id,
        name: "Salon1",
        phoneNumber: "089878987",
        rating: 4.5,
        location: "Str. 1, Nr.1",
        images: ["https://cdn1.treatwell.net/images/view/v2.i5059481.w720.h480.x57F4036F/", 
                "https://www.rd.com/wp-content/uploads/2020/06/GettyImages-1139132195.jpg"]
    }

    return(
        <Center w="100%">
            <Box safeArea p="2" py="8" w="100%" maxW="290"> 
                <Text>{salon.id}</Text>
                <Heading  size={"lg"} mb={4} alignSelf={"center"}>Salon {salon.name}</Heading>
                <SliderBox w="90%" images={salon.images} autoplay circleLoop sliderBoxHeight={120}/>
                <Rating type="custom" startingValue={salon.rating}  imageSize={30} readonly />
                <Text>{salon.phoneNumber}</Text>
            </Box>
        </Center>
    )

}