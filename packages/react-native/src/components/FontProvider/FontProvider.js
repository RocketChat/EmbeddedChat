import { useFonts } from 'expo-font';

const FontProvider = ({children}) => {
	const [fontsLoaded] = useFonts({
		'custom': require('../../assets/fonts/custom.ttf'), // font for rocketchat icons
	});
	if (!fontsLoaded) {
		return null;
	}
	return children;
}

export default FontProvider;
