import {Box, Button, Center, Container, Heading, HStack, Modal, Text, View} from "native-base";
import React, {useEffect, useState} from "react";
import {Alert, StyleSheet} from "react-native";
import {useRoute} from "@react-navigation/native";
import {ConfirmAppointmentRouteProp} from "../../../navigation/navigator.types";
import {salons} from "../../../utils/Constants";
import {useUserDataContext} from "../../../store/UserData.context";
import {Loading} from "../../../components/activity-indicator.component";

export const ConfirmAppointment = () => {

    const route = useRoute<ConfirmAppointmentRouteProp>()
    const { service, time, date, idSalon } = route.params;

    const { user, setUser } = useUserDataContext()

    const [salonName, setSalonName] = useState("")
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)

    useEffect(() => {
        const salon = salons.filter(salon => salon.id = idSalon)[0]
        setSalonName(salon.name)
    }, [])

    const confirmAppointment = () => {

        //TODO save appointment
        setShowConfirmationModal(true)
        setTimeout(() => {
            setShowConfirmationModal(false)
        }, 5000)

    }

    const styles = StyleSheet.create({
        centered: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }
    })

    return(
        <View style={styles.centered}>
            <Center w="100%">
                <Box safeArea p="2" py="8" w="100%" maxW="290" justifyContent='center'>
                    <Heading mb={8}>Do you confirm the following appointment?</Heading>
                    <HStack>
                        <Text fontSize="xl" bold>Salon: </Text>
                        <Text fontSize="xl">{salonName}</Text>
                    </HStack>
                    <HStack>
                        <Text fontSize="xl" bold>Date: </Text>
                        <Text fontSize="xl">{date} {time}</Text>
                    </HStack>
                    <HStack>
                        <Text fontSize="xl" bold>Service: </Text>
                        <Text fontSize="xl">{service}</Text>
                    </HStack>
                    <Button mt={5} colorScheme='green' variant='subtle' onPress={confirmAppointment}>Confirm</Button>
                </Box>
                {
                    showConfirmationModal && <Loading/>
                }
            </Center>
        </View>

    )

}