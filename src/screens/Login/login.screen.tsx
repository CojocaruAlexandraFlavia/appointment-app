import {
    Box,
    Button,
    Center,
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
import {View, Image, StyleSheet, SafeAreaView} from 'react-native';
import React, {ReactElement, useState} from "react"
import {MaterialIcons} from "@expo/vector-icons";
import {LoginScreenNavigationProps} from "../../navigation/navigator.types";
import {
    signInWithEmailAndPassword,
} from "firebase/auth";
import {auth, firestore} from "../../utils/firebase";
import {LoginData} from "../../utils/types";
import {collection, getDocs, query, where} from "firebase/firestore";
import {useUserDataContext} from "../../store/user-data.context";
import {userConverter} from "../Profile/user.class";

import {AlertComponent} from "../../components/alert.component";

const emptyData: LoginData = {
    email: "",
    password: ""
}

const Login: React.FC<LoginScreenNavigationProps> = ({navigation}: LoginScreenNavigationProps): ReactElement => {

    const [showPassword, setShowPassword] = useState(false)
    const [credentials, setCredentials] = useState<LoginData>(emptyData)
    const [errors, setErrors] = useState<LoginData>(emptyData)
    const [firebaseLoginError, setFirebaseLoginError] = useState("")

    const {setUser} = useUserDataContext()

    const findFormErrors = () : LoginData => {
        const errors = {...emptyData}
        if(credentials.email === "") errors.email = "Required field"
        if(credentials.password === "") errors.password = "Required field"

        return errors
    }

    const retrieveUserByFieldFromFirestore = async (field: string, value: string) => {
        const collectionRef = collection(firestore, "users");
        const firestoreUserQuery = query(collectionRef, where(field, "==", value)).withConverter(userConverter);
        const firestoreUserSnapshot = await getDocs(firestoreUserQuery)
        const userDocumentSnapshot = firestoreUserSnapshot.docs[0]
        return {...userDocumentSnapshot.data(), id: userDocumentSnapshot.id}
    }
    
    const signInUsingEmailAndPassword = async () => {
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

                const user = await retrieveUserByFieldFromFirestore("email", credentials.email)
                setUser(user)

                setFirebaseLoginError("")
                setCredentials({ email: "", password: ""})
                if (user.role === "CLIENT") {
                    navigation.navigate('Drawer')
                } else {
                    navigation.navigate("Tabs")
                }
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

    const styles = StyleSheet.create({
        container: {
            paddingTop: 10,
        },
        logo: {
            width: 125,
            height: 140,
            alignSelf: 'center',
            borderRadius: 100
        },
    });

    return (
        <Center>
            <SafeAreaView>
                <View >
                    <Box safeArea py="8" w="100%" alignSelf={'center'}>
                        <View style={styles.container}>
                            <Image style={styles.logo} source={require('../../../assets/logo.png')} />
                        </View>
                        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{color: "warmGray.50"}}>Welcome</Heading>
                        <Heading mt="1" _dark={{color: "warmGray.200"}} color="coolGray.600" fontWeight="medium" size="md">
                            Sign in to continue!
                        </Heading>
                        <VStack width={'100%'} rounded={5} p={5} space={'lg'} mt="5" backgroundColor={'white'}>
                                <FormControl isInvalid={errors.email !== ""}>
                                    <FormControl.Label _text={{bold: true, color:"black"}}>Email</FormControl.Label>
                                    <Input w={{base: "100%", md: "25%"}} size={5}
                                           InputLeftElement={ <Icon as={<MaterialIcons name="person" />} ml={2}/>}
                                           value={credentials.email}  isInvalid={errors.email !== ""}
                                           backgroundColor={"white"}
                                           onChangeText={text => onChangeText("email", text)}/>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.email}</FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.password !== ""}>
                                    <FormControl.Label _text={{bold: true, color:"black"}}>Password</FormControl.Label>
                                    <Input w={{ base: "100%", md: "25%"}} size={5}
                                           value={credentials.password} isInvalid={errors.password !== ""}
                                           backgroundColor={"white"}
                                           onChangeText={text => onChangeText("password", text)} type={showPassword ? "text" : "password"}
                                           InputLeftElement={
                                               <Pressable onPress={() => setShowPassword(!showPassword)}>
                                                   <Icon as={
                                                       <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="1" ml={2} color="muted.400" />
                                               </Pressable>} />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>
                                </FormControl>

                            {/*<Checkbox alignItems="flex-start" mt="5" isChecked value="demo" colorScheme="primary" accessibilityLabel="Remember me">*/}
                            {/*    <Text style={{fontStyle: 'italic'}} pl="3" fontWeight="normal" _light={{ color: "coolGray.800" }} _dark={{ color: "coolGray.400" }}>*/}
                            {/*        Remember me and keep me logged in*/}
                            {/*    </Text>*/}
                            {/*</Checkbox>*/}
                            <Button mt="4" colorScheme="indigo" onPress={signInUsingEmailAndPassword}>Sign in</Button>
                            {
                                firebaseLoginError && <AlertComponent status={"error"} text={firebaseLoginError} onClose={() => setFirebaseLoginError("")}/>
                            }
                            <HStack space="2" alignItems="center" justifyContent="center">
                                <Divider w="35%" _light={{ bg: "black" }} _dark={{ bg: "black" }}></Divider>
                                <Text fontSize="sm" fontWeight="medium" _light={{ color: "black" }} _dark={{ color: "black" }}>
                                    or
                                </Text>
                                <Divider w="35%" _light={{ bg: "black" }} _dark={{ bg: "black" }}></Divider>
                            </HStack>
                            <VStack space={1} mt="1">
                                <HStack mt="6" justifyContent="center">
                                    <Text fontSize="sm" color="black" _dark={{color: "warmGray.200"}}>
                                        I'm a new user.{" "}
                                    </Text>
                                    <Link _text={{fontSize: "sm", fontWeight: "bold", textDecoration: "none",}} _light={{_text: {color: "primary.900",},}}
                                          _dark={{_text: {color: "primary.500",},}}
                                          onPress={() => navigation.navigate('Register')}>
                                        Register
                                    </Link>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>

                </View>
            </SafeAreaView>
        </Center>
    )
}

export default Login