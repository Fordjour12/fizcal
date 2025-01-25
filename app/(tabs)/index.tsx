import BudgetProgress from "@/components/BudgetProgress";
import { CreditCard } from "@/components/CreditCard";
import FinancialSummary from "@/components/FinancialSummary";
import RecentTransactions from "@/components/RecentTransactions";
import { useAuth } from "@/contexts/auth";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DashboardScreen() {
	const { user } = useAuth();
	const [firstName] = user?.name?.split(" ") || [];

	return (
		<ScrollView style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.greeting}>Welcome back {firstName}! </Text>
				<Text style={styles.subHeader}>Here's your financial overview:</Text>
			</View>

			{/* Financial Summary */}
			<FinancialSummary />

			{/* Quick Actions */}
			<View style={styles.quickActions}>
				<Link href="/transactions/new" asChild>
					<Pressable style={styles.actionButton}>
						<Text style={styles.actionButtonText}>Add Transaction</Text>
					</Pressable>
				</Link>
				<Link href="/budget/new" asChild>
					<Pressable style={styles.actionButton}>
						<Text style={styles.actionButtonText}>Add Budget</Text>
					</Pressable>
				</Link>
			</View>

			{/* Budget Progress */}
			<BudgetProgress />

			{/* Recent Transactions */}
			<RecentTransactions />

			<CreditCard
				accountName="John Doe"
				accountNumber="1234 5678 9012 3456"
				balance={5000}
				type="debit"
			/>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	quickActions: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 24,
		gap: 12,
	},
	actionButton: {
		flex: 1,
		backgroundColor: "rgba(99, 102, 241, 0.1)",
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "rgba(99, 102, 241, 0.2)",
	},
	actionButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
		textAlign: "center",
	},
	container: {
		flex: 1,
		backgroundColor: "#0F172A",
		padding: 16,
	},
	header: {
		marginBottom: 24,
		marginTop: 8,
	},
	greeting: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#FFFFFF",
		marginBottom: 8,
	},
	subHeader: {
		fontSize: 16,
		color: "#94A3B8",
	},
});
