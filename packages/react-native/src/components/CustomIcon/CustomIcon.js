import React from "react"
import { createIconSetFromIcoMoon } from "@expo/vector-icons"
import { useTheme } from "@emotion/react"

const icoMoonConfig = require("./selection.json")

export const IconSet = createIconSetFromIcoMoon(
	icoMoonConfig,
	"custom",
	"custom.ttf"
)

const CustomIcon = ({ name, size, color, ...props }) => {
	const theme = useTheme();
	const _color = theme.palette[color] ? (
		theme.palette.mode === 'light' ?
			theme.palette[color].main : (
				theme.palette[color].dark || theme.palette[color].main
			)
	) : color
	return (
		<IconSet name={name} size={size} color={_color} {...props} />
	)
}
export default CustomIcon;
