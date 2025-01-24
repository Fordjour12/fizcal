import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RecentTransactions() {
    // Mocked data for recent transactions
    const transactions = [
        { id: 1, name: "Groceries", amount: -50, date: "2025-01-21" },
        { id: 2, name: "Salary", amount: 1500, date: "2025-01-20" },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recent Transactions</Text>
            {transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionCard}>
                    <View style={styles.transactionInfo}>
                        <Text style={styles.transactionName}>{transaction.name}</Text>
                        <Text style={styles.transactionDate}>{transaction.date}</Text>
                    </View>
                    <Text
                        style={[
                            styles.transactionAmount,
                            { color: transaction.amount > 0 ? '#4ADE80' : '#FB7185' },
                        ]}
                    >
                        {transaction.amount > 0 ? '+' : ''}
                        ${Math.abs(transaction.amount).toFixed(2)}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.1)',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    transactionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(99, 102, 241, 0.1)',
    },
    transactionInfo: {
        flex: 1,
    },
    transactionName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#E2E8F0',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 14,
        color: '#94A3B8',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
});