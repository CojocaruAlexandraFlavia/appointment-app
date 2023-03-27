import { Center, HStack, Link, VStack, Box, Button, Heading, Input, FormControl, Text, WarningOutlineIcon, Icon, Pressable, Checkbox, Divider  } from "native-base"
import React, {ReactElement, useState} from "react"
import { useUserDataContext } from "../store/UserData.context"
import { MaterialIcons } from "@expo/vector-icons";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {ParamListBase} from "@react-navigation/native";
import IconGoogle from "../components/IconGoogle";
import IconFacebook from "./IconFacebook";

type LoginData = {
    email: string, 
    password: string
}

type Props = NativeStackScreenProps<ParamListBase, 'Login'>;

const Login: React.FC<Props> = ({navigation}: Props): ReactElement => {

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [credentials, setCredentials] = useState<LoginData>({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState<LoginData>({
        email: "",
        password: ""
    })

    const {setUser} = useUserDataContext()

    const findFormErrors = () : LoginData => {
        const errors : LoginData = {
            email: "",
            password: ""
        }
        if(credentials.email === "") errors.email = "Required field"
        if(credentials.password === "") errors.password = "Required field"

        return errors
    }
    
    const auth = () => {
        const formErrors : LoginData = findFormErrors()
        if (Object.values(formErrors).some(item => item !== "")) {
            setErrors(formErrors)
        } else {
            //OPTIONAL Login Firebase  
            //set retrieved user to context
            navigation.navigate('HomeClient')
        }
    }

    const onChangeText = (key: string, value: string) => {
        if (errors[key as keyof LoginData] !== "") {
            setErrors({...errors, [key]: ""})
        }
        setCredentials({...credentials, [key]: value})
    }

    return (   
        <Center w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290">
                <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{color: "warmGray.50"}}>Welcome</Heading>
                <Heading mt="1" _dark={{color: "warmGray.200"}} color="coolGray.600" fontWeight="medium" size="xs">
                    Sign in to continue!
                </Heading>

                <VStack space={3} mt="5">
                    <FormControl isInvalid={errors.email !== ""}>
                        <FormControl.Label>Email</FormControl.Label>
                        <Input w={{base: "100%", md: "25%"}} size={5} color="muted.400"
                               InputLeftElement={ <Icon as={<MaterialIcons name="person" />} ml={2}/>}
                               value={credentials.email}  isInvalid={errors.email !== ""}
                               onChangeText={text => onChangeText("email", text)}/>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.email}</FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.password !== ""}>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input w={{ base: "100%", md: "25%"}} value={credentials.password} isInvalid={errors.password !== ""} 
                            onChangeText={text => onChangeText("password", text)} type={showPassword ? "text" : "password"} InputLeftElement={
                            <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Icon as={
                                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="1" ml={2} color="muted.400" />
                            </Pressable>} />
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>
                        <Link _text={{fontSize: "xs", fontWeight: "500", color: "indigo.500"}} alignSelf="flex-end" mt="1">
                            Forget Password?
                        </Link>
                    </FormControl>

                    <Checkbox alignItems="flex-start" mt="5" isChecked value="demo" colorScheme="primary" accessibilityLabel="Remember me">
                        <Text pl="3" fontWeight="normal" _light={{ color: "coolGray.800" }} _dark={{ color: "coolGray.400" }}>
                            Remember me and keep me logged in
                        </Text>
                    </Checkbox>
                    <Button mt="2" colorScheme="indigo" onPress={auth}>Sign in</Button>
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
                    <HStack mt="6" justifyContent="center">
                        <Text fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200"}}>
                            I'm a new user.{" "}
                        </Text>
                        <Link _text={{fontSize: "sm", fontWeight: "bold", textDecoration: "none",}} _light={{_text: {color: "primary.900",},}}
                              _dark={{_text: {color: "primary.500",},}}
                              onPress={() => navigation.navigate('Register')}>
                            Register
                        </Link>
                    </HStack>
            </VStack>

        </Center>
    )
}

export default Login