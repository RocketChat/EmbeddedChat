import React from "react";
import { View, StyleSheet } from "react-native";

const Divider = ({ style = {}, ...props }) => {
	return (
		<View
			{...props}
			style={StyleSheet.compose([
				{
					borderBottomColor: "black",
					borderBottomWidth: StyleSheet.hairlineWidth,
				},
				style,
			])}
		/>
	);
};

export default Divider;
