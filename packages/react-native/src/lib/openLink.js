import { Linking } from "react-native"

export const openLink = async (url) => {
	try {
		await Linking.openURL(url)
	} catch {
		// do nothing
	}
}


