import {Avatar, Box, Button, Center, FlatList, FormControl, Heading, HStack, Icon, Link, Modal, Radio, ScrollView, SectionList, Spacer, Text, VStack, WarningOutlineIcon
} from "native-base";
import { useRoute } from '@react-navigation/native';
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { SliderBox } from "react-native-image-slider-box";
import { Review, Salon, ServicesListData, ServiceWithTime } from "../../utils/types";
import { Rating } from "react-native-ratings";
import CalendarPicker from "../Calendar/calendar-picker.screen";
import { Linking, ListRenderItemInfo, SectionListData, SectionListRenderItemInfo } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { salons, allServices } from "../../utils/constants";
import { SalonScreenRouteProp } from "../../navigation/navigator.types";


export const SalonScreen: React.FC = ({navigation}: any): ReactElement => {

    const [salon] = useState<Salon>(salons[0])

    const [allSalonServices, setAllSalonServices] = useState<ServicesListData[]>([])

    const [showSelectServiceModal, setShowSelectServiceModal] = useState(false)
    const [showCalendarPicker, setShowCalendar] = useState(false)
    const [selectedService, setSelectedService] = useState("")
    const [formValidation, setFormValidation] = useState(true)
    const [reviews] = useState<Review[]>([
        {
            id: 1,
            stars: 4,
            message: "superb",
            client: {
                id: 2,
                email: "email@email.com",
                firstName: "John",
                lastName: "Smith",
                phoneNumber: "+343654765",
                role: "CLIENT",
                password: "pass",
                profilePicture: "img1",
                city: "Bucharest"
            }
        },
        {
            id: 2,
            stars: 5,
            message: "professional lllll lllllllllll llllllllllllllllll llllllllll llllllllllllllll llllllll lllllll fdsifhsudf wfwuigrweur ygsdywgwyr wgrwiyrgwyi",
            client: {
                id: 1,
                email: "email@email.com",
                firstName: "Maria",
                lastName: "K",
                phoneNumber: "+343654765",
                role: "CLIENT",
                password: "pass",
                profilePicture: "img2",
                city: "Brasov"
            }
        }
    ])

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

    }, [allServices])

    const handleValidateOption = () => {
        const validOption = selectedService !== ""
        setFormValidation(validOption)
        setShowSelectServiceModal(!validOption)
        setShowCalendar(validOption)
        // onCloseServiceModal()
    }

    const onCloseServiceModal = () => {
        console.log("close service modal")
        setShowSelectServiceModal(false)
        setSelectedService("")
        setFormValidation(true)
    }

    const doCall = () => {
        Linking.openURL(`tel:${salon.phoneNumber}`)
            .then(() => console.log("opened phone caller"))
            .catch(error => console.log(error))
    }

    const renderItemServiceList = useCallback(({ item }: SectionListRenderItemInfo<ServiceWithTime, ServicesListData>)  =>
        (<Radio size={"sm"} ml={2} mb={1} value={item.name}>{`${item.name}, ${item.duration}h`}</Radio>), [])

    const renderHeaderServiceList = useCallback((info: { section: SectionListData<ServiceWithTime, ServicesListData> }) =>
        (<Heading fontSize="xl" mt="8" pb="4" alignSelf={"center"}> {info.section.title} </Heading>), [])

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
                                    <FormControl maxW="300" isInvalid={!formValidation}>
                                        <Radio.Group name={"Group"} onChange={(value) => setSelectedService(value)} value={selectedService}>
                                            <ScrollView horizontal={true}>
                                                <SectionList sections={allSalonServices} keyExtractor={(item) => item.name}
                                                             renderItem={ renderItemServiceList } renderSectionHeader={ renderHeaderServiceList } />
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

                <Icon size="6" as={AntDesign} name="mobile1" color="black"/>
                <Link
                    _text={{fontSize: "sm", fontWeight: "bold", textDecoration: "none",}} _light={{_text: {color: "primary.900",},}}
                    _dark={{_text: {color: "primary.500",},}}
                    onPress={doCall}>Phone number: {salon.phoneNumber}
                </Link>

                <CalendarPicker salonId={id} selectedService={selectedService}
                                setShow={setShowCalendar} show={showCalendarPicker} navigation={navigation}/> {"\n"}

                <Heading italic bold alignSelf={"center"} mb={2}>Reviews</Heading>

                <FlatList data={reviews} renderItem={renderItemReview} keyExtractor={item => item.id.toString()} />
            </Box>
        </Center>
    )

}