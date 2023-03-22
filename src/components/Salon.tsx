import {
    Avatar,
    Box,
    Button,
    Center,
    FlatList,
    FormControl,
    Heading,
    HStack,
    Icon,
    Link,
    Modal,
    Radio,
    ScrollView,
    Spacer,
    Text,
    View,
    VStack,
    WarningOutlineIcon
} from "native-base";
import { useRoute } from '@react-navigation/native';
import React, {ReactElement, useState} from "react";
import { SliderBox } from "react-native-image-slider-box";
import {Review, Salon, SalonScreenRouteProp, ServiceList, User} from "../utils/Types";
import { Rating } from "react-native-ratings";
import CalendarPicker from "./CalendarPicker";
import {Linking} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";


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

    const doCall = () => {
        Linking.openURL(`tel:${salon.phoneNumber}`)
            .then(() => console.log("opened phone caller"))
            .catch(error => console.log(error))
    }

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
                <Button mt={4} mb={2} onPress={() => setShowSelectServiceModal(true)}>Ask for appointment</Button>

                <Icon size="6" as={AntDesign} name="mobile1" color="black"/>
                <Link _text={{fontSize: "sm", fontWeight: "bold", textDecoration: "none",}} _light={{_text: {color: "primary.900",},}} _dark={{_text: {color: "primary.500",},}}
                    onPress={doCall}>Phone number: {salon.phoneNumber}
                </Link>

                <CalendarPicker show={showCalendar} setShow={setShowCalendar}/> {"\n"}

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