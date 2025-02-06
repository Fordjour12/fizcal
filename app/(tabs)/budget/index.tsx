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
import { BudgetList } from "@/components/BudgetList";

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
		try {
			// Load budgets
			const budgetResults = await db.query.budgets.findMany({
				orderBy: (budgets, { desc }) => [desc(budgets.startDate)]
			});

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
						id: budget.id.toString(),
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
	}, [db]);

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
					<BudgetList budgets={budgets} />

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
});