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
    Pressable,
    Text,
    VStack,
    WarningOutlineIcon
} from "native-base"
import React, {ReactElement, useState} from "react"
import {MaterialIcons} from "@expo/vector-icons";
import IconGoogle from "../../components/IconGoogle";
import IconFacebook from "../../components/IconFacebook";
import {LoginScreenNavigationProps} from "../../navigation/navigator.types";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth, firestore} from "../../utils/firebase";
import {LoginData} from "../../utils/types";
import {collection, getDocs, query, where} from "firebase/firestore";
import {useUserDataContext} from "../../store/UserData.context";
import {userConverter} from "../Profile/user.class";

const Login: React.FC<LoginScreenNavigationProps> = ({navigation}: LoginScreenNavigationProps): ReactElement => {

    const [showPassword, setShowPassword] = useState(false)
    const [credentials, setCredentials] = useState<LoginData>({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState<LoginData>({
        email: "",
        password: ""
    })
    const [firebaseLoginError, setFirebaseLoginError] = useState("")

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
    
    const signIn = async () => {
        const formErrors : LoginData = findFormErrors()
        if (Object.values(formErrors).some(item => item !== "")) {
            setFirebaseLoginError("")
            setErrors(formErrors)
        } else {
            try {
                await signInWithEmailAndPassword(
                    auth,
                    credentials.email,
                    credentials.password
                )

                const collectionRef = collection(firestore, "users");
                const firestoreUserQuery = query(collectionRef, where("email", "==", credentials.email)).withConverter(userConverter);
                const firestoreUserSnapshot = await getDocs(firestoreUserQuery)
                const userDocumentSnapshot = firestoreUserSnapshot.docs[0]
                const firestoreUser = {...userDocumentSnapshot.data(), id: userDocumentSnapshot.id}

                setUser(firestoreUser)

                setFirebaseLoginError("")
                navigation.navigate('Drawer')
            } catch (e) {
                console.log(e)
                const errorCode = (e as { code: string }).code
                let errorMessage = errorCode.split('/')[1].replaceAll('-', ' ')
                errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
                setFirebaseLoginError(errorMessage)
            }
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
                    <Button mt="2" colorScheme="indigo" onPress={signIn}>Sign in</Button>
                    {firebaseLoginError && <Text mt={4} alignSelf='center' fontSize='xl' color='red.500'>Error: {firebaseLoginError}</Text>}
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