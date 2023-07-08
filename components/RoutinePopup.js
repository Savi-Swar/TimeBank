import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { getRoutineStats } from "../firebase"

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':');
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

// Helper function to convert minutes to hh:mm
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins < 10 ? '0' : ''}${mins}`;
}

function RoutinePopup({ visible, onClose, routine }) {
    const [stats, setStats] = useState(null);
    // Calculate min and max values for y-axis


    useEffect(() => {
        if (routine) {
            getRoutineStats(routine.kid, routine.name)
                .then(data => setStats(data));
        }
    }, [routine]);

    if (routine) {
        const { name, st, et, kid } = routine;
        const screenWidth = Dimensions.get("window").width;
        const yAxisMin = timeToMinutes(st);
        const yAxisMax = timeToMinutes(et);
        const data = {
            labels: stats ? Array.from({length: stats.times.length}, (_, i) => i + 1) : [],
            datasets: [
                {
                    data: stats ? stats.times.map(time => timeToMinutes(time)) : [],
                }
            ]
        };
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>{name}</Text>
                        <Text style={styles.modalText}>Start Time: {st}</Text>
                        <Text style={styles.modalText}>End Time: {et}</Text>
                        <Text style={styles.modalText}>Kid: {kid}</Text>
                        {stats &&
                            <>
                                <Text style={styles.modalText}>Average Time: {stats.averageTime}</Text>
                                <Text style={styles.modalText}>Last Completed: {stats.lastCompleted}</Text>
                                <Text style={styles.modalText}>Streak: {stats.streak}</Text>
                                <Text style={styles.modalText}>Times Completed: {stats.timesCompleted}</Text>
                                <Text style={styles.modalTitle}>Finish Times for {name}</Text>
                                <LineChart
                                    data={data}
                                    width={screenWidth}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: "#e26a00",
                                        backgroundGradientFrom: "#fb8c00",
                                        backgroundGradientTo: "#ffa726",
                                        decimalPlaces: 2, 
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        }
                                    }}
                                    bezier
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16
                                    }}
                                />
                            </>
                        }
                        <Button title="Back" onPress={onClose} />
                    </View>
                </View>
            </Modal>
        );
    } else {
        return null;  // or you can return a loader, default view, or any other fallback component here
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 24,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default RoutinePopup;
