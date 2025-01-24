import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useCallback, useState } from "react";
import { Animated, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

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
        {
            id: '2',
            name: 'Mobile Wallet',
            type: 'Mobile Money',
            balance: 200.00,
        },
        {
            id: '3',
            name: 'Emergency Fund',
            type: 'Bank',
            balance: 1000.00,
        }
    ]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));

    // Filter accounts based on search query
    const filteredAccounts = accounts.filter(account =>
        account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalBalance = filteredAccounts.reduce((sum, account) => sum + account.balance, 0);
    const accountTypeBreakdown = filteredAccounts.reduce((acc, account) => {
        acc[account.type] = (acc[account.type] || 0) + account.balance;
        return acc;
    }, {} as Record<string, number>);

    const getTypePercentage = (type: string) => {
        return ((accountTypeBreakdown[type] || 0) / totalBalance) * 100;
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate data fetching
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    // Fade in animation on mount
    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const renderRightActions = () => (
        <View style={styles.rightActions}>
            <Pressable style={[styles.actionButton, styles.deleteButton]}>
                <Text style={styles.actionButtonText}>Delete</Text>
            </Pressable>
        </View>
    );

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#6366F1"
                />
            }
        >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search accounts..."
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Total Balance */}
                <View style={styles.totalBalanceCard}>
                    <LinearGradient
                        colors={['#8B5CF6', '#6366F1']}
                        style={styles.totalGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.totalLabel}>Total Balance</Text>
                        <Text style={styles.totalAmount}>${totalBalance.toFixed(2)}</Text>
                        <View style={styles.breakdownContainer}>
                            {Object.entries(accountTypeBreakdown).map(([type, amount]) => (
                                <View key={type} style={styles.breakdownItem}>
                                    <View style={styles.breakdownHeader}>
                                        <Text style={styles.breakdownType}>{type}</Text>
                                        <Text style={styles.breakdownAmount}>${amount.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: `${getTypePercentage(type)}%` }]} />
                                    </View>
                                    <Text style={styles.breakdownPercentage}>
                                        {getTypePercentage(type).toFixed(1)}%
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </LinearGradient>
                </View>

                {/* Accounts List */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Your Accounts</Text>
                    <Link href="/boarding/accountSetup" asChild>
                        <Pressable style={styles.addButton}>
                            <Text style={styles.addButtonText}>+ Add Account</Text>
                        </Pressable>
                    </Link>
                </View>

                {filteredAccounts.map((account) => (
                    <Swipeable key={account.id} renderRightActions={renderRightActions}>
                        <View style={styles.accountCard}>
                            <LinearGradient
                                colors={['#8B5CF6', '#6366F1']}
                                style={styles.accountGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.cardLogo}>{account.type.toUpperCase()}</Text>
                                <Text style={styles.cardNumber}>•••• •••• •••• {account.id.padStart(4, '0')}</Text>
                                <View style={styles.cardDetails}>
                                    <View>
                                        <Text style={styles.cardLabel}>ACCOUNT HOLDER</Text>
                                        <Text style={styles.cardValue}>{account.name}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.cardLabel}>BALANCE</Text>
                                        <Text style={styles.cardValue}>${account.balance.toFixed(2)}</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>
                    </Swipeable>
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
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    content: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    searchInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 12,
        color: '#FFFFFF',
        fontSize: 16,
    },
    totalBalanceCard: {
        margin: 16,
        marginTop: 24,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    totalGradient: {
        padding: 24,
    },
    totalLabel: {
        color: '#E2E8F0',
        fontSize: 16,
        marginBottom: 8,
    },
    totalAmount: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    breakdownContainer: {
        gap: 16,
    },
    breakdownItem: {
        marginBottom: 8,
    },
    breakdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    breakdownType: {
        color: '#E2E8F0',
        fontSize: 14,
    },
    breakdownAmount: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        marginBottom: 4,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
    breakdownPercentage: {
        color: '#E2E8F0',
        fontSize: 12,
        textAlign: 'right',
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
        height: 200,
        elevation: 4,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    accountGradient: {
        padding: 24,
        height: '100%',
        justifyContent: 'space-between',
    },
    cardLogo: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    cardNumber: {
        color: '#FFFFFF',
        fontSize: 22,
        letterSpacing: 2,
        marginBottom: 20,
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardLabel: {
        color: '#E2E8F0',
        fontSize: 10,
        marginBottom: 4,
    },
    cardValue: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
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
    rightActions: {
        flexDirection: 'row',
        alignItems: 'stretch',
        marginRight: 16,
        height: 200,
    },
    deleteButton: {
        backgroundColor: '#EF4444',
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        borderRadius: 16,
    },
});