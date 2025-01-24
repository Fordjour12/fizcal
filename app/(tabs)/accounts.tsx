import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Account = {
    id: string;
    name: string;
    type: string;
    balance: number;
};

export default function AccountsScreen() {
    const [accounts] = useState<Account[]>([
        {
            id: '1',
            name: 'Main Savings',
            type: 'Bank',
            balance: 500.00,
        },
    ]);

    return (
        <ScrollView style={styles.container}>
            {/* Accounts List */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Accounts</Text>
                <Link href="/boarding/accountSetup" asChild>
                    <Pressable style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ Add Account</Text>
                    </Pressable>
                </Link>
            </View>

            {accounts.map((account) => (
                <View key={account.id} style={styles.accountCard}>
                    <LinearGradient
                        colors={['#8B5CF6', '#6366F1']}
                        style={styles.accountGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.accountInfo}>
                            <Text style={styles.accountName}>{account.name}</Text>
                            <Text style={styles.accountType}>{account.type}</Text>
                        </View>
                        <Text style={styles.accountBalance}>
                            ${account.balance.toFixed(2)}
                        </Text>
                    </LinearGradient>
                </View>
            ))}

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <Link href="/(tabs)/transactions/new" asChild>
                    <Pressable style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Add Transaction</Text>
                    </Pressable>
                </Link>
                <Link href="/(tabs)/accounts/details" asChild>
                    <Pressable style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>View Details</Text>
                    </Pressable>
                </Link>
                <Link href="/(tabs)/budget/new" asChild>
                    <Pressable style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Create Budget</Text>
                    </Pressable>
                </Link>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        flexWrap: 'wrap',
        gap: 8,
    },
    actionButton: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        padding: 12,
        borderRadius: 8,
        minWidth: 100,
        flex: 1,
        marginHorizontal: 4,
    },
    actionButtonText: {
        color: '#6366F1',
        textAlign: 'center',
        fontWeight: '600',
    },
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    addButton: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#6366F1',
        fontWeight: '600',
    },
    accountCard: {
        margin: 16,
        marginTop: 8,
        borderRadius: 16,
        overflow: 'hidden',
    },
    accountGradient: {
        padding: 20,
    },
    accountInfo: {
        marginBottom: 12,
    },
    accountName: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    accountType: {
        color: '#E2E8F0',
        fontSize: 14,
        marginTop: 4,
    },
    accountBalance: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
});