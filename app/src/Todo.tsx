import { StyleSheet, Text, TouchableOpacity, Alert, View, Button, Platform } from 'react-native';
import NavigationBar from './NavigationBar';
import { ReactElement, useState } from 'react';

export default function Todo() {
    
    // get from database

    const [tasks, setTasks] = useState<ReactElement[]>([]);

    const addButton = <Button title="Add task" onPress={() => {
        Platform.OS === "ios" ?
        Alert.prompt("Add task", "Input task", (text) => {
            setTasks(tasks.concat([<Task text={text} />]));
        }) :
        Alert.alert("Oops!", "Not supported (to be fixed soon)");
    }}/>;

    return (
        <NavigationBar components={[addButton]}>
            <View style={styles.list}>
                {tasks.map((task, i) => {
                    return <View key={i.toString()}>{task}</View>
                })}
            </View>
        </NavigationBar>
    )
}



function Task(props: {text: string}) {

    const [checked, setChecked] = useState(false)

    return (
        <View style={styles.task}>
            <TouchableOpacity style={styles.box} disabled={checked} onPress={() => {
                    setChecked(true);
                    // del from database
                }}>
                <Text style={styles.cross}>{checked ? "X" : ""}</Text>
            </TouchableOpacity>
            <Text style={StyleSheet.compose(styles.taskText, {textDecorationLine: checked ? "line-through" : "none"})}>{props.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        height: "100%",
        width: "100%",
        flexDirection: "column",
        gap: 10,
        padding: 20,
    },
    task: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    box: {
        width: 40,
        height: 40,
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        borderWidth: 3,
        borderRadius: 5
    },
    cross: {
        textAlign: "center",
        fontSize: 30
    },
    taskText: {
        fontSize: 20,
        flexShrink: 1,
        textDecorationStyle: "solid",
    }
});