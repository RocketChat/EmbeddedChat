import { useTheme } from '@emotion/react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { CustomIcon } from '../CustomIcon';

const ActionItem = ({ onPress, text, icon, color }) => {
	const theme = useTheme();
	const _color = theme.palette?.[color]?.main || color; 
	return (
		<Touchable onPress={onPress}>
			<View style={styles.actionItem}>
				<CustomIcon name={icon} size={24} style={{ color: _color }}/>
				<Text style={{ color: _color}}>{text}</Text>
			</View>
		</Touchable>
	)
}

const styles = StyleSheet.create({
	actionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
		paddingVertical: 5,
		paddingHorizontal: 20,
		fontSize: 24,
		flex: 1,
	}
});

export default ActionItem;
