/* eslint-disable react-native/no-unused-styles */
import React, { useContext, useMemo } from "react"
import { StyleSheet, View } from 'react-native';
import { Avatar } from "../Avatar"
import { useRCContext } from "../../contexts/RCInstance"
import { MessageContext } from "../../contexts/MessageContext";

const MessageAvatar = () => {
	const { RCInstance } = useRCContext();
	const { message } = useContext(MessageContext);
	const { avatarUrl, small } = useMemo(() => {
		const host = RCInstance.getHost();
		const avatarUrl = `${host}/avatar/${message.u.username}`;
		const small = !!message.t;
		return { avatarUrl, small };
	}, [message, RCInstance]);

	const styles = useMemo(() => StyleSheet.create({
		container: {
			height: small ? 20 : 36,
			width: 36,
			flexDirection: 'row',
			justifyContent: 'flex-end',
			alignItems: 'flex-start'
		},
	}));

	return (
		<View style={styles.container}>
			<Avatar
				style={styles.avatar}
				size={small ? 20 : 36}
				borderRadius={small ? 2 : 4}
				url={avatarUrl}
				name={message.u.username}
			/>
		</View>
	)
}

MessageAvatar.displayName = "MessageAvatar"

export default MessageAvatar
