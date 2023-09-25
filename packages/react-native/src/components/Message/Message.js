import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { MessageContextProvider } from '../../contexts/MessageContext';
import { useRCContext } from '../../contexts/RCInstance';
import MessageAvatar from './MessageAvatar';
import MessageContent from './MessageContent';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		gap: 5,
	}
})
const Message = ({ message, onMessageLongPress }) => {
	const { ECOptions } = useRCContext();
	const messageContext = useMemo(() => ({ message }), [message]);
	const onLongPress = useCallback(() => onMessageLongPress && onMessageLongPress(message), []);
	return (
		<MessageContextProvider value={messageContext}>
			<Touchable onLongPress={onLongPress}>
				<View style={styles.container}>
					{ECOptions.showAvatar ?
						<MessageAvatar /> :
						null
					}
					<MessageContent />
				</View>
			</Touchable>
		</MessageContextProvider>
	)
}

export default Message;
