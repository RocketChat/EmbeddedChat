/* eslint-disable react-native/no-unused-styles */
import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { format } from 'date-fns';
import { useMessageContext } from "../../contexts/MessageContext";
import useComponentOverrides from "../../theme/useComponentOverrides";
import { CustomIcon } from '../CustomIcon';
import { sharedStyles } from '../Styles';
import { useTheme } from '@emotion/react';
import { useUserStore } from '../../store';

const MessageHeader = () => {
	const { message } = useMessageContext();
	const { styleOverrides } = useComponentOverrides('MessageHeader');
	const theme = useTheme();
	const styles = useMemo(() => StyleSheet.create({
		container: {
			flexDirection: 'row',
			gap: 5,
			alignItems: 'baseline',
		},
		username: {
			flexShrink: 1,
			fontSize: 16,
			...sharedStyles.textSemibold
		},
		time: {
			fontSize: 13,
			marginLeft: 8,
			...sharedStyles.textRegular,
			color: theme.palette?.grey?.main || '#9ea2a8',
		}
	}), [])
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

	const authenticatedUserId = useUserStore(state => state.userId);
	const isStarred = useMemo(
		() =>
			message &&
			message.starred &&
			message.starred.find((u) => u._id === authenticatedUserId),
		[message, authenticatedUserId]
	);
	const isPinned = message.pinned;
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
						style={{ opacity: 0.5 }}
						name="edit"
						size={16}
					/>
				)}
				{isStarred?
					<CustomIcon
						style={{ opacity: 0.5 }}
						name="star-filled"
						size={16}
					/> :
					null
				}
				{isPinned?
					<CustomIcon
						style={{ opacity: 0.5 }}
						name="pin"
						size={16}
					/> :
					null
				}
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
