import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableHighlight,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NotificationsList from '../../utils/NotificationsList';
import notificationsStyles from "./notifications.styles"
import {ScrollView} from "native-base";

const Notifications = () => {

    const styles = notificationsStyles()

    const [listData, setListData] = useState(
        NotificationsList.map((NotificationItem, index) => ({
            key: `${index}`,
            title: NotificationItem.title,
            details: NotificationItem.details,
        })),
    );

    // @ts-ignore
    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    // @ts-ignore
    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
    };

    // @ts-ignore
    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    // @ts-ignore
    const onLeftActionStatusChange = rowKey => {
        console.log('onLeftActionStatusChange', rowKey);
    };

    // @ts-ignore
    const onRightActionStatusChange = rowKey => {
        console.log('onRightActionStatusChange', rowKey);
    };

    // @ts-ignore
    const onRightAction = rowKey => {
        console.log('onRightAction', rowKey);
    };

    // @ts-ignore
    const onLeftAction = rowKey => {
        console.log('onLeftAction', rowKey);
    };

    // @ts-ignore
    const VisibleItem = props => {
        const {
            data,
            rowHeightAnimatedValue,
            removeRow,
            leftActionState,
            rightActionState,
        } = props;

        if (rightActionState) {
            Animated.timing(rowHeightAnimatedValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start(() => {
                removeRow();
            });
        }

        return (
            <Animated.View
                style={[styles.rowFront, {height: rowHeightAnimatedValue}]}>
                <TouchableHighlight
                    style={styles.rowFrontVisible}
                    underlayColor={'#aaa'}>
                    <View>
                        <Text style={styles.title} numberOfLines={1}>
                            {data.item.title}
                        </Text>
                        <Text style={styles.details} numberOfLines={1}>
                            {data.item.details}
                        </Text>
                    </View>
                </TouchableHighlight>
            </Animated.View>
        );
    };

    // @ts-ignore
    const renderItem = (data, rowMap) => {
        const rowHeightAnimatedValue = new Animated.Value(60);

        return (
            <VisibleItem
                data={data}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                removeRow={() => deleteRow(rowMap, data.item.key)}
            />
        );
    };

    // @ts-ignore
    const HiddenItemWithActions = props => {
        const {
            swipeAnimatedValue,
            leftActionActivated,
            rightActionActivated,
            rowActionAnimatedValue,
            rowHeightAnimatedValue,
            onClose,
            onDelete,
        } = props;

        if (rightActionActivated) {
            Animated.spring(rowActionAnimatedValue, {
                toValue: 500,
                useNativeDriver: false
            }).start();
        } else {
            Animated.spring(rowActionAnimatedValue, {
                toValue: 75,
                useNativeDriver: false
            }).start();
        }

        return (
            <Animated.View style={[styles.rowBack, {height: rowHeightAnimatedValue}]}>
                <Text>Left</Text>
                {!leftActionActivated && (
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnLeft]}
                        onPress={onClose}>
                        <MaterialCommunityIcons
                            name="close-circle-outline"
                            size={25}
                            style={styles.trash}
                            color="#fff"
                        />
                    </TouchableOpacity>
                )}
                {!leftActionActivated && (
                    <Animated.View
                        style={[
                            styles.backRightBtn,
                            styles.backRightBtnRight,
                            {
                                flex: 1,
                                width: rowActionAnimatedValue,
                            },
                        ]}>
                        <TouchableOpacity
                            style={[styles.backRightBtn, styles.backRightBtnRight]}
                            onPress={onDelete}>
                            <Animated.View
                                style={[
                                    styles.trash,
                                    {
                                        transform: [
                                            {
                                                scale: swipeAnimatedValue.interpolate({
                                                    inputRange: [-90, -45],
                                                    outputRange: [1, 0],
                                                    extrapolate: 'clamp',
                                                }),
                                            },
                                        ],
                                    },
                                ]}>
                                <MaterialCommunityIcons
                                    name="trash-can-outline"
                                    size={25}
                                    color="#fff"
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </Animated.View>
        );
    };

    // @ts-ignore
    const renderHiddenItem = (data, rowMap) => {
        const rowActionAnimatedValue = new Animated.Value(75);
        const rowHeightAnimatedValue = new Animated.Value(60);

        return (
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
                rowActionAnimatedValue={rowActionAnimatedValue}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                onClose={() => closeRow(rowMap, data.item.key)}
                onDelete={() => deleteRow(rowMap, data.item.key)}
            />
        );
    };

    return (
        <ScrollView backgroundColor={'#cda9e6'}>
                <StatusBar barStyle="dark-content"/>
                <SwipeListView
                    data={listData}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    leftOpenValue={75}
                    rightOpenValue={-150}
                    disableRightSwipe
                    onRowDidOpen={onRowDidOpen}
                    leftActivationValue={100}
                    rightActivationValue={-200}
                    leftActionValue={0}
                    rightActionValue={-500}
                    onLeftAction={onLeftAction}
                    onRightAction={onRightAction}
                    onLeftActionStatusChange={onLeftActionStatusChange}
                    onRightActionStatusChange={onRightActionStatusChange}
                />
        </ScrollView>
    );
};

export default Notifications;
