import {Box, Center, Text} from "native-base";
import React from "react";
import {useRoute} from "@react-navigation/native";
import {ConfirmAppointmentRouteProp} from "../../../navigation/navigator.types";

export const ConfirmAppointment = () => {

    const route = useRoute<ConfirmAppointmentRouteProp>()
    const { service, time, date } = route.params;


    return(
        <Center w="100%">
            <Box safeArea p="2" py="8" w="100%" maxW="290">
                <Text>{date}</Text>
                <Text>{time}</Text>
                <Text>{service}</Text>
            </Box>
        </Center>
    )

}