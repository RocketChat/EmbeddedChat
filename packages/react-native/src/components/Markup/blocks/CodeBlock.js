import { useTheme } from "@emotion/react"
import React from "react"
import { View } from "react-native"
import { colors } from "../../../lib/constants"
import styles from "../styles"
import CodeLine from "../elements/CodeLine"

const Code = ({ value }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.codeBlock,
        {
          backgroundColor: colors[theme.palette.mode].bannerBackground,
          borderColor: colors[theme.palette.mode].borderColor
        }
      ]}
    >
      {value.map((block, idx) => {
        switch (block.type) {
          case "CODE_LINE":
            return <CodeLine value={block.value} key={idx} />
          default:
            return null
        }
      })}
    </View>
  )
}

export default Code
