import { useTheme } from '@emotion/react';
import React, { useCallback, useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { isSameDay, format } from 'date-fns';
import { colors } from '../../lib/constants';
import { useMessageStore } from '../../store';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Message } from '../Message';
import Divider from '../Markup/elements/Divider';

const MessageList = ({ style }) => {
	const messages = useMessageStore(state => state.messages);
	const { styleOverrides } = useComponentOverrides('MessageList', style);
	const theme = useTheme();
	const setSelectedMessage = useMessageStore( state => state.setSelectedMessage );

	const onMessageLongPress = useCallback((message) => {
		setSelectedMessage(message);
	}, [setSelectedMessage])

	const renderItem = useCallback(({ item, index }) => {
		const prev = messages[index + 1]; // since the list is reversed
		const isNewDay = !prev || !isSameDay(new Date(item.ts), new Date(prev.ts));
		return (
			<>
				{/* Since the list is reversed, so placing divider after message */}
				<Message message={item} onMessageLongPress={onMessageLongPress}/>
				<View style={{ flexDirection: 'row', marginVertical: 8, alignItems: 'center', gap: 5 }}>
					{isNewDay ?
						<>
							<Divider style={{ flex: 1 }} />
							<Text>{format(new Date(item.ts), 'MMMM d, yyyy')}</Text>
							<Divider style={{ flex: 1 }} />
						</> :
						null
					}
				</View>
			</>
		)
			
	}, [messages]);

	const _style = useMemo(() => ([
		{
			backgroundColor:
				colors[theme.palette?.mode].backgroundColor,
			paddingHorizontal: 10,
		},
		styleOverrides,
	]), [styleOverrides, theme]);

	const keyExtractor = useCallback((item) => item._id, []);
	return (
		<>
			<FlatList
				inverted
				data={messages}
				renderItem={renderItem}
				removeClippedSubviews
				style={_style}
				maxToRenderPerBatch={20}
				keyExtractor={keyExtractor}
			/>
		</>
	);
}

export default MessageList;
