import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

type Budget = {
	id: string;
	category: string;
	amount: number;
	period: "weekly" | "monthly" | "yearly";
	startDate: Date;
	endDate?: Date;
	isRecurring: boolean;
	spent?: number;
};

interface BudgetListProps {
	budgets: Budget[];
}

export const BudgetList: React.FC<BudgetListProps> = ({ budgets }) => {
	const formatCurrency = (amount: number) => {
		return amount.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
		});
	};

	const getProgressColor = (
		spent: number,
		budget: number,
	): readonly [string, string] => {
		const ratio = spent / budget;
		if (ratio < 0.5) return ["#059669", "#047857"] as const;
		if (ratio < 0.8) return ["#EAB308", "#CA8A04"] as const;
		return ["#DC2626", "#B91C1C"] as const;
	};

	if (budgets.length === 0) {
		return (
			<View style={styles.emptyState}>
				<Text style={styles.emptyStateText}>No budgets created yet</Text>
				<Text style={styles.emptyStateSubtext}>
					Create your first budget to start tracking your expenses
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.budgetsList}>
			{budgets.map((budget, index) => (
				<Animated.View
					key={budget.id}
					entering={FadeIn.delay(index * 100).duration(500)}
					exiting={FadeOut.duration(300)}
					layout={Layout.springify()}
				>
					<LinearGradient
						colors={getProgressColor(budget.spent || 0, budget.amount)}
						style={styles.budgetCard}
					>
						<View style={styles.budgetInfo}>
							<Text style={styles.budgetCategory}>{budget.category}</Text>
							<Text style={styles.budgetPeriod}>
								{budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}
								{budget.isRecurring ? " (Recurring)" : ""}
							</Text>
						</View>
						<View style={styles.budgetAmounts}>
							<Text style={styles.budgetSpent}>
								Spent: {formatCurrency(budget.spent || 0)}
							</Text>
							<Text style={styles.budgetLimit}>
								Limit: {formatCurrency(budget.amount)}
							</Text>
						</View>
					</LinearGradient>
				</Animated.View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	budgetsList: {
		gap: 12,
		marginBottom: 24,
	},
	budgetCard: {
		padding: 16,
		borderRadius: 12,
	},
	budgetInfo: {
		marginBottom: 8,
	},
	budgetCategory: {
		color: "#F8FAFC",
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 4,
	},
	budgetPeriod: {
		color: "#F8FAFC",
		fontSize: 14,
		opacity: 0.8,
	},
	budgetAmounts: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	budgetSpent: {
		color: "#F8FAFC",
		fontSize: 16,
	},
	budgetLimit: {
		color: "#F8FAFC",
		fontSize: 16,
		fontWeight: "600",
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		padding: 32,
		marginBottom: 24,
	},
	emptyStateText: {
		color: "#F8FAFC",
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 8,
	},
	emptyStateSubtext: {
		color: "#94A3B8",
		fontSize: 14,
		textAlign: "center",
	},
});
