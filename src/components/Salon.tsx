import {
    Avatar,
    Box,
    Button,
    Center, FlatList, FormControl,
    Heading, HStack,
    Modal, Radio, ScrollView, SectionList, Spacer,
    Text, VStack,
    WarningOutlineIcon
} from "native-base";
import { useRoute } from '@react-navigation/native';
import React, {ReactElement, useEffect, useState} from "react";
import { SliderBox } from "react-native-image-slider-box";
import {Review, Salon, SalonScreenRouteProp, ServicesListData} from "../utils/Types";
import { Rating } from "react-native-ratings";
import CalendarPicker from "./CalendarPicker";
import {Linking} from "react-native";
import {salons, allServices} from "../utils/Constants";

export const SalonScreen: React.FC = (): ReactElement => {

    const reviews: Review[] = [
        {
            id: 1,
            stars: 4,
            message: "superb",
            client: {
                email: "email@email.com",
                firstName: "John",
                lastName: "Smith",
                phoneNumber: "+343654765",
                role: "CLIENT",
                password: "pass",
                profilePicture: "img1"
            }
        },
        {
            id: 2,
            stars: 5,
            message: "professional lllll lllllllllll llllllllllllllllll llllllllll llllllllllllllll llllllll lllllll fdsifhsudf wfwuigrweur ygsdywgwyr wgrwiyrgwyi",
            client: {
                email: "email@email.com",
                firstName: "Maria",
                lastName: "K",
                phoneNumber: "+343654765",
                role: "CLIENT",
                password: "pass",
                profilePicture: "img2"
            }
        }
    ]
    const [salon, setSalon] = useState<Salon>(salons[0])

    const [allSalonServices, setAllSalonServices] = useState<ServicesListData[]>([])

    const [showSelectServiceModal, setShowSelectServiceModal] = useState(false)
    const [showCalendarPicker, setShowCalendar] = useState(false)
    const [selectedService, setSelectedService] = useState("")
    const [formValidation, setFormValidation] = useState(false)

    const route = useRoute<SalonScreenRouteProp>()
    const { id } = route.params;

    useEffect(() => {
        let listData: ServicesListData[] = []
        for (const item of allServices) {
            const data: ServicesListData = {
                title: item.name,
                data: item.services
            }
            listData.push(data)
        }
        setAllSalonServices(listData)

    }, [])

    const handleValidateOption = () => {
        const validOption = selectedService === ""
        console.log(validOption)
        setFormValidation(!validOption)
        setShowSelectServiceModal(validOption)
        setShowCalendar(!validOption)
    }

    const onCloseServiceModal = () => {
        setShowSelectServiceModal(false)
        setSelectedService("")
    }

    const doCall = () => {
        Linking.openURL(`tel:${salon.phoneNumber}`)
            .then(() => console.log("opened phone caller"))
            .catch(error => console.log(error))
    }

    // @ts-ignore
    return(
        <Center w="100%">
            <Box safeArea p="2" py="8" w="100%" maxW="290">
                <HStack justifyContent={"space-between"} mb={2}>
                    <Heading  size={"lg"} mb={2} alignSelf={"center"}>Salon {salon.name}</Heading>
                    <Rating style={{marginBottom: "3%"}} type="custom" startingValue={salon.rating} imageSize={20} readonly />
                </HStack>

                <SliderBox alignSelf={"center"} ImageComponentStyle={{borderRadius: 15, width: '75%'}} w="90%"
                           images={salon.images} autoplay circleLoop sliderBoxHeight={120}/>
                <Modal isOpen={showSelectServiceModal} onClose={onCloseServiceModal} size={"lg"}>
                    <Modal.Content flexGrow={1}>
                        <Modal.CloseButton/>
                        <Modal.Header>Choose service</Modal.Header>
                            <Modal.Body >
                                    <FormControl maxW="300" isInvalid={formValidation}>
                                        <Radio.Group name={"Group"} onChange={(value) => setSelectedService(value)} value={selectedService}>
                                            <ScrollView horizontal={true}>
                                                <SectionList sections={allSalonServices} keyExtractor={(item, index) => item.name}
                                                             renderItem={ ({item})  => <Radio size={"sm"} ml={2} mb={2} value={item.name}>
                                                                 {`${item.name}, ${item.duration}h`}</Radio>
                                                             } renderSectionHeader={({ section: { title } }) =>
                                                    <Heading fontSize="xl" mt="8" pb="4" alignSelf={"center"}> {title} </Heading> } />
                                            </ScrollView>
                                        </Radio.Group>
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>Please make a selection!</FormControl.ErrorMessage>
                                    </FormControl>
                            </Modal.Body>
                        <Modal.Footer>
                            <Button colorScheme={"success"} onPress={handleValidateOption}>Next</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
                <Button mt={4} mb={2} onPress={() => setShowSelectServiceModal(true)}>Ask for appointment</Button>
                <Text onPress={doCall}>Phone number: {salon.phoneNumber}</Text>
                <CalendarPicker salonId={id} selectedService={selectedService} show={showCalendarPicker}/> {"\n"}

                <Heading italic bold alignSelf={"center"} mb={2}>Reviews</Heading>

                <FlatList data={reviews} renderItem={({item}) => <Box borderBottomWidth="1" _dark={{borderColor: "muted.50"}}
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
                </Box>} keyExtractor={item => item.id.toString()} />
            </Box>
        </Center>
    )

}