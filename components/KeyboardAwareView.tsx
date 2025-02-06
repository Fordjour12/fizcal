import type React from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	type ViewStyle,
} from "react-native";

interface Props {
	children: React.ReactNode;
	style?: ViewStyle;
	offset?: number;
}

export function KeyboardAwareView({ children, style, offset = 90 }: Props) {
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={[styles.container, style]}
			keyboardVerticalOffset={Platform.OS === "ios" ? offset : 0}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.inner}>
					{children}
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	inner: {
		flex: 1,
	},
});
