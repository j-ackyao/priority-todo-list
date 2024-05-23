import { StyleSheet, Text, TouchableOpacity, Alert, View, SafeAreaView, Image, Button, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReactElement, Children } from 'react';


export default function NavigationBar(props: {components?: ReactElement[], children?: any, style?: any}) {
    const top: number = useSafeAreaInsets().top;
    const goBack: () => void = useNavigation().goBack;
    const barStyle = StyleSheet.compose(styles.container, {paddingTop: top});

    return (
        <View style={StyleSheet.compose(barStyle, props.style)}>
            <View style={{...styles.bar}}>
                <TouchableWithoutFeedback onPress={goBack}>
                    <View>
                        <Text style={styles.text}>&lt;</Text>
                    </View>
                </TouchableWithoutFeedback>
                {props.components ? props.components.map((c, i) => {
                    return <View key={i.toString()}>{c}</View>
                }) : <></>}
            </View>
            <View>
                {Children.map(props.children, (c, i) => {
                    return <View key={i.toString()}>{c}</View>
                })}
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
    bar: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 30,
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
        // alignItems: "flex-start",
        // height: 10,
        // borderWidth: 1,
    },
    text: {
        fontSize: 30,
        textAlign: "center",
        // borderWidth: 1
    }
});