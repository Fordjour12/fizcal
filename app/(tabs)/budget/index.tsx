import { KeyboardAwareView } from "@/components/KeyboardAwareView";
import { useAuth } from "@/contexts/auth";
import * as schema from "@/services/db/schemas";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useState } from "react";
import {
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { Link } from "expo-router";

type Budget = {
	id: string;
	category: string;
	amount: number;
	period: "weekly" | "monthly" | "yearly";
	startDate: Date;
	endDate?: Date;
	isRecurring: boolean;
	spent?: number; // Calculated field
};

export default function BudgetScreen() {
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [refreshing, setRefreshing] = useState(false);

	const { user } = useAuth();
	const sqlite = useSQLiteContext();
	const db = drizzle(sqlite, { schema });

	const loadData = useCallback(async () => {
		if (user?.id) return;

		try {
			// Load budgets
			const budgetResults = await db.query.budgets.findMany();

			// Calculate spent amount for each budget
			const budgetsWithSpent = await Promise.all(
				budgetResults.map(async (budget) => {
					const startDate = new Date(budget.startDate);
					const endDate = budget.endDate
						? new Date(budget.endDate)
						: new Date();

					// Get all transactions in the budget category during the period
					const transactions = await db.query.transactions.findMany({
						where: (transactions, { eq, and, gte, lte }) =>
							and(
								eq(transactions.category, budget.category),
								gte(transactions.date, startDate),
								lte(transactions.date, endDate),
							),
					});

					// Calculate total spent
					const spent = transactions.reduce(
						(total, t) =>
							total + (t.type === "expense" ? t.amount : 0),
						0,
					);

					return {
						...budget,
						spent,
						startDate,
						endDate: budget.endDate ? new Date(budget.endDate) : undefined,
						period: budget.period as "weekly" | "monthly" | "yearly",
					};
				}),
			);

			setBudgets(budgetsWithSpent);
		} catch (error) {
			console.error("Error loading budgets:", error);
		}
	}, [user?.id, db]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await loadData();
		setRefreshing(false);
	}, [loadData]);

	const formatCurrency = (amount: number) => {
		return amount.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
		});
	};

	const getProgressColor = (spent: number, budget: number): readonly [string, string] => {
		const ratio = spent / budget;
		if (ratio < 0.5) return ["#059669", "#047857"] as const; // Green
		if (ratio < 0.8) return ["#EAB308", "#CA8A04"] as const; // Yellow
		return ["#DC2626", "#B91C1C"] as const; // Red
	};

	return (
		<KeyboardAwareView style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View style={styles.content}>
					 {/* Empty State */}
					 {budgets.length === 0 && (
						<View style={styles.emptyState}>
							<Text style={styles.emptyStateText}>No budgets created yet</Text>
							<Text style={styles.emptyStateSubtext}>
								Create your first budget to start tracking your expenses
							</Text>
						</View>
					)}

					{/* Budgets List */}
					<View style={styles.budgetsList}>
						{budgets.map((budget, index) => (
							<Animated.View
								key={budget.id}
								entering={FadeIn.delay(index * 100).duration(500)}
								exiting={FadeOut.duration(300)}
								layout={Layout.springify()}
							>
								<LinearGradient
									colors={getProgressColor(
										budget.spent || 0,
										budget.amount,
									)}
									style={styles.budgetCard}
								>
									<View style={styles.budgetInfo}>
										<Text style={styles.budgetCategory}>
											{budget.category}
										</Text>
										<Text style={styles.budgetPeriod}>
											{budget.period.charAt(0).toUpperCase() +
												budget.period.slice(1)}
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

					{/* Add Budget Button */}
					<Link href="/budget/new" asChild>
						<TouchableOpacity style={styles.addButton}>
							<LinearGradient
								colors={["#8B5CF6", "#6366F1"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={styles.addButtonGradient}
							>
								<Text style={styles.addButtonText}>Add Budget</Text>
							</LinearGradient>
						</TouchableOpacity>
					</Link>
				</View>
			</ScrollView>
		</KeyboardAwareView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F172A",
	},
	scrollView: {
		flex: 1,
	},
	content: {
		padding: 16,
	},
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
	addButton: {
		marginTop: 8,
	},
	addButtonGradient: {
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
	},
	addButtonText: {
		color: "#F8FAFC",
		fontSize: 16,
		fontWeight: "600",
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 32,
		marginBottom: 24,
	},
	emptyStateText: {
		color: '#F8FAFC',
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 8,
	},
	emptyStateSubtext: {
		color: '#94A3B8',
		fontSize: 14,
		textAlign: 'center',
	},
});