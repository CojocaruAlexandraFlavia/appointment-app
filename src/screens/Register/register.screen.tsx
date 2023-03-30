import { Center, HStack, Link, VStack, Box, Button, Heading, Input, FormControl, Text, WarningOutlineIcon, Icon, Pressable, Checkbox, Divider  } from "native-base"
import React, { ReactElement, useState } from "react"
import { useUserDataContext } from "../../store/UserData.context"
import {Feather, MaterialIcons} from "@expo/vector-icons";
import { ScrollView } from 'react-native';
import IconGoogle from "../../components/IconGoogle";
import IconFacebook from "../../components/IconFacebook";

type RegisterData = {
    email: string, 
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    city: string,
}

const Register = ({navigation}: any): ReactElement => {

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [credentials, setCredentials] = useState<RegisterData>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        city: "",

    })
    const [errors, setErrors] = useState<RegisterData>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        city: "",
    })

    const {setUser} = useUserDataContext()

    const findFormErrors = () : RegisterData => {
        const errors : RegisterData = {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            city: "",
        }
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
    
    const auth = () => {
        const formErrors : RegisterData = findFormErrors()
        if (!Object.values(formErrors).includes("")) {
            setErrors(formErrors)
        } else {
            console.log("ok")
            //setUser({})
            navigation.navigate('Login')
        }
    }

    const onChangeText = (key: string, value: string) => {
        if (errors[key as keyof RegisterData] !== "") {
            setErrors({...errors, [key]: ""})
        }
        setCredentials({...credentials, [key]: value})
    }

    // @ts-ignore
    return (
       <ScrollView > 
        <Center w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290"> 
                <Heading size="lg" fontWeight="500" color="coolGray.800" _dark={{color: "warmGray.50"}}>Welcome</Heading>
                <Heading mt="1" _dark={{color: "warmGray.200"}} color="coolGray.600" fontWeight="medium" size="xs">
                    Sign up to continue!
                </Heading>

                <VStack space={5} mt="5">
                    <FormControl isRequired isInvalid={errors.email !== ""}>
                        <FormControl.Label _text={{bold: true}} >Email</FormControl.Label>
                        <Input value={credentials.email} isInvalid={errors.email !== ""}
                               InputLeftElement={ <Icon as={<MaterialIcons name="person" />} ml={2}/>}
                               onChangeText={text => onChangeText("email", text)}/>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.email}</FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={errors.password !== ""}>
                        <FormControl.Label _text={{bold: true}} >Password</FormControl.Label>
                        <Input value={credentials.password} isInvalid={errors.password !== ""}
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
                        <Input value={credentials.firstName} isInvalid={errors.firstName !== ""} onChangeText={text => onChangeText("firstName", text)}/>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>First Name should contain at least 3 characters. </FormControl.HelperText>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.firstName}</FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={errors.lastName !== ""}>
                        <FormControl.Label _text={{bold: true}} >Last Name</FormControl.Label>
                        <Input value={credentials.lastName} isInvalid={errors.lastName !== ""} onChangeText={text => onChangeText("lastName", text)}/>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Last Name should contain at least 3 characters. </FormControl.HelperText>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.lastName}</FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={errors.phoneNumber !== ""}>
                        <FormControl.Label _text={{bold: true}} >Phone Number</FormControl.Label>
                        <Input value={credentials.phoneNumber}
                               InputLeftElement={ <Icon as={<Feather name="phone" />} ml={2}/>}
                               isInvalid={errors.phoneNumber !== ""} onChangeText={text => onChangeText("phoneNumber", text)}/>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Phone Number should contain 10 characters. </FormControl.HelperText>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.phoneNumber}</FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={errors.city !== ""}>
                        <FormControl.Label _text={{bold: true}} >City</FormControl.Label>
                        <Input value={credentials.city}
                               InputLeftElement={ <Icon as={<Feather name="globe" />} ml={2}/>}
                               isInvalid={errors.city !== ""} onChangeText={text => onChangeText("city", text)}/>
                        <FormControl.HelperText _text={{fontSize: 'xs'}}>Enter a valid city! </FormControl.HelperText>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.city}</FormControl.ErrorMessage>
                    </FormControl>

                    <Checkbox alignItems="flex-start" defaultIsChecked value="demo" colorScheme="primary" accessibilityLabel="Remember me">
                        <HStack alignItems="center">
                            <Text fontSize="sm" color="coolGray.400" pl="2">
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
                    <Button mt="2" colorScheme="indigo" onPress={auth}>Sign up</Button>
                </VStack>
            </Box>

           <HStack space="2" mb={{ base: "6", md: "7" }} alignItems="center" justifyContent="center">
               <Divider w="30%" _light={{ bg: "coolGray.200" }} _dark={{ bg: "coolGray.700" }}></Divider>
               <Text fontSize="sm" fontWeight="medium" _light={{ color: "coolGray.300" }} _dark={{ color: "coolGray.500" }}>
                   or
               </Text>
               <Divider w="30%" _light={{ bg: "coolGray.200" }} _dark={{ bg: "coolGray.700" }}></Divider>
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

        </Center>
       </ScrollView>
    )
}

export default Register