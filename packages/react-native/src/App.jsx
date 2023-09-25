import React, { StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { EmbeddedChat } from "./components";

const props = {
  host: 'http://192.168.1.11:3000',
  roomId: 'GENERAL',
  GOOGLE_CLIENT_ID: '',
  isClosable: true,
  setClosableState: true,
  moreOpts: true,
  channelName: 'general',
  anonymousMode: true,
  headerColor: 'white',
  toastBarPosition: 'bottom-end',
  showRoles: true,
  showAvatar: true,
  enableThreads: true,
  auth: {
    flow: 'MANAGED',
  },
  height: 400,
};

function App() {
  return (
    <View style={styles.container}>
      <EmbeddedChat {...props} />
    </View>
  );
}

let AppEntryPoint = App;

if (Constants.expoConfig.extra.storybookEnabled === "true") {
  AppEntryPoint = require("../.storybook").default;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    marginTop: 50,
  },
});

export default AppEntryPoint;
