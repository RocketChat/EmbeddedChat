import React from "react"

import BaseButton from "./BaseButton"

const ToggleEmojiButton = ({ show, open, close }) => {
	if (show) {
		return (
			<BaseButton
				onPress={close}
				accessibilityLabel="Close_emoji_selector"
				icon="keyboard"
			/>
		)
	}
	return (
		<BaseButton
			onPress={open}
			accessibilityLabel="Open_emoji_selector"
			icon="emoji"
		/>
	)
}

export default ToggleEmojiButton
