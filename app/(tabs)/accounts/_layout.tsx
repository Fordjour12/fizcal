import { Stack } from "expo-router";

export default function AccountsLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Accounts",
				}}
			/>
			<Stack.Screen
				name="update"
				options={{
					title: "Update Account",
				}}
			/>
			<Stack.Screen
				name="new"
				options={{
					title: "New Account",
				}}
			/>
		</Stack>
	);
}
