import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { format } from 'date-fns';
import { useMessageContext } from "../../contexts/MessageContext";
import useComponentOverrides from "../../theme/useComponentOverrides";
import { CustomIcon } from '../CustomIcon';
import { sharedStyles } from '../Styles';

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 5,
		alignItems: 'center',
	},
	username: {
		flexShrink: 1,
		fontSize: 16,
		...sharedStyles.textSemibold
	},
	time: {
		fontSize: 13,
		marginLeft: 8,
		...sharedStyles.textRegular
	}
});

const MessageHeader = () => {
	const { message } = useMessageContext();
	const { styleOverrides } = useComponentOverrides('MessageHeader');

	const userActions = () => {
		switch (message.t) {
			case 'ul':
				return 'left the channel';
			case 'uj':
				return 'joined the channel';
			case 'ru':
				return `removed @${message.message || message.msg}`;
			case 'au':
				return `added @${message.message || message.msg}`;
			case 'message_pinned':
				return 'Pinned a message:';
			case 'rm':
				return 'message removed';
			default:
				return '';
		}
	};

	if (!message.t) {
		return (
			<View	style={[styles.container, styleOverrides]}>
				<Text style={styles.username}>
					{message.u?.name}
				</Text>
				<Text style={styles.time}>
					@{message.u.username}
				</Text>
				<Text style={styles.time}>
					{format(new Date(message.ts), 'h:mm a')}
				</Text>
				{message.editedAt && (
					<CustomIcon
						style={{ marginInlineEnd: '0.4rem', opacity: 0.5 }}
						name="edit"
						size="24"
					/>
				)}
			</View>
		);
	}

	return (
		<View	style={[styles.container, styleOverrides]}>
			<Text style={styles.username}>
				@{message.u.username}
			</Text>
			<Text style={styles.time}>
				{userActions()}
			</Text>
			<Text style={styles.time}>
				{format(new Date(message.ts), 'h:mm a')}
			</Text>
		</View>
	);
}

export default MessageHeader;
