import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {Spinner} from "native-base";

export const Loading = ({theme = 'white', size = 'lg'}) => {
    const color = theme === 'white' ? '#00bdcd' : '#fff';
    // @ts-ignore
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