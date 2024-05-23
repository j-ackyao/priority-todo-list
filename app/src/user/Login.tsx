import { StyleSheet, Text, TouchableOpacity, Alert, View, SafeAreaView, Image, Button, StatusBar, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_DOMAIN, REQ_HEADERS } from '../temp';
import { createContext, useContext, useState } from 'react';

// export const AuthContext = createContext("");
// const LoadContext = createContext(true);

// consider persistent memory caching
export async function getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        AsyncStorage.getItem('user-token').then((token) => {
            if (token !== null) {
                resolve(token);
                return;
            }
            reject("user-token was read to be null");
        }).catch((err) => {
            reject(err);
        });
    });
}

async function setToken(token: string) {
    AsyncStorage.setItem('user-token', token);
}

export default function Login() {
    
    // check if token is still valid if exists when loaded on login
    // if (firstTimeLoad) {    
    //     setLoad(false);
    //     setToken("");
    //     getToken().then((token) => {
    //         if (token) {
    //             fetch(SERVER_DOMAIN + "/verify", {
    //                 method: "POST",
    //                 body: JSON.stringify({
    //                     token: token
    //                 }),
    //                 headers: REQ_HEADERS
    //             }).then((res) => {
    //                 if (res.ok) {
    //                     navigation.navigate("Home");
    //                     setToken(token);
    //                     return;
    //                 }
    //             });
    //         }
    //     }).catch((err) => {
    //         // OK handling
    //         // console.log(err);
    //     });
    // }

    const navigation: NativeStackNavigationProp<any> = useNavigation<NativeStackNavigationProp<any>>();

    const [username, onChangeUsername] = useState("");
    const [password, onChangePassword] = useState("");

    function login() {
        fetch(SERVER_DOMAIN + "/login", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: REQ_HEADERS
        }).then((res) => {
            if (res.ok) {
                res.json().then((json) => {
                    setToken(json.token);
                    navigation.navigate("Home");
                });
            } else {
                Alert.alert("Login failed", "Username does not exist or password was incorrect");
            }
            onChangePassword("");
        }).catch((err) => {
            Alert.alert("Failed to connect to server", "Try again later");
        });
    }

    return (
        // temporary solution to make keyboard unfocus when clicked off
        <TouchableWithoutFeedback>
        <View style={styles.verticalAlign}>
            <TouchableOpacity onLongPress={() => Alert.alert("awesome easter egg", undefined, [{text:"awesome"}])}>
                <Image style={styles.titleImage} source={{
                uri: "https://png.pngtree.com/png-vector/20191129/ourmid/pngtree-office-checklist-icon-business-checklist-survey-test-icon-png-image_2047566.jpg"}} />
            </TouchableOpacity>
            
            <Text style={styles.title}>Priority todo list</Text>
            <View>
                <View style={styles.inputStack}>
                    <TextInput style={styles.textInput} placeholder={"Username"} onChangeText={onChangeUsername} value={username}/>
                    <TextInput style={styles.textInput} secureTextEntry={true} placeholder={"Password"} onChangeText={onChangePassword} value={password}/>
                </View> 
            </View>
            <Button title={"Login"} onPress={login}/>
            <Button title={"Register"} onPress={() => {navigation.push("Register")}}/>
        </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    verticalAlign: {
        flexDirection: "column",
        // backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: '33%',
        gap: 30
        // justifyContent: 'center',
    },
    titleImage: {
        borderRadius: 10,
        width: 150,
        height: 150
    },
    title: {
        fontSize: 40
    },
    inputStack: {
        flexDirection: "column",
        gap: 5
    },
    textInput: {
        fontSize: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        width: 200
    }

});