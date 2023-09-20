import { useTheme } from '@emotion/react';
import React, { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';
import { isSameDay, format } from 'date-fns';
import { colors } from '../../lib/constants';
import { useMessageStore } from '../../store';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Message } from '../Message';
import styles from  './styles';
import Divider from '../Markup/elements/Divider';

const MessageList = () => {
	const messages = useMessageStore(state => state.messages);
	const { styleOverrides } = useComponentOverrides('MessageList', styles);
	const theme = useTheme();
	const renderItem = useCallback(({ item, index }) => {
		const prev = messages[index + 1]; // since the list is reversed
		const isNewDay = !prev || !isSameDay(new Date(item.ts), new Date(prev.ts));
		return (
			<>
				<View style={{ flexDirection: 'row', marginVertical: 8, alignItems: 'center', gap: 5 }}>
					{isNewDay ? 
						<>
							<Divider style={{ flex: 1 }} />
							<Text>{format(new Date(item.ts), 'MMMM d, yyyy')}</Text>
							<Divider style={{ flex: 1 }} />
						</>:
						null
					}
				</View>
				<Message message={item} />
			</>
		)
			
	}, [messages]);

	return (
		<>
			<FlatList
				inverted
				data={messages}
				renderItem={renderItem}
				style={[
					{
						backgroundColor:
							colors[theme.palette?.mode].backgroundColor,
					},
					styleOverrides,
				]}
				keyExtractor={(item) => item._id}
			/>
		</>
	);
}

export default MessageList;
