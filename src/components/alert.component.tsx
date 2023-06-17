import {Alert, CloseIcon, HStack, IconButton, Text, VStack} from "native-base";
import React from "react";

type AlertProps = {
    status: string,
    text: string,
    onClose: () => void
}

export const AlertComponent = ({status, text, onClose}: AlertProps) => {

    return <Alert w="100%" status={status} variant="left-accent">
        <VStack space={2} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} justifyContent="space-between">
                <HStack space={2} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="md" color="coolGray.800">
                        {text}
                    </Text>
                </HStack>
                <IconButton onPress={onClose} variant="unstyled" _focus={{ borderWidth: 0 }} icon={<CloseIcon size="3" />} _icon={{ color: "coolGray.600"}} />
            </HStack>
        </VStack>
    </Alert>
}