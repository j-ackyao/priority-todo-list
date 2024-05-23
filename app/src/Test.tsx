import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, View, SafeAreaView, Image, Button, StatusBar } from 'react-native';
import { SERVER_DOMAIN } from './temp'; // temporary solution
import { getToken } from './user/Login';

export default function Test() {
    const navigation: NativeStackNavigationProp<any> = useNavigation<NativeStackNavigationProp<any>>();

    const [userToken, setUserToken] = useState("");

    function loginQuery() {
        fetch(SERVER_DOMAIN + "/user", {
            method: "POST",
            body: JSON.stringify({
                username: "test",
                password: "test"
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then((res) => {
            if (res.ok) {
                res.json().then(val => {
                    console.log(JSON.stringify(val));
                    setUserToken(val.token);
                }).catch(err => {
                    console.log(err);
                })
            }
        }).catch((err: Error) => {
            console.log(err.stack);
        });
    }

    function actionQuery() {
        fetch(SERVER_DOMAIN + "/todos", {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": userToken
            }
        }).then((res) => {
            if (res.ok) {
                res.json().then(val => {
                    console.log(JSON.stringify(val));
                }).catch(err => {
                    console.log(err);
                })
            }
        }).catch((err: Error) => {
            console.log(err.stack);
        });
    }

    async function testQuery() {
        fetch(SERVER_DOMAIN + "/todo", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": await getToken()
            }
        }).then((res) => {
            if (res.ok) {
                res.json().then(val => {
                    console.log(JSON.stringify(val));
                }).catch(err => {
                    console.log(err);
                })
            }
        }).catch((err: Error) => {
            console.log(err.stack);
        });
    }
    return (
        <View style={styles.center}>
            <Text style={styles.title} onPress={loginQuery}>
                send login
            </Text>
            <Text style={styles.title} onPress={actionQuery}>
                send action
            </Text>
            <Text style={styles.title} onPress={testQuery}>
                test action
            </Text>
            <Text style={styles.title} onPress={() => {navigation.goBack()}}>
                go back
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    center: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
    },
    title: {
        fontSize: 50,
        color: "royalblue"
    }
});