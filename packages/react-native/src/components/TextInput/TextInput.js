import { useTheme } from "@emotion/react"
import React from "react"
import { TextInput as RNTextInput } from "react-native"

import { colors } from "../../lib/constants"
import useComponentOverrides from "../../theme/useComponentOverrides"

const TextInput = React.forwardRef(({ style, ...props }, ref) => {
	const theme = useTheme();
	const { styleOverrides } = useComponentOverrides('TextInput', style);
	return (
		<RNTextInput
			ref={ref}
			style={[{ color: colors[theme.palette.mode].titleText }, styleOverrides]}
			placeholderTextColor={colors[theme.palette.mode].auxiliaryText}
			keyboardAppearance={theme.palette.mode === "light" ? "light" : "dark"}
			{...props}
		/>
	)
})

TextInput.displayName = 'TextInput';

export default TextInput;
