import { Stack } from "expo-router";

export default function BoardingLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: "slide_from_right",
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: "Welcome",
				}}
			/>
			<Stack.Screen
				name="userSetup"
				options={{
					title: "User Setup",
				}}
			/>

			<Stack.Screen
				name="accountSetup"
				options={{
					title: "Account Setup",
				}}
			/>
		</Stack>
	);
}
