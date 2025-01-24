import { Stack } from 'expo-router';

export default function BudgetLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Budget',
                }}
            />
            <Stack.Screen
                name="new"
                options={{
                    title: 'New Budget Entry',
                    presentation: 'modal',
                }}
            />
        </Stack>
    );
}


