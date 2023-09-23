import React, { useCallback, useEffect, useRef, useState } from 'react';
import {Alert, View} from 'react-native';
import {useTheme} from '@emotion/react';
import { TextInput } from '../TextInput';
import { colors } from '../../lib/constants';
import styles from './styles';
import useComponentOverrides from '../../theme/useComponentOverrides';
import RightButtons from './RightButtons';
import { useMessageStore, useUserStore } from '../../store';
import { useRCContext } from '../../contexts/RCInstance';
import createPendingMessage from '../../lib/createPendingMessage';

const ChatInput = ({ style }) => {
	const theme = useTheme();
	const [showSend, setShowSend] = useState(false);
	const { styleOverrides } = useComponentOverrides('ChatInput', style);
	const themeColor = colors[theme.palette.mode];
	
	const { RCInstance, ECOptions } = useRCContext();

	const inputRef = useRef();
	const messageRef = useRef('');

	const editing = false;
	const recording = false;

	const handleMessageChange = (text) => {
		messageRef.current = text;
		inputRef.current?.setNativeProps({ text });
		setShowSend(!!text.trim());
	};

	const clearInput = useCallback(() => {
		inputRef.current?.setNativeProps({ text: ''});
		messageRef.current = '';
		setShowSend(true);
	}, [ setShowSend])

	const { isUserAuthenticated, setIsUserAuthenticated, user } = useUserStore(
		(state) => ({
			isUserAuthenticated: state.isUserAuthenticated,
			setIsUserAuthenticated: state.setIsUserAuthenticated,
			user: {
				_id: state.userId,
				username: state.username,
				name: state.name,
			}
		})
	);

	const {
		editMessage,
		setEditMessage,
		upsertMessage,
		replaceMessage,
		threadId,
		isEditMessageCalled,
		setIsEditMessageCalled
	} = useMessageStore((state) => ({
		editMessage: state.editMessage,
		setEditMessage: state.setEditMessage,
		isRecordingMessage: state.isRecordingMessage,
		upsertMessage: state.upsertMessage,
		replaceMessage: state.replaceMessage,
		threadId: state.threadMainMessage?._id,
		isEditMessageCalled: state.isEditMessageCalled,
		setIsEditMessageCalled: state.setIsEditMessageCalled,
	}));

	useEffect(() => {
		if (isEditMessageCalled && editMessage?.msg) {
			setIsEditMessageCalled(false);
			setEditMessage(editMessage),
			handleMessageChange(editMessage?.msg)
		}
	}, [isEditMessageCalled, editMessage?.msg, setEditMessage, setIsEditMessageCalled]);

	const sendMessage = useCallback(async () => {
		const message = messageRef.current;
		if (!message.length || !isUserAuthenticated) {

			console.log('Editing message')
			if (editMessage.msg) {
				setEditMessage({});
			}
			return;
		}
	
		clearInput();

		const processMessage = async () => {
			if (!editMessage.msg) {
				// New message is being sent

				// TODO slash command handling

				const pendingMessage = createPendingMessage(message, user);
				if (ECOptions.enableThreads && threadId) {
					pendingMessage.tmid = threadId;
				}
				upsertMessage(pendingMessage, ECOptions.enableThreads);
				const res = await RCInstance.sendMessage(
					{
						msg: pendingMessage.msg,
						_id: pendingMessage._id,
					},
					ECOptions.enableThreads ? threadId : undefined
				);

				if (!res.success) {
					Alert.alert('Error', 'Error sending message, login again', [{ text: 'OK' }]);
					await RCInstance.logout();
					setIsUserAuthenticated(false);
				} else {
					replaceMessage(pendingMessage._id, res.message);
				}
			} else {
				// A message is being edited
				const res = await RCInstance.updateMessage(editMessage._id, message);
				if (!res.success) {
					await RCInstance.logout();
					setIsUserAuthenticated(false);
					Alert.alert('Error', 'Error editing message, login again', [{ text: 'OK' }]);
				}
				setEditMessage({});
			}
		}
		processMessage();
	}, [
		setEditMessage,
		setIsUserAuthenticated,
		editMessage,
		user,
		threadId,
		ECOptions.enableThreads,
		upsertMessage,
		clearInput,
		RCInstance,
		// commands, 
		// execCommand,
	])
	return (
		<View style={[styles.composer, { borderTopColor: themeColor.borderColor }, styleOverrides ]}>
			<View
				style={[
					styles.textArea,
					{ backgroundColor: themeColor.messageboxBackground },
					!recording && editing && { backgroundColor: themeColor.chatComponentBackground }
				]}
			>
				<TextInput
					ref={inputRef}
					style={[styles.textBoxInput, { color: themeColor.bodyText }]}
					returnKeyType='default'
					keyboardType='twitter'
					blurOnSubmit={false}
					placeholder={'New Message'}
					placeholderTextColor={themeColor.auxiliaryText}
					onChangeText={handleMessageChange}
					underlineColorAndroid='transparent'
					defaultValue=''
					multiline
				/>
				<RightButtons
					showSend={showSend} //  TO be revisited
					submit={sendMessage}
					showMessageBoxActions={() => {}}
					isActionsEnabled={false}
				/>		
			</View>
		</View>
	)
}

export default ChatInput;
