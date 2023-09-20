import React, { useEffect, useRef, useState } from "react"
import { Alert, StyleSheet, Text } from "react-native"
import { Button } from "../../components/Button";
import { FormTextInput } from "../../components/TextInput"
import { useTheme } from "@emotion/react"
import { colors } from "../../lib/constants"
import { Box } from "../../components/Box"
import { useRCContext } from "../../contexts/RCInstance"
import { useECRouter } from "../../contexts/Router"
import { sharedStyles } from "../../components/Styles";

const styles = StyleSheet.create({
	title: {
		...sharedStyles.textBold,
		fontSize: 22
	},
	inputContainer: {
		marginVertical: 16
	},
	loginButton: {
		marginTop: 16
	},
})

const LoginView = () => {
	const theme = useTheme();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const {RCInstance} = useRCContext();
	const {navigate} = useECRouter();
	const passwordInput = useRef();
	const onSubmit = async () => {
		try {
			setIsFetching(true);
			await RCInstance.auth.loginWithPassword({user: username, password});
		} catch (e) {
			Alert.alert("Login Failed", "Could not login into Rocket.Chat", [{ text: "OK" }]);
			console.error(e);
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		RCInstance.auth.onAuthChange((user) => {
			if (user) {
				navigate('chat-room');
			}
		})
	}, [RCInstance])

	return (
		<Box>
			<Text
				style={[
					styles.title,
					sharedStyles.textBold,
					{ color: colors[theme.palette.mode].titleText }
				]}
			>
				Login
			</Text>
			<FormTextInput
				label={"Username or email"}
				containerStyle={styles.inputContainer}
				placeholder={
					"Username or email"
				}
				keyboardType="email-address"
				returnKeyType="next"
				onChangeText={value => setUsername(value)}
				onSubmitEditing={() => {
					passwordInput.current?.focus()
				}}
				textContentType="username"
				autoComplete="username"
				value={username}
			/>
			<FormTextInput
				label={"Password"}
				inputRef={passwordInput}
				containerStyle={styles.inputContainer}
				placeholder={"Password"}
				returnKeyType="send"
				secureTextEntry
				onSubmitEditing={onSubmit}
				onChangeText={value => setPassword(value)}
				textContentType="password"
				autoComplete="password"
			/>
			<Button
				title={"Login"}
				onPress={onSubmit}
				loading={isFetching}
				disabled={isFetching}
				style={styles.loginButton}
				color="primary"
			/>
		</Box>
	)
}

export default LoginView;
