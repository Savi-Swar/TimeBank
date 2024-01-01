// scaling.js
import { Dimensions } from 'react-native';

// iPhone 11 dimensions
const guidelineBaseWidth = 414;
const guidelineBaseHeight = 896;

const scale = size => (Dimensions.get('window').width / guidelineBaseWidth) * size;
const verticalScale = size => (Dimensions.get('window').height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
const moderateScaleFont = (size, factor = 1) => moderateScale(size, factor);


export { scale, verticalScale, moderateScale, moderateScaleFont };
