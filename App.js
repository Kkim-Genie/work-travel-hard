import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from'react-native';
import { theme } from "./colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons'; 

const STORAGE_KEY = "@toDos";
const STATUS_KEY = "@Working"

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});
    useEffect(()=>{
        loadToDos();
        loadStatus();
    }, [])
    const travel = async () => {
        setWorking(false);
        await AsyncStorage.setItem(STATUS_KEY, "false");
    }
    const work = async () => {
        setWorking(true);
        await AsyncStorage.setItem(STATUS_KEY, "true");
    }
    const onChangeText = (event) => setText(event);
    const saveToDos = async (toSave) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }
    const loadToDos = async () => {
        const s = await AsyncStorage.getItem(STORAGE_KEY);
        setToDos(JSON.parse(s));
    }
    const loadStatus = async () => {
        const s = await AsyncStorage.getItem(STATUS_KEY);
        setWorking(s==="true");
    }
    
    const addToDo = () => {
        if(text === ""){
            return;
        }
        const newToDos = {
            ...toDos,
            [Date.now()]: {text, working, isComplete:false}
        }
        setToDos(newToDos);
        saveToDos(newToDos);
        setText("");
    }
    const deleteToDos = (key) => {
        Alert.alert(
            "Delete To Do", 
            "Are you sure?", [
                {text: "Cancel"},
                {text: "I'm sure",
                 onPress: ()=> {
                    const newToDos = {...toDos};
                    delete newToDos[key];
                    setToDos(newToDos);
                    saveToDos(newToDos);
                 }
                }
            ])
        return;
        
    }
    const toggleToDos = (key) => {
        const newToDos = {...toDos};
        toDos[key].isComplete = !toDos[key].isComplete;
        setToDos(newToDos);
        saveToDos(newToDos);
    }
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
                </TouchableOpacity>
            </View>
            <TextInput 
                onSubmitEditing={addToDo}
                placeholder={working ? "Add a To Do" : "Where do you want to go?"} 
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                returnKeyType="done"
                />
            <ScrollView>{
                Object.keys(toDos).map(key => (
                    toDos[key].working === working ? 
                    <View style={styles.toDo} key={key}>
                        <View style={styles.checkView}>
                            <TouchableOpacity onPress={() => toggleToDos(key)}>
                                <Feather name={toDos[key].isComplete ? "check-square" : "square"} size={18} color="white" />
                            </TouchableOpacity>
                            <Text style={styles.toDoText} >{toDos[key].text}</Text>
                        </View>
                        
                        <TouchableOpacity onPress={() => deleteToDos(key)}>
                            <Ionicons name="trash" size={18} color="white" />
                        </TouchableOpacity>
                    </View> : null
            ))}</ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
        paddingHorizontal: 20,
    },
    header: {
        justifyContent:'space-between',
        flexDirection: 'row',
        marginTop: 100
    },
    btnText: {
        fontSize: 38,
        fontWeight: 600,
        color: "white"
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginVertical: 20,
        fontSize: 18,
    },
    toDo: {
        backgroundColor: theme.grey,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    checkView: {
        flexDirection: "row"
    },
    toDoText: {
        color: "white",
        fontSize: 16,
        fontWeight: 500,
        marginLeft:10
    }
});
