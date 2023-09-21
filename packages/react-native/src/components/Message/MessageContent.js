import React from 'react';
import { StyleSheet } from 'react-native';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import MessageBody from './MessageBody';
import MessageHeader from "./MessageHeader";
import MessageMetrics from './MessageMetrics';

const MessageContent = ({style}) => {
	const { styleOverrides } = useComponentOverrides('MessageContent', style);
	return (
		<Box style={[styles.container, styleOverrides]}>
			<MessageHeader />
			<MessageBody />
			<MessageMetrics />
		</Box>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
	}
})
export default MessageContent;
