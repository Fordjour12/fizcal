import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function BudgetProgress() {
    // Mocked data for budget progress
    const budgets = [
        { name: "Groceries", spent: 200, limit: 500 },
        { name: "Entertainment", spent: 100, limit: 200 },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Budget Progress</Text>
            {budgets.map((budget, index) => {
                const progress = budget.spent / budget.limit;
                const progressWidth = `${Math.min(progress * 100, 100)}%`;

                return (
                    <View key={index} style={styles.budgetItem}>
                        <View style={styles.headerRow}>
                            <Text style={styles.budgetName}>{budget.name}</Text>
                            <Text style={styles.budgetSpent}>
                                ${budget.spent} <Text style={styles.budgetLimit}>/ ${budget.limit}</Text>
                            </Text>
                        </View>

                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, { width: progressWidth }]}>
                                <LinearGradient
                                    colors={progress > 0.75 ? ['#FB7185', '#F43F5E'] : ['#4ADE80', '#22C55E']}
                                    style={styles.progressGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                />
                            </View>
                        </View>
                    </View>
                );
            })}
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
    budgetItem: {
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    budgetName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#E2E8F0',
    },
    budgetSpent: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    budgetLimit: {
        color: '#94A3B8',
        fontWeight: 'normal',
    },
    progressContainer: {
        height: 8,
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
    },
    progressGradient: {
        flex: 1,
        borderRadius: 4,
    },
});