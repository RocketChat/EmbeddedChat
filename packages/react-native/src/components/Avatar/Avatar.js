import React, { useMemo, useState } from "react";
import { View, Image, Text } from "react-native";
import Touchable from "react-native-platform-touchable";

const defaultColors = [
	'#2ecc71', // emerald
	'#3498db', // peter river
	'#8e44ad', // wisteria
	'#e67e22', // carrot
	'#e74c3c', // alizarin
	'#1abc9c', // turquoise
	'#2c3e50', // midnight blue
];

function sumChars(str) {
	let sum = 0;
	for (let i = 0; i < str.length; i++) {
		sum += str.charCodeAt(i);
	}

	return sum;
}

const Avatar = ({
	url,
	name = 'User',
	style,
	children,
	onPress,
	size = 25,
	borderRadius = 4,
}) => {
	const [showFallback, setShowFallback] = useState(false); 
	const backgroundColor = useMemo(() => {
		return defaultColors[sumChars(name) % defaultColors.length]
	}, [name]);

	const avatarStyle = useMemo(() => ({
			width: size,
			height: size,
			borderRadius,
			backgroundColor,
			alignItems: 'center',
			justifyContent: 'center'
	}), [backgroundColor]);

	const charStyle = useMemo(() => ({
		color: '#ffffff',
		fontSize: size * 0.75,
	}), []);

	let image = showFallback ? (
		<View style={avatarStyle}>
			<Text style={charStyle}>{(name.charAt(0) || '').toUpperCase()}</Text>
		</View>
	) : (
		<Image
			style={avatarStyle}
			source={{
				uri: url,
			}}
			onError={() => setShowFallback(true)}
		/>
	);

	if (onPress) {
		image = <Touchable onPress={onPress}>{image}</Touchable>;
	}

	return (
		<View style={[avatarStyle, style]}>
			{image}
			{children}
		</View>
	);
};

Avatar.displayName = "Avatar";

export default Avatar;
