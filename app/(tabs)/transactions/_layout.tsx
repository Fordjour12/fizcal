import { Stack } from 'expo-router';

export default function TransactionLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Transactions',
                }}
            />


            <Stack.Screen
                name="new"
                options={{
                    title: 'Add Transaction',
                }}
            />
        </Stack>
    );
}
