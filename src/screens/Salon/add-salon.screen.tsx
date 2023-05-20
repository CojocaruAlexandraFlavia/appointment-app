import React, {useState} from "react";
import {SalonClass, salonConverter} from "./salon.class";
import {
    Center,
    CheckIcon,
    FormControl,
    Input,
    ScrollView,
    Select,
    WarningOutlineIcon,
    Image,
    Button,
    Box, Icon, Heading, View
} from "native-base";
import {City, Salon} from "../../utils/types";
import * as ImagePicker from "expo-image-picker";
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons";
import {ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity} from "react-native";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {firestore, storage} from "../../utils/firebase";
import {addDoc, collection, doc, updateDoc} from "firebase/firestore";
import {AlertComponent} from "../../components/alert.component";
import {Loading} from "../../components/activity-indicator.component";
import * as euCountries from "../../utils/european-countries.json";
import Ionicons from "react-native-vector-icons/Ionicons";

const emptySalonState: Salon = {
    endTime: "",
    name: "",
    phoneNumber: "",
    startTime: "",
    id: "",
    rating: 0.0,
    images: [],
    reviews: [],
    nrOfReviews: 0,
    enabled: true,
    city: "",
    country: "",
    address: ""
}

const AddSalon = () => {

    const [salon, setSalon] = useState<Salon>(emptySalonState)
    const [citiesForSelectedState, setCitiesForSelectedState] = useState<string[]>([])
    const [images, setImages] = useState<string[]>([])
    const [errors, setErrors] = useState<Partial<Salon>>(emptySalonState)
    const [noImageUploadedError, setNoImageUploadedError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [salonAddedAlert, setSalonAddedAlert] = useState(false)
    const [savingError, setSavingError] = useState("")

    const openingHours = ["08:00", "09:00", "10:00", "11:00", "12:00"]
    const closingHours = ["16:00", "17:00", "18:00", "19:00", "20:00"]

    const pickImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.canceled) {
            const imageURIs = result.assets.map(asset => asset.uri)
            setImages([...images, ...imageURIs])
            setNoImageUploadedError(false)
        }
    }

    const getMajorCitiesForCountry = async (countryCode: string) => {
        const headers = new Headers();
        headers.append("apikey", process.env.EXTERNAL_API_AUTH_TOKEN);

        const requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
            headers: headers
        };

        try {
            const response = await fetch(`https://api.apilayer.com/geo/country/cities/${countryCode}`, requestOptions)
            const result: City[] = await response.json()
            const cityNames = result.map(item => item.name)
            setCitiesForSelectedState(cityNames)
            onChangeFormValues(countryCode, "country")
        } catch (e) {
            console.log(e)
        }

    }
    
    const findFormErrors = () => {
        const newErrors: Partial<Salon> = {}
        const {name, startTime, endTime, city, country, address, phoneNumber} = salon
        const requiredField = "Required field!"

        if (name === "") newErrors.name = requiredField
        if (startTime === "") newErrors.startTime = requiredField
        if (endTime === "") newErrors.endTime = requiredField
        if (country === "") newErrors.country = requiredField
        if (phoneNumber === "") newErrors.phoneNumber = requiredField
        if (city === "") newErrors.city = requiredField
        if (address === "") newErrors.address = requiredField

        return newErrors
    }

    const onChangeFormValues = (text: string, key: string) => {
        if (errors[key as keyof Salon]) {
            setErrors({...errors, [key]: ""})
        }
        setSalon({...salon, [key]: text})
    }

    const uploadSalonImageAsync = async(uri: string, salonId: string, fileName: string) => {
        const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.onload = function () {
                resolve(xhr.response)
            };
            xhr.onerror = function () {
                reject(new TypeError("Network request failed"));
            }
            xhr.responseType = "blob"
            xhr.open("GET", uri, true)
            xhr.send(null)
        });
        const fileRef = ref(storage, `salons/${salonId}/${fileName}.jpg`)
        await uploadBytes(fileRef, blob)

        return await getDownloadURL(fileRef)
    }

    const submit = async() => {
        const formErrors = findFormErrors()
        if (Object.values(formErrors).some(item => item !== "")) {
            setErrors(formErrors)
        } else if (images.length === 0) {
            setNoImageUploadedError(true)
        } else {
            setErrors(emptySalonState)
            setNoImageUploadedError(false)
            setLoading(true)
            try {
                const collectionRef = collection(firestore, "salons").withConverter(salonConverter);
                const addedSalon = await addDoc(collectionRef,
                    new SalonClass("", salon.name, salon.phoneNumber, 0.0, salon.startTime, salon.endTime,
                        "", [], 0, salon.enabled, salon.city, salon.country, salon.address))
                for (let i = 1; i < images.length; i++) {
                    uploadSalonImageAsync(images[i], addedSalon.id, `${i+1}`)
                }
                const firstPictureUrl = await uploadSalonImageAsync(images[0], addedSalon.id, "1")
                const salonDocRef = doc(firestore, "salons", addedSalon.id).withConverter(salonConverter)
                updateDoc(salonDocRef, {
                    image: firstPictureUrl
                }).then(() => {
                    setLoading(false)
                    setSalon(emptySalonState)
                    setImages([])
                    setSalonAddedAlert(true)
                    setTimeout(() => {
                        setSalonAddedAlert(false)
                    }, 5000)
                })
            } catch (e: any) {
                setSavingError(e.message)
                setTimeout(() => {
                    setSavingError("")
                }, 5000)
            }
        }
    }

    const styles = StyleSheet.create({
        container: {
            paddingTop: 10,
        },
        logo: {
            width: 125,
            height: 140,
            alignSelf: 'center',
            borderRadius: 200/2
        },
        backgroundImage: {
            flex: 1,
            width: 400,
            // height: null,
            resizeMode: 'cover', // or 'stretch'
            justifyContent: 'center',
            alignItems: 'center',
        }
    });


    return(
         <ScrollView>
             <Center w="100%">
                 <SafeAreaView >
                     <ImageBackground  style={styles.backgroundImage} source={require('../../../assets/background-semi.png')} >

                             <Box safeArea p="2" py="8" w="100%" maxW="290">
                     {
                         loading && <Loading/>
                     }

                                 <View style={styles.container}>
                                     <Image style={styles.logo} source={require('../../../assets/logo.png')} />
                                 </View>

                     <Heading py={5} alignSelf="center">Add new salon</Heading>
                     <FormControl isInvalid={errors.name !== ""} mb={3}>
                         <FormControl.Label _text={{bold: true}}>Name</FormControl.Label>
                         <Input value={salon.name} onChangeText={text => onChangeFormValues(text, "name")}
                                backgroundColor={"white"} InputLeftElement={ <Icon as={<MaterialIcons name="drive-file-rename-outline" />} ml={2}/>}/>
                         <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.name}</FormControl.ErrorMessage>
                     </FormControl>
                     <FormControl isInvalid={errors.country !== ""}>
                         <FormControl.Label _text={{bold: true}}>Select the country</FormControl.Label>
                         <Select backgroundColor={"white"} selectedValue={salon.country} placeholder={"Choose one option"} onValueChange={getMajorCitiesForCountry}>
                             {
                                 euCountries.countries.map((country, index) =>
                                     <Select.Item key={index} label={country.name} value={country.code}/>)
                             }
                         </Select>
                     </FormControl>
                     <FormControl isInvalid={errors.city !== ""}>
                         <FormControl.Label _text={{bold: true}}>Select the city</FormControl.Label>
                         <Select backgroundColor={"white"} selectedValue={salon.city} placeholder={"Choose one option"} isDisabled={citiesForSelectedState.length === 0}
                                 onValueChange={(value) => onChangeFormValues(value, "city")}>
                             {
                                 citiesForSelectedState.length > 0? citiesForSelectedState.map((city, index) => <Select.Item key={index} label={city} value={city}/>):
                                     <Select.Item label="First select your country!" value={""} disabled/>
                             }
                         </Select>
                     </FormControl>
                     <FormControl isInvalid={errors.address !== ""} mb={3}>
                         <FormControl.Label _text={{bold: true}}>Address</FormControl.Label>
                         <Input backgroundColor={"white"} value={salon.address} onChangeText={text => onChangeFormValues(text, "address")}
                                InputLeftElement={ <Icon as={<Ionicons name="location" />} ml={2}/>}/>
                         <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.address}</FormControl.ErrorMessage>
                     </FormControl>
                     <FormControl mb={3} isInvalid={errors.phoneNumber !== ""}>
                         <FormControl.Label _text={{bold: true}}>Phone number</FormControl.Label>
                         <Input backgroundColor={"white"} value={salon.phoneNumber} onChangeText={text => onChangeFormValues(text, "phoneNumber")}
                                InputLeftElement={ <Icon as={<Feather name="phone"/>} ml={2}/>}/>
                         <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.phoneNumber}</FormControl.ErrorMessage>
                     </FormControl>
                     <FormControl mb={3} isInvalid={errors.startTime !== ""}>
                         <FormControl.Label _text={{bold: true}}>Select opening time</FormControl.Label>
                         <Select backgroundColor={"white"} selectedValue={salon.startTime} onValueChange={value => onChangeFormValues(value, "startTime")} placeholder={"Choose one hour"}
                                 _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} />}}>
                             {
                                 openingHours.map((hour, index) => <Select.Item key={index} label={hour} value={hour}/>)
                             }
                         </Select>
                         <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.startTime}</FormControl.ErrorMessage>
                     </FormControl>
                     <FormControl mb={3} isInvalid={errors.endTime !== ""}>
                         <FormControl.Label _text={{bold: true}}>Select closing time</FormControl.Label>
                         <Select backgroundColor={"white"} selectedValue={salon.endTime} onValueChange={value => onChangeFormValues(value, "endTime")} placeholder={"Choose one hour"}
                                 _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} />}}>
                             {
                                 closingHours.map((hour, index) => <Select.Item key={index} label={hour} value={hour}/>)
                             }
                         </Select>
                         <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.endTime}</FormControl.ErrorMessage>
                     </FormControl>
                     <FormControl isInvalid={noImageUploadedError}>
                         <FormControl.Label _text={{bold: true}}>Upload salon pictures</FormControl.Label>
                         <TouchableOpacity  style={{borderWidth: 1, padding: 10 , borderColor: "lightgrey", borderRadius: 10, backgroundColor: "white"}}
                                           activeOpacity={0.5} onPress={pickImages}>
                             <Icon alignSelf={"center"} as={AntDesign} name="camera" size={35} color="black"
                                   style={{
                                       opacity: 0.5,
                                       alignItems: 'center',
                                       justifyContent: 'center',
                                   }}
                             />
                         </TouchableOpacity>
                         {
                             images.length > 0 && <ScrollView horizontal={true} mt={4}>
                                 {
                                     images.map((image, index) =>
                                         <Image alt={"image"} mr={2} key={index} src={image} size={"sm"}/>)
                                 }
                             </ScrollView>
                         }
                         <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>Upload at least one picture!</FormControl.ErrorMessage>
                     </FormControl>
                     <Button mb={4} mt={3} colorScheme="green" onPress={submit}>Submit</Button>
                     {
                         salonAddedAlert && <AlertComponent status={"success"} text={"Salon added successfully!"}
                                                            onClose={() => setSalonAddedAlert(false)}/>
                     }
                     {
                         savingError && <AlertComponent status={"error"}
                                                        text={`Error occurred at saving: ${savingError}!`}
                                                        onClose={() => setSavingError("")}/>
                     }
                 </Box>

                     </ImageBackground>
                 </SafeAreaView>
             </Center>

         </ScrollView>
    )

}

export default AddSalon