import { Platform, StyleSheet } from "react-native"

import { MAX_SCREEN_CONTENT_WIDTH } from "../lib/constants"

const defaultTextStyle = {
  textAlign: "left",
  backgroundColor: "transparent",
  ...Platform.select({
    android: {
      includeFontPadding: false
    }
  })
}

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  containerScrollView: {
    padding: 16,
    paddingBottom: 30
  },
  tabletScreenContent: {
    justifyContent: "center",
    alignSelf: "center",
    width: MAX_SCREEN_CONTENT_WIDTH
  },
  modalFormSheet: {
    // Following UIModalPresentationFormSheet size
    // this not change on different iPad sizes
    width: 540,
    height: 620,
    overflow: "hidden",
    borderRadius: 10
  },
  status: {
    position: "absolute",
    bottom: -2,
    right: -2,
    borderRadius: 10
  },
  textAlignCenter: {
    textAlign: "center"
  },
  opacity5: {
    opacity: 0.5
  },
  loginTitle: {
    fontSize: 20,
    marginVertical: 15,
    lineHeight: 28
  },
  loginSubtitle: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 15
  },
  separator: {
    height: StyleSheet.hairlineWidth
  },
  separatorTop: {
    borderTopWidth: StyleSheet.hairlineWidth
  },
  separatorBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  separatorVertical: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  separatorLeft: {
    borderLeftWidth: StyleSheet.hairlineWidth
  },
  textRegular: {
    ...defaultTextStyle,
    fontWeight: "400",
  },
  textMedium: {
    ...defaultTextStyle,
    fontWeight: "500",
  },
  textSemibold: {
    ...defaultTextStyle,
    fontWeight: "600",
  },
  textBold: {
    ...defaultTextStyle,
    fontWeight: "700",
  },
  inputLastChild: {
    marginBottom: 15
  },
  notchLandscapeContainer: {
    marginTop: -34,
    paddingHorizontal: 30
  }
})
