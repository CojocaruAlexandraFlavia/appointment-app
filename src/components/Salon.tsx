import {
    Box,
    Button,
    Center, FormControl,
    Heading,
    Modal, Radio, ScrollView,
    Text, View,
    WarningOutlineIcon
} from "native-base";
import { useRoute } from '@react-navigation/native';
import React, {ReactElement, useState} from "react";
import { SliderBox } from "react-native-image-slider-box";
import {Salon, SalonScreenRouteProp, ServiceList} from "../utils/Types";
import { Rating } from "react-native-ratings";
import CalendarPicker from "./CalendarPicker";


export const SalonScreen: React.FC = (): ReactElement => {

    const services: ServiceList[] = [
        {
            name: "Hair",
            services: [
                {
                    name: "Haircut",
                    duration: 1
                },
                {
                    name: "Hairdressing",
                    duration: 1
                },
                {
                    name: "Hair treatment",
                    duration: 1
                },
                {
                    name: "Hair coloring",
                    duration: 2
                },
                {
                    name: "Highlights",
                    duration: 3
                },
                {
                    name: "Balayage",
                    duration: 4
                }
            ]
        },
        {
            name: "Nails",
            services: [
                {
                    name: "Classic manicure",
                    duration: 1
                },
                {
                    name: "Semi-permanent manicure",
                    duration: 1
                },
                {
                    name: "Gel manicure",
                    duration: 2
                },
                {
                    name: "Classic pedicure",
                    duration: 1
                },
                {
                    name: "Semi-permanent pedicure",
                    duration: 1
                },
                {
                    name: "Gel pedicure",
                    duration: 2
                },
            ]
        },
        {
            name: "Make-up",
            services: [
                {
                    name: "Day make-up",
                    duration: 1
                },
                {
                    name: "Evening make-up",
                    duration: 2
                },
                {
                    name: "Ceremony make-up",
                    duration: 2
                },
                {
                    name: "Eyebrow shaping",
                    duration: 1
                },
                {
                    name: "Eyelash extension",
                    duration: 2
                }
            ]
        }
    ]

    const [showSelectServiceModal, setShowSelectServiceModal] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const [selectedService, setSelectedService] = useState("")
    const [formValidation, setFormValidation] = useState(false)
    const [servicesWithDuration, setServicesWithDuration] = useState(services)

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

    const handleValidateOption = () => {
        const validOption = selectedService === ""
        setFormValidation(validOption)
        setShowSelectServiceModal(validOption)
        setShowCalendar(!validOption)
    }

    const onCloseServiceModal = () => {
        setShowSelectServiceModal(false)
        setSelectedService("")
    }

    return(
        <Center w="100%">
            <Box safeArea p="2" py="8" w="100%" maxW="290"> 
                <Text>{salon.id}</Text>
                <Heading  size={"lg"} mb={4} alignSelf={"center"}>Salon {salon.name}</Heading>
                <SliderBox w="90%" images={salon.images} autoplay circleLoop sliderBoxHeight={120}/>
                <Rating type="custom" startingValue={salon.rating}  imageSize={30} readonly />
                <Text>{salon.phoneNumber}</Text>
                <Modal isOpen={showSelectServiceModal} onClose={onCloseServiceModal} size={"lg"}>
                    <Modal.Content>
                        <Modal.CloseButton/>
                        <Modal.Header>Choose service</Modal.Header>
                        <ScrollView w={"100%"} h={80}>
                            <Modal.Body>
                                <FormControl maxW="300" isInvalid={formValidation}>
                                    {
                                        servicesWithDuration.map((item, index) => <View key={index} borderBottomColor={"black"} borderBottomWidth={2}>
                                            <Radio.Group defaultValue={selectedService} name={item.name} value={selectedService} onChange={(value) => setSelectedService(value)}>
                                                <Text style={{alignSelf: "center"}} mb={1} mt={2} fontSize={"lg"}>{item.name}</Text>
                                                {
                                                    item.services.map((service, i) => <Radio size={"sm"} ml={2} mb={2} key={i} value={service.name}>
                                                        {`${service.name}, ${service.duration}h`}</Radio>)
                                                }
                                            </Radio.Group>
                                        </View>)
                                    }
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>Please make a selection!</FormControl.ErrorMessage>
                                </FormControl>
                            </Modal.Body>
                        </ScrollView>
                        <Modal.Footer>
                            <Button colorScheme={"success"} onPress={handleValidateOption}>Next</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
                <Button onPress={() => setShowSelectServiceModal(true)}>Ask for appointment</Button>
                <CalendarPicker show={showCalendar} setShow={setShowCalendar}/>
            </Box>
        </Center>
    )

}