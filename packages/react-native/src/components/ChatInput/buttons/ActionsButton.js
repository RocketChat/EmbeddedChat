import React from "react"

import BaseButton from "./BaseButton"

const ActionsButton = ({ onPress }) => (
	<BaseButton
		onPress={onPress}
		accessibilityLabel="Message_actions"
		icon="add"
	/>
)

export default ActionsButton
