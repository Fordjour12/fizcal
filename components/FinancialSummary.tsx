import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function FinancialSummary() {
    // Mocked data; replace with data fetched from SQLite or state
    const totalIncome = 5000.0;
    const totalExpenses = 3200.0;
    const balance = totalIncome - totalExpenses;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#8B5CF6', '#6366F1']}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.title}>Financial Summary</Text>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.label}>Income</Text>
                        <Text style={styles.value}>${totalIncome.toFixed(2)}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Expenses</Text>
                        <Text style={styles.value}>${totalExpenses.toFixed(2)}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>Balance</Text>
                        <Text style={[styles.value, { color: balance >= 0 ? '#4ADE80' : '#FB7185' }]}>
                            ${balance >= 0 ? balance.toFixed(2) : `(${Math.abs(balance).toFixed(2)})`}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
        opacity: 0.9,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        alignItems: 'flex-start',
    },
    label: {
        fontSize: 14,
        color: '#E2E8F0',
        marginBottom: 4,
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});