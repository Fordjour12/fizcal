import { KeyboardAwareView } from "@/components/KeyboardAwareView";
import { useAuth } from "@/contexts/auth";
import * as schema from "@/services/db/schemas";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useState } from "react";
import {
	Modal,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

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
	const [modalVisible, setModalVisible] = useState(false);
	const [formData, setFormData] = useState({
		category: "",
		amount: "",
		period: "monthly" as "weekly" | "monthly" | "yearly",
		isRecurring: true,
	});

	const { session } = useAuth();
	const sqlite = useSQLiteContext();
	const db = drizzle(sqlite, { schema });

	const loadData = useCallback(async () => {
		if (!session?.user?.id) return;

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
								gte(transactions.date, startDate.getTime()),
								lte(transactions.date, endDate.getTime()),
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
					};
				}),
			);

			setBudgets(budgetsWithSpent);
		} catch (error) {
			console.error("Error loading budgets:", error);
		}
	}, [session?.user?.id, db]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await loadData();
		setRefreshing(false);
	}, [loadData]);

	const handleAddBudget = async () => {
		if (!session?.user?.id) return;

		try {
			const startDate = new Date();
			const endDate = new Date();
			
			// Set end date based on period
			switch (formData.period) {
				case "weekly":
					endDate.setDate(startDate.getDate() + 7);
					break;
				case "monthly":
					endDate.setMonth(startDate.getMonth() + 1);
					break;
				case "yearly":
					endDate.setFullYear(startDate.getFullYear() + 1);
					break;
			}

			const newBudget = {
				category: formData.category,
				amount: Number.parseFloat(formData.amount),
				period: formData.period,
				startDate: startDate,
				endDate: formData.isRecurring ? null : endDate,
				isRecurring: formData.isRecurring,
			};

			await db.insert(schema.budgets).values(newBudget);
			await loadData();
			setModalVisible(false);
			resetForm();
		} catch (error) {
			console.error("Error adding budget:", error);
		}
	};

	const resetForm = () => {
		setFormData({
			category: "",
			amount: "",
			period: "monthly",
			isRecurring: true,
		});
	};

	const formatCurrency = (amount: number) => {
		return amount.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
		});
	};

	const getProgressColor = (spent: number, budget: number) => {
		const ratio = spent / budget;
		if (ratio < 0.5) return ["#059669", "#047857"]; // Green
		if (ratio < 0.8) return ["#EAB308", "#CA8A04"]; // Yellow
		return ["#DC2626", "#B91C1C"]; // Red
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
					<TouchableOpacity
						style={styles.addButton}
						onPress={() => {
							resetForm();
							setModalVisible(true);
						}}
					>
						<LinearGradient
							colors={["#8B5CF6", "#6366F1"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={styles.addButtonGradient}
						>
							<Text style={styles.addButtonText}>Add Budget</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</ScrollView>

			{/* Add Budget Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Add Budget</Text>

						<TextInput
							style={styles.input}
							placeholder="Category (e.g., Food, Transport)"
							value={formData.category}
							onChangeText={(text) =>
								setFormData({ ...formData, category: text })
							}
							placeholderTextColor="#666"
						/>

						<TextInput
							style={styles.input}
							placeholder="Amount"
							value={formData.amount}
							onChangeText={(text) =>
								setFormData({ ...formData, amount: text })
							}
							keyboardType="decimal-pad"
							placeholderTextColor="#666"
						/>

						<View style={styles.formGroup}>
							<Text style={styles.label}>Period</Text>
							<View style={styles.periodButtons}>
								{["weekly", "monthly", "yearly"].map((period) => (
									<TouchableOpacity
										key={period}
										style={[
											styles.periodButton,
											formData.period === period &&
												styles.periodButtonActive,
										]}
										onPress={() =>
											setFormData({
												...formData,
												period: period as any,
											})
										}
									>
										<Text
											style={[
												styles.periodButtonText,
												formData.period === period &&
													styles.periodButtonTextActive,
											]}
										>
											{period.charAt(0).toUpperCase() +
												period.slice(1)}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						<TouchableOpacity
							style={styles.recurringButton}
							onPress={() =>
								setFormData({
									...formData,
									isRecurring: !formData.isRecurring,
								})
							}
						>
							<View
								style={[
									styles.checkbox,
									formData.isRecurring && styles.checkboxActive,
								]}
							/>
							<Text style={styles.recurringButtonText}>
								Recurring Budget
							</Text>
						</TouchableOpacity>

						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={[styles.modalButton, styles.cancelButton]}
								onPress={() => {
									setModalVisible(false);
									resetForm();
								}}
							>
								<Text style={styles.buttonText}>Cancel</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.modalButton, styles.saveButton]}
								onPress={handleAddBudget}
							>
								<Text style={styles.buttonText}>Add</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
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
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "#1E293B",
		padding: 20,
		borderRadius: 16,
		width: "90%",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#FFFFFF",
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		backgroundColor: "#334155",
		padding: 12,
		borderRadius: 8,
		color: "#FFFFFF",
		marginBottom: 12,
	},
	formGroup: {
		marginBottom: 16,
	},
	label: {
		color: "#94A3B8",
		fontSize: 14,
		marginBottom: 8,
	},
	periodButtons: {
		flexDirection: "row",
		gap: 8,
	},
	periodButton: {
		flex: 1,
		paddingVertical: 8,
		borderRadius: 8,
		backgroundColor: "#334155",
		alignItems: "center",
	},
	periodButtonActive: {
		backgroundColor: "#4F46E5",
	},
	periodButtonText: {
		color: "#94A3B8",
		fontSize: 14,
	},
	periodButtonTextActive: {
		color: "#FFFFFF",
	},
	recurringButton: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: "#4F46E5",
		marginRight: 8,
	},
	checkboxActive: {
		backgroundColor: "#4F46E5",
	},
	recurringButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	modalButton: {
		flex: 1,
		padding: 12,
		borderRadius: 8,
		marginHorizontal: 5,
	},
	cancelButton: {
		backgroundColor: "#475569",
	},
	saveButton: {
		backgroundColor: "#4F46E5",
	},
	buttonText: {
		color: "#FFFFFF",
		textAlign: "center",
		fontWeight: "600",
	},
});