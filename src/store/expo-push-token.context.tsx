import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import * as Notifications from 'expo-notifications';
import {Platform} from "react-native";
import * as Device from "expo-device";
import {useNavigation} from '@react-navigation/native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    })
});

const registerForPushNotificationsAsync = async () => {
    let token = "";

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            alert("Failed to get push token for push notification!");
            return;
        }
        const expoPushToken = await Notifications.getExpoPushTokenAsync({projectId: process.env.EXPO_PROJECT_ID})
        token = expoPushToken.data;
    } else {
        alert("Must use physical device for Push Notifications");
    }
    return token;

}

interface ExpoToken {
    token: string,
    setToken: Function
}

const ExpoPushTokenContext = createContext<ExpoToken>({
    token: "",
    setToken: () => {}
})

export const useExpoPushTokenContext = () => {
    return useContext(ExpoPushTokenContext)
}

export const ExpoPushTokenProvider = ({children,}: {children: React.ReactNode;}) => {
    const [token, setToken] = useState("")
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();
    const navigation = useNavigation()

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => setToken(token));

        notificationListener.current =
            Notifications.addNotificationReceivedListener((event) => {
                console.log(event.request.content.data)
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(response => {
                const url = response.notification.request.content.data.url;
                navigation.navigate(url);
            })

        return () => {
            if (notificationListener.current && responseListener.current) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                );
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    return (
        <ExpoPushTokenContext.Provider value={{token, setToken}}>
            {children}
        </ExpoPushTokenContext.Provider>
    );
}