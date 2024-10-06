import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = new Storage({
	size: 1,
	storageBackend: AsyncStorage,
	defaultExpires: 1000 * 3600 * 24 * 15, // 15 day
	enableCache: true,
});

export const getToken = async () => {
	let token;
	try {
		token = await storage.load({ key: 'ecToken' });
	} catch (e) {
		return null;
	}
	return token;
}

export const saveToken = async (token) => {
	await storage.save({ key: 'ecToken', data: token })
};

export const deleteToken = async () => {
	try {
		await storage.remove({ key: 'ecToken' });
	} catch (e) {
		console.error(e);
	}
}