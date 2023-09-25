import React from "react";
import { StyleSheet } from "react-native";
import { useMessageContext } from "../../contexts/MessageContext";
import useComponentOverrides from "../../theme/useComponentOverrides";
import { Box } from "../Box";
import Markdown from "../Markdown/Markdown";

const MessageBody = ({ style }) => {
	const { styleOverrides } = useComponentOverrides('MessageBody', style);
	const { message } = useMessageContext();
	const isInfo = !!message.t;

	if (isInfo) {
		return null;
	}
	return (
		<Box
			style={StyleSheet.compose([
				styles.container,
				message.isPending && styles.pendingMessage,
				styleOverrides,
			])}
		>
			{message.attachments && message.attachments.length > 0 ? (
				<>
					<Markdown body={message} isReaction={false} />
					{/* TODO <Attachments attachments={message.attachments} /> */}
				</>
			) : (
				<Markdown body={message} isReaction={false} />
			)}
		</Box>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	pendingMessage: {
		opacity: 0.4,
	},
}) 
export default MessageBody;
