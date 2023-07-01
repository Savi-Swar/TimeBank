import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import colors from "../config/colors";

function TimeProgressBar({ startTime, endTime }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    updateProgress();
    const interval = setInterval(updateProgress, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const updateProgress = () => {
    const currentTime = new Date();
    const start = new Date(currentTime.toDateString() + ' ' + startTime);
    const end = new Date(currentTime.toDateString() + ' ' + endTime);

    if (currentTime >= start && currentTime <= end) {
      setProgress((currentTime - start) / (end - start));
    } else {
      setProgress(0);
    }
  };
  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { flex: progress }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 20,
    width: '80%',
    backgroundColor: 'white',
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10
  },
  progressBar: {
    backgroundColor: colors.primary,
  },
});

export default TimeProgressBar;
