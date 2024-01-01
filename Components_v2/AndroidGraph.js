import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
import BubbleText from './BubbleText';
import { scale, verticalScale, moderateScaleFont } from '../scaling';

function AndroidGraph({ weeklyArray, title, Yaxis, Xaxis }) {
  // Convert the weeklyArray object into an array of data points
  const processedData = Object.keys(weeklyArray)
    .slice(0, 10) // Take the first 10 entries
    .map((key, index) => ({
      x: index + 1, // Week number
      y: weeklyArray[key] // Value
    }));
    console.log(processedData)
  const maxValue = Math.max(...processedData.map(d => d.y), 100);

  return (
    <View style={styles.container}>
      <BubbleText size={moderateScaleFont(32)} color="#650000" text={title} />
      <VictoryChart 
        width={scale(430)} 
        height={verticalScale(305)} 
        domainPadding={scale(10)}
        domain={{ y: [0, maxValue] }} // Set the y-axis domain
      >
         <VictoryAxis
            style={{
              axisLabel: { padding: scale(30), fontSize: moderateScaleFont(20), fill: '#650000' },
              tickLabels: { fontSize: moderateScaleFont(15), fill: '#650000' }
            }}
            label={Xaxis}
          />

          <VictoryAxis 

            dependentAxis
            style={{
              tickLabels: { fontSize: moderateScaleFont(15), fill: '#650000' }
            }}
            />
         <VictoryBar
            data={processedData}
            style={{
              data: {
                fill: '#FF67A0',
                strokeWidth: scale(2),
                stroke: '#650000',
              },
            }}
            barRatio={0.8}
            cornerRadius={{ top: scale(5) }}
          />
      </VictoryChart>
    </View>
  );
}

// Rest of your component code

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(20),
    // Other styles
  },
});

export default AndroidGraph;
