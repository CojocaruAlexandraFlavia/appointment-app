import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Spinner} from "native-base";

export const Loading = ({theme = 'white', size = 'lg'}) => {
    const color = theme === 'white' ? '#000' : '#fff';
    return (
        <View
            style={{
                ...StyleSheet.absoluteFill as {},
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Spinner size={size} color={color} />
        </View>
    );
};