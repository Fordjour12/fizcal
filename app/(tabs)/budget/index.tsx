import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function BudgetScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Budgets</Text>
                <Link href="/budget/new" asChild>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ New Budget</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <View style={styles.content}>
                <Text style={styles.emptyText}>No budgets yet</Text>
                <Text style={styles.subText}>Create a budget to start tracking your spending</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#0F172A"
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    addButton: {
        backgroundColor: '#3700B3',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        marginBottom: 8,
    },
    subText: {
        fontSize: 14,
        color: '#666',
    },
});