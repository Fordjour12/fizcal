import { Stack } from "expo-router";

export default function BudgetLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: "Budget",
				}}
			/>
			<Stack.Screen
				name="new"
				options={{
					title: "New Budget Entry",
				}}
			/>
			<Stack.Screen name="update" options={{ title: "Update Budget Entry" }} />
		</Stack>
	);
}
