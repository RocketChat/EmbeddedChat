import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
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
const Message = ({ message }) => {
	const { ECOptions } = useRCContext();
	const messageContext = useMemo(() => ({ message }), [message]);
	return (
		<MessageContextProvider value={messageContext}>
			<View style={styles.container}>
				{ECOptions.showAvatar ?
					<MessageAvatar /> :
					null
				}
				<MessageContent />
			</View>
		</MessageContextProvider>
	)
}

export default Message;
