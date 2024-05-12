import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, Alert, View, SafeAreaView, Image, Button, StatusBar } from 'react-native';

export default function Test() {
    const navigation: NativeStackNavigationProp<any> = useNavigation<NativeStackNavigationProp<any>>();
    return (
        <View style={styles.center}>
            <Text style={styles.title} onPress={() => {navigation.push("Todo")}}>
                keep going
            </Text>
            <Text style={styles.title} onPress={() => {navigation.goBack()}}>
                go back
            </Text>
            <Text style={styles.title} onPress={() => {navigation.navigate("Home")}}>
                go home
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