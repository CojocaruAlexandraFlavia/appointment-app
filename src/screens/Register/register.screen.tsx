import {
    Box,
    Button,
    Center,
    Checkbox,
    Divider,
    FormControl,
    Heading,
    HStack,
    Icon,
    Input,
    Link,
    Pressable, Select,
    Text,
    VStack,
    WarningOutlineIcon
} from "native-base"
import React, {ReactElement, useState} from "react"
import {Feather, MaterialIcons} from "@expo/vector-icons";
import {Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import IconGoogle from "../../components/IconGoogle";
import IconFacebook from "../../components/IconFacebook";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, firestore} from "../../utils/firebase";
import {City, RegisterData} from "../../utils/types";
import {addDoc, collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {userConverter} from "../Profile/user.class";
import {AlertComponent} from "../../components/alert.component";
import * as euCountries from '../../utils/european-countries.json'

const emptyState: RegisterData = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",

}

const Register = ({navigation}: any): ReactElement => {

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [credentials, setCredentials] = useState<RegisterData>(emptyState)
    const [errors, setErrors] = useState<RegisterData>(emptyState)
    const [registerError, setRegisterError] = useState("")
    const [added, setAdded] = useState(false)
    const [citiesForSelectedState, setCitiesForSelectedState] = useState<string[]>([])

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
        } catch (e) {
            console.log(e)
        }

    }

    const findFormErrors = () : RegisterData => {
        const errors = {...emptyState}
        if(credentials.email === "") errors.email = "Required field"
        if(credentials.password === "") errors.password = "Required field"
        
        if(credentials.firstName === "") errors.firstName = "Required field"
        else if(credentials.firstName.length < 3) errors.firstName = "First Name is too short"
        
        if(credentials.lastName === "") errors.lastName = "Required field"
        else if(credentials.lastName.length < 3) errors.lastName = "Last Name is too short"
        
        if(credentials.city === "") errors.city = "Required field"
        else if(credentials.city.length < 2) errors.city = "Enter a valid city"

        return errors
    }

    const resetState = () => {
        setRegisterError("")
        setCredentials(emptyState)
        setErrors(emptyState)
        setShowPassword(false)
        setAdded(false)
    }
    
    const signUp = async () => {
        const formErrors : RegisterData = findFormErrors()
        if (!Object.values(formErrors).includes("")) {
            setErrors(formErrors)
        } else {
            setErrors({city: "", email: "", firstName: "", lastName: "", password: "", phoneNumber: ""})
            try {
                await createUserWithEmailAndPassword(
                    auth,
                    credentials.email,
                    credentials.password
                );

                const collectionRef = collection(firestore, "users");

                let username = `${credentials.firstName}.${credentials.lastName}`.toLowerCase()
                const queryUsernameStartingWith = query(collectionRef,
                    where("username", ">=", username),
                    where('username', '<=', username + '\uf8ff'),
                    orderBy("username", "desc")).withConverter(userConverter)
                const existingUserWithUsername = await getDocs(queryUsernameStartingWith)
                if (!existingUserWithUsername.empty) {
                    const lastUserContainingUsername = existingUserWithUsername.docs[0].data()
                    const lastUsernameNumberArray = lastUserContainingUsername.username.match(/\d+/)
                    if (lastUsernameNumberArray) {
                        const lastUsernameNumber = lastUsernameNumberArray.join('')
                        const newUsernameNumber = Number(lastUsernameNumber) + 1
                        username = `${username}${newUsernameNumber.toString()}`
                    } else if (lastUserContainingUsername.username === username) {
                        username = `${username}1`
                    }
                }

                await addDoc(collectionRef, {
                    email: credentials.email,
                    firstName: credentials.firstName,
                    lastName: credentials.lastName,
                    phoneNumber: credentials.phoneNumber,
                    city: credentials.city,
                    username: username
                });
                setAdded(true)
                setTimeout(() => resetState(), 5000)
            } catch (e) {
                console.log(e)
                const errorCode = (e as { code: string }).code
                let errorMessage = errorCode.split('/')[1].replaceAll('-', ' ')
                errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
                setRegisterError(errorMessage)
                // setTimeout(() => {
                //     setRegisterError("")
                // }, 5000)
            }
            //setUser({})
            //navigation.navigate('Login')
        }
    }

    const onChangeText = (key: string, value: string) => {
        if (errors[key as keyof RegisterData] !== "") {
            setErrors({...errors, [key]: ""})
        }
        setCredentials({...credentials, [key]: value})
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

    return (
        <ScrollView >
        <Center w="100%">
            <SafeAreaView >
                <ImageBackground  style={styles.backgroundImage} source={require('../../../assets/background-semi.png')} >
                    <View style={styles.container} >

                        <Box safeArea p="2" py="8" w="90%" maxW="290">
                            <Heading size="lg" fontWeight="500" color="coolGray.800" _dark={{color: "warmGray.50"}}>Welcome</Heading>
                            <Heading mt="1" _dark={{color: "warmGray.200"}} color="coolGray.600" fontWeight="medium" size="xs">
                                Sign up to continue!
                            </Heading>

                            <VStack space={1} mt="1">
                                <View style={styles.container}>
                                    <Image
                                        style={styles.logo}
                                        source={require('../../../assets/logo.png')}
                                    />
                                </View>

                                <FormControl isRequired isInvalid={errors.email !== ""}>
                                    <FormControl.Label _text={{bold: true}} >Email</FormControl.Label>
                                    <Input value={credentials.email} isInvalid={errors.email !== ""} size={5}
                                           backgroundColor={"white"}
                                           InputLeftElement={ <Icon as={<MaterialIcons name="person" />} ml={2}/>}
                                           onChangeText={text => onChangeText("email", text)}/>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.email}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.password !== ""}>
                                    <FormControl.Label _text={{bold: true}}>Password</FormControl.Label>
                                    <Input value={credentials.password} isInvalid={errors.password !== ""} size={5}
                                           backgroundColor={"white"}
                                           onChangeText={text => onChangeText("password", text)} type={showPassword ? "text" : "password"} InputLeftElement={
                                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                                            <Icon as={
                                                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="1" ml={2} color="muted.400" />
                                        </Pressable>}></Input>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>
                                </FormControl>

                                {/* <FormControl isRequired isInvalid={errors.password !== ""}>
                                    <FormControl.Label _text={{bold: true}} >Confirm Password</FormControl.Label>
                                    <Input type="password" value={credentials.password} isInvalid={errors.password !== ""} onChangeText={text => onChangeText("password", text)} />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>
                                 </FormControl> */}

                                 <FormControl isRequired isInvalid={errors.firstName !== ""}>
                                    <FormControl.Label _text={{bold: true}} >First Name</FormControl.Label>
                                    <Input value={credentials.firstName} isInvalid={errors.firstName !== ""} size={5}
                                           backgroundColor={"white"} onChangeText={text => onChangeText("firstName", text)}/>
                                    <FormControl.HelperText _text={{fontSize: 'xs'}}>First Name should contain at least 3 characters. </FormControl.HelperText>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.firstName}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.lastName !== ""}>
                                    <FormControl.Label _text={{bold: true}} >Last Name</FormControl.Label>
                                    <Input value={credentials.lastName} isInvalid={errors.lastName !== ""} size={5}
                                           backgroundColor={"white"} onChangeText={text => onChangeText("lastName", text)}/>
                                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Last Name should contain at least 3 characters. </FormControl.HelperText>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.lastName}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.phoneNumber !== ""}>
                                    <FormControl.Label _text={{bold: true}} >Phone Number</FormControl.Label>
                                    <Input value={credentials.phoneNumber} size={5} backgroundColor={"white"}
                                           InputLeftElement={ <Icon as={<Feather name="phone" />} ml={2}/>}
                                           isInvalid={errors.phoneNumber !== ""} onChangeText={text => onChangeText("phoneNumber", text)}/>
                                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Phone Number should contain 10 characters. </FormControl.HelperText>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.phoneNumber}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.city !== ""}>
                                    <FormControl.Label _text={{bold: true}} >City</FormControl.Label>
                                    <Input value={credentials.city} size={5} backgroundColor={"white"}
                                           InputLeftElement={ <Icon as={<Feather name="globe" />} ml={2}/>}
                                           isInvalid={errors.city !== ""} onChangeText={text => onChangeText("city", text)}/>
                                    <FormControl.HelperText _text={{fontSize: 'xs'}}>Enter a valid city! </FormControl.HelperText>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.city}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl>
                                    <FormControl.Label _text={{bold: true}} >Select your country</FormControl.Label>
                                    <Select backgroundColor={"white"} placeholder={"Choose one option"} onValueChange={getMajorCitiesForCountry}>
                                        {
                                            euCountries.countries.map((country, index) =>
                                                <Select.Item key={index} label={country.name} value={country.code}/>)
                                        }
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormControl.Label _text={{bold: true}}>Select your city</FormControl.Label>
                                    <Select backgroundColor={"white"} placeholder={"Choose one option"} isDisabled={citiesForSelectedState.length === 0}
                                            onValueChange={(value) => onChangeText("city", value)}>
                                        {
                                            citiesForSelectedState.length > 0? citiesForSelectedState.map((city, index) => <Select.Item key={index} label={city} value={city}/>):
                                                <Select.Item label="First select your country!" value={""} disabled/>
                                        }
                                    </Select>
                                </FormControl>

                                <Checkbox alignItems="flex-start" defaultIsChecked value="demo" colorScheme="primary" accessibilityLabel="Remember me">
                                    <HStack alignItems="center" marginBottom={4} marginTop={4}>
                                        <Text fontSize="sm" color="black" pl="2" >
                                            I accept the{" "}
                                        </Text>
                                        <Link _text={{fontSize: "sm", fontWeight: "semibold", textDecoration: "none",}} _light={{_text: {color: "primary.900",},}} _dark={{_text: {color: "primary.500",},}}>
                                            Terms of Use
                                        </Link>
                                        <Text fontSize="sm"> & </Text>
                                        <Link _text={{fontSize: "sm", fontWeight: "semibold", textDecoration: "none",}} _light={{_text: {color: "primary.900",},}} _dark={{_text: {color: "primary.500",},}}>
                                            Privacy Policy
                                        </Link>
                                    </HStack>
                                </Checkbox>
                                <Button mt="2" colorScheme="indigo" onPress={signUp}>Sign up</Button>
                                {registerError && <AlertComponent status={"error"} text={registerError} onClose={() => setRegisterError("")}/>}
                                {added && <AlertComponent status={"success"} text={"User created successfully!"} onClose={() => setAdded(false)}/>}
                            </VStack>
                        </Box>

                       <HStack space="2" mb={{ base: "1", md: "3" }} alignItems="center" justifyContent="center">
                           <Divider w="30%" _light={{ bg: "black" }} _dark={{ bg: "black" }}></Divider>
                           <Text fontSize="sm" fontWeight="medium" _light={{ color: "black" }} _dark={{ color: "black" }}>
                               or
                           </Text>
                           <Divider w="30%" _light={{ bg: "black" }} _dark={{ bg: "black" }}></Divider>
                       </HStack>

                        <HStack space="4" alignItems="center" justifyContent="center">
                            <Pressable>
                                <IconFacebook />
                            </Pressable>
                            <Pressable>
                                <IconGoogle />
                            </Pressable>
                        </HStack>

                        <VStack space={5} mt="5">
                        <HStack mb='4' space="1" alignItems="center" justifyContent="center" mt={{ base: "auto", md: "8" }}>
                            <Text fontSize="sm" _light={{ color: "coolGray.800" }} _dark={{ color: "coolGray.400" }}>
                                Already have an account?
                            </Text>
                            <Link _text={{fontSize: "sm", fontWeight: "bold", textDecoration: "none",}} _light={{_text: {color: "primary.900",},}}
                                _dark={{_text: {color: "primary.500",},}}
                                  onPress={() => navigation.navigate('Login')}>
                                Login
                            </Link>
                        </HStack>
                        </VStack>

                    </View>
                </ImageBackground>
            </SafeAreaView>
        </Center>
       </ScrollView>
    )
}

export default Register