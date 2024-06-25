import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { EmbeddedChatApi } from '@embeddedchat/api';
import { RCInstanceProvider } from '../contexts/RCInstance';
import { deleteToken, getToken, saveToken} from '../lib/auth';
import { ThemeProvider } from '@emotion/react';
import DefaultTheme from '../theme/DefaultTheme';
import { ECRoute, ECRouteProvider } from '../contexts/Router';
import { LoginView } from '../views/LoginView';
import { ChatRoomView } from '../views/ChatRoomView';
import { FontProvider } from './FontProvider';
import { useMemberStore, useUserStore } from '../store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import PropTypes from 'prop-types';

const EmbeddedChat = ({
	width = '100%',
	height = '100%',
	host = 'http://localhost:3000',
	roomId = 'GENERAL',
	channelName,
	anonymousMode = false,
	showRoles = false,
	showAvatar = false,
	enableThreads = false,
	theme = null,
	hideHeader = false,
	auth = {
		flow: 'MANAGED',
	},
	style = {}
}) => {
	const setIsUserAuthenticated = useUserStore(
		(state) => state.setIsUserAuthenticated
	);

	const setAuthenticatedUserUsername = useUserStore(
		(state) => state.setUsername
	);
	const setAuthenticatedUserAvatarUrl = useUserStore(
		(state) => state.setUserAvatarUrl
	);
	const setAuthenticatedUserId = useUserStore((state) => state.setUserId);
	const setAuthenticatedName = useUserStore((state) => state.setName);

	const setMembersHandler = useMemberStore((state) => state.setMembersHandler);

	const [RCInstance, setRCInstance] = useState(() => {
		const newRCInstance = new EmbeddedChatApi(host, roomId, {
			getToken,
			deleteToken,
			saveToken,
		});

		return newRCInstance;
	});

	useEffect(() => {
		const reInstantiate = () => {
			const newRCInstance = new EmbeddedChatApi(host, roomId, {
				getToken,
				deleteToken,
				saveToken,
			});

			setRCInstance(newRCInstance);
			console.log('Reinstantiated');
		};

		if (RCInstance.rcClient.loggedIn()) {
			RCInstance.close().then(reInstantiate).catch(console.error);
		} else {
			reInstantiate();
		}
	}, [roomId, host]);

	useEffect(() => {
		RCInstance.autoLogin(auth).catch((error) => {
		  console.error(error);
		});
	  }, [RCInstance, auth]);
	

	useEffect(() => {
		const onAuthChange = async (user) => {
			if (user) {
				console.log('Connecting to RocketChat');
				RCInstance.connect()
					.then(() => {
						console.log(`Connected to RocketChat ${RCInstance.host}`);
					})
					.catch('RC Connection Error', console.error);
				const { me } = user;
				setAuthenticatedUserAvatarUrl(me.avatarUrl);
				setAuthenticatedUserUsername(me.username);
				setAuthenticatedUserId(me._id);
				setAuthenticatedName(me.name);
				setIsUserAuthenticated(true);

				RCInstance.getChannelMembers().then((members = []) => {
					setMembersHandler(members);
				});
			} else {
				setIsUserAuthenticated(false);
			}
		}
		RCInstance.auth.onAuthChange(onAuthChange);
		return () => {
			RCInstance.auth.removeAuthListener(onAuthChange);
		}
	}, [RCInstance]);

	const ECOptions = useMemo(
		() => ({
			enableThreads,
			authFlow: auth.flow,
			width,
			height,
			host,
			roomId,
			channelName,
			anonymousMode,
			showRoles,
			showAvatar,
			hideHeader,
		}),
		[
			enableThreads,
			auth.flow,
			width,
			height,
			host,
			roomId,
			channelName,
			anonymousMode,
			showRoles,
			showAvatar,
			hideHeader,
		]
	);
	const RCInstanceContextValue = useMemo(() => ({ RCInstance, ECOptions }), [RCInstance, ECOptions]);

	return (
		<GestureHandlerRootView>

			<View style={StyleSheet.compose([{ height, width }, style])}>
				<FontProvider>
					<RCInstanceProvider value={RCInstanceContextValue}>
						<ThemeProvider theme={theme || DefaultTheme}>
							<ECRouteProvider defaultName="login">
								<ECRoute name="login">
									<LoginView />
								</ECRoute>
								<ECRoute name="chat-room">
									<ChatRoomView />
								</ECRoute>
							</ECRouteProvider>
						</ThemeProvider>
					</RCInstanceProvider>
				</FontProvider>
			</View>
		</GestureHandlerRootView>
	);
};

// EmbeddedChat.propTypes = {
// 	width: PropTypes.string,
// 	height: PropTypes.string,
// 	isClosable: PropTypes.bool,
// 	setClosableState: PropTypes.func,
// 	moreOpts: PropTypes.bool,
// 	host: PropTypes.string,
// 	roomId: PropTypes.string,
// 	channelName: PropTypes.string,
// 	anonymousMode: PropTypes.bool,
// 	headerColor: PropTypes.string,
// 	toastBarPosition: PropTypes.string,
// 	showRoles: PropTypes.bool,
// 	showAvatar: PropTypes.bool,
// 	enableThreads: PropTypes.bool,
// 	theme: PropTypes.object,
// 	auth: PropTypes.oneOfType([
// 		PropTypes.shape({ flow: PropTypes.oneOf(['MANAGED']) }),
// 		PropTypes.shape({
// 			flow: PropTypes.oneOf(['TOKEN']),
// 			credentials: PropTypes.object,
// 		}),
// 	]),
// 	className: PropTypes.string,
// 	style: PropTypes.object,
// 	hideHeader: PropTypes.bool,
// };

export default EmbeddedChat;
