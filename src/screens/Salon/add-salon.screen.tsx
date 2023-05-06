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
    Box, Icon, Heading
} from "native-base";
import {Salon} from "../../utils/types";
import * as ImagePicker from "expo-image-picker";
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons";
import {TouchableOpacity} from "react-native";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {firestore, storage} from "../../utils/firebase";
import {addDoc, collection, doc, updateDoc} from "firebase/firestore";
import {AlertComponent} from "../../components/alert.component";
import {Loading} from "../../components/activity-indicator.component";

const emptySalonState: Salon = {
    endTime: "",
    location: "",
    name: "",
    phoneNumber: "",
    startTime: "",
    id: "",
    rating: 0.0,
    images: [],
    reviews: []
}

const AddSalon = () => {

    const [salon, setSalon] = useState<Salon>(emptySalonState)
    const [images, setImages] = useState<string[]>([])
    const [errors, setErrors] = useState<Partial<Salon>>(emptySalonState)
    const [noImageUploadedError, setNoImageUploadedError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [salonAddedAlert, setSalonAddedAlert] = useState(false)

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
        }
    };
    
    const findFormErrors = () => {
        const newErrors = {...emptySalonState}
        const {name, startTime, endTime, location, phoneNumber} = salon
        const requiredField = "Required field!"

        if (name === "") newErrors.name = requiredField
        if (startTime === "") newErrors.startTime = requiredField
        if (endTime === "") newErrors.endTime = requiredField
        if (location === "") newErrors.location = requiredField
        if (phoneNumber === "") newErrors.phoneNumber = requiredField

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
        if (!Object.values(formErrors).includes("") ) {
            setErrors(formErrors)
        } else if(images.length === 0) {
            setNoImageUploadedError(true)
        } else {
            setErrors(emptySalonState)
            setNoImageUploadedError(false)
            setLoading(true)
            const collectionRef = collection(firestore, "salons").withConverter(salonConverter);
            const addedSalon = await addDoc(collectionRef,
                new SalonClass("", salon.name, salon.location, salon.phoneNumber, 0.0, salon.startTime, salon.endTime, "", []))
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
        }
    }

    return(
         <ScrollView>
             <Center w="100%">
                 <Box safeArea p="2" py="8" w="100%" maxW="290">
                     {
                         loading && <Loading/>
                     }
                     <Heading alignSelf="center">Add new salon</Heading>
                     <FormControl isInvalid={errors.name !== ""} mb={3}>
                         <FormControl.Label _text={{bold: true}}>Name</FormControl.Label>
                         <Input value={salon.name} onChangeText={text => onChangeFormValues(text, "name")}
                                InputLeftElement={ <Icon as={<MaterialIcons name="drive-file-rename-outline" />} ml={2}/>}/>
                         <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.name}</FormControl.ErrorMessage>
                     </FormControl>
                     <FormControl mb={3} isInvalid={errors.location !== ""}>
                         <FormControl.Label _text={{bold: true}}>Location</FormControl.Label>
                         <Input value={salon.location} onChangeText={text => onChangeFormValues(text, "location")}
                                InputLeftElement={ <Icon as={<MaterialIcons name="location-on" />} ml={2}/>}/>
                         <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.location}</FormControl.ErrorMessage>
                     </FormControl>
                     <FormControl mb={3} isInvalid={errors.phoneNumber !== ""}>
                         <FormControl.Label _text={{bold: true}}>Phone number</FormControl.Label>
                         <Input value={salon.phoneNumber} onChangeText={text => onChangeFormValues(text, "phoneNumber")}
                                InputLeftElement={ <Icon as={<Feather name="phone"/>} ml={2}/>}/>
                         <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.phoneNumber}</FormControl.ErrorMessage>
                     </FormControl>
                     <FormControl mb={3} isInvalid={errors.startTime !== ""}>
                         <FormControl.Label _text={{bold: true}}>Select opening time</FormControl.Label>
                         <Select onValueChange={value => onChangeFormValues(value, "startTime")} placeholder={"Choose one hour"}
                                 _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} />}}>
                             {
                                 openingHours.map((hour, index) => <Select.Item key={index} label={hour} value={hour}/>)
                             }
                         </Select>
                         <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.startTime}</FormControl.ErrorMessage>
                     </FormControl>
                     <FormControl mb={3} isInvalid={errors.endTime !== ""}>
                         <FormControl.Label _text={{bold: true}}>Select closing time</FormControl.Label>
                         <Select onValueChange={value => onChangeFormValues(value, "endTime")} placeholder={"Choose one hour"}
                                 _selectedItem={{ bg: "teal.600", endIcon: <CheckIcon size={5} />}}>
                             {
                                 closingHours.map((hour, index) => <Select.Item key={index} label={hour} value={hour}/>)
                             }
                         </Select>
                         <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.endTime}</FormControl.ErrorMessage>
                     </FormControl>
                     <FormControl isInvalid={noImageUploadedError}>
                         <FormControl.Label _text={{bold: true}}>Upload salon pictures</FormControl.Label>
                         <TouchableOpacity style={{borderWidth: 1, padding: 10 , borderColor: "lightgrey", borderRadius: 10}}
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
                 </Box>
             </Center>

         </ScrollView>
    )

}

export default AddSalon