import { Transaction as BaseTransaction } from '@/app';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Transaction extends BaseTransaction {
	accountName: string;
}
// Import your Drizzle database connection and schema
// import { db } from '../../../services/db'; // Adjust the path as needed
// import { transactions } from '../../../services/db/schemas'; // Adjust the path as needed
// import { eq, sql } from 'drizzle-orm';
import { DARK_BACKGROUND, PRIMARY_BUTTON_BG, SUBHEADER_TEXT, WHITE } from '@/constants/Colors';

// Function to fetch transactions for the current day from Drizzle
const fetchDailyTransactions = async (): Promise<Transaction[]> => {
	// Replace this with your actual data fetching logic using Drizzle
	// Example:
	// const today = new Date();
	// const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	// const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

	// const results = await db.select().from(transactions)
	//   .where(sql`${transactions.date} >= ${startOfDay.toISOString()} AND ${transactions.date} < ${endOfDay.toISOString()}`);

	// return results as Transaction[];
	return [
		{ id: '1', accountId: 'a1', type: 'expense', amount: 25.00, category: 'Food', description: 'Lunch', date: new Date(), accountName: 'Checking Account' },
		{ id: '2', accountId: 'a2', type: 'income', amount: 100.00, category: 'Salary', description: 'Monthly salary', date: new Date(), accountName: 'Savings Account' },
		{ id: '3', accountId: 'a1', type: 'expense', amount: 10.50, category: 'Transportation', description: 'Bus fare', date: new Date(), accountName: 'Checking Account' },
	];
};

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
	return (
		<React.Fragment>

			<View style={styles.transactionItem}>

				<View style={styles.transactionHeader}>
					<Text style={styles.transactionDescription}>{transaction.description}</Text>
					<Text style={transaction.type === 'income' ? styles.income : styles.expense}>
						{transaction.type === 'income' ? '+' : '-'} ${transaction.amount.toFixed(2)}
					</Text>
				</View>
				<View>
					<Text style={styles.transactionCategory}>{transaction.category}</Text>
					<Text style={styles.transactionAccount}>{transaction.accountName}</Text>
				</View>
			</View>
		</React.Fragment>
	);
};
export default function TransactionsScreen() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const router = useRouter();

	useEffect(() => {
		const getTransactions = async () => {
			const getTransactions = async () => {
				const data = await fetchDailyTransactions();
				setTransactions(data);
			};

			getTransactions();
		};

		getTransactions();
	}, []);

	const today = new Date();
	const formattedDate = today.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.newTransactionButton} onPress={() => router.push('/transactions/new')}>
				<Text style={styles.newTransactionButtonText}>New Tansaction</Text>
			</TouchableOpacity>
			<Text style={styles.dateHeader}>{formattedDate}</Text>
			<ScrollView>
				{transactions.map((transaction) => (
					<TransactionItem key={transaction.id} transaction={transaction} />
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: DARK_BACKGROUND, // Match DashboardScreen background
		padding: 16,
	},
	dateHeader: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
		color: WHITE, // Match DashboardScreen header text
	},
	transactionItem: {
		backgroundColor: PRIMARY_BUTTON_BG, // Darker background for contrast
		padding: 16,
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
		marginBottom: 8,
	},
	newTransactionButton: {
		backgroundColor: PRIMARY_BUTTON_BG,
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginBottom: 10,
	},
	newTransactionButtonText: {
		color: WHITE,
		fontSize: 16,
		fontWeight: 'bold',
	},
	transactionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	transactionDescription: {
		fontSize: 18,
		fontWeight: 'semibold',
		color: WHITE, // White text for description
	},
	income: {
		color: 'green',
	},
	expense: {
		color: 'red',
	},
	transactionCategory: {
		color: SUBHEADER_TEXT, // Grayish color for category
	},
	transactionAccount: {
		color: SUBHEADER_TEXT,
		fontSize: 12,
	},
});
