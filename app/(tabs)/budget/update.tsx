import { KeyboardAwareView } from "@/components/KeyboardAwareView";
import * as schema from "@/services/db/schemas";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function UpdateBudgetScreen() {
	const { id } = useLocalSearchParams();
	const [budget, setBudget] = useState({
		category: "",
		amount: "",
		period: "",
		isRecurring: false,
	});
	const [loading, setLoading] = useState(false);

	const sqlite = useSQLiteContext();
	const db = drizzle(sqlite, { schema });

	useEffect(() => {
		const loadBudget = async () => {
			const result = await db
				.select()
				.from(schema.budgets)
				.where(eq(schema.budgets.id, Number(id)))
				.get();

			if (result) {
				setBudget({
					category: result.category,
					amount: result.amount.toString(),
					period: result.period,
					isRecurring: result.isRecurring,
				});
			}
		};
		loadBudget();
	}, [id, db]);

	const handleUpdate = async () => {
		setLoading(true);
		try {
			await db
				.update(schema.budgets)
				.set({
					category: budget.category,
					amount: Number(budget.amount),
					period: budget.period as "weekly" | "monthly" | "yearly",
					isRecurring: budget.isRecurring,
				})
				.where(eq(schema.budgets.id, Number(id)))
				.run();

			router.back();
		} catch (error) {
			console.error("Error updating budget:", error);
		} finally {
			setLoading(false);
		}
	};

	const PeriodSelector = ({ selected, onSelect }) => (
		<View style={styles.periodSelector}>
			{["weekly", "monthly", "yearly"].map((period) => (
				<TouchableOpacity
					key={period}
					onPress={() => onSelect(period)}
					style={[styles.periodButton, selected === period && styles.selectedPeriod]}
				>
					<Text style={[styles.periodButtonText, selected === period && styles.selectedPeriodText]}>
						{period.charAt(0).toUpperCase() + period.slice(1)}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);

	const periodOptions = [
		{ key: "weekly", value: "Weekly" },
		{ key: "monthly", value: "Monthly" },
		{ key: "yearly", value: "Yearly" },
	];

	return (
		<KeyboardAwareView style={styles.container}>
			<View style={styles.form}>
				<TextInput
					style={styles.input}
					placeholder="Category"
					placeholderTextColor="#94A3B8"
					value={budget.category}
					onChangeText={(text) =>
						setBudget((prev) => ({ ...prev, category: text }))
					}
				/>
				<TextInput
					style={styles.input}
					placeholder="Amount"
					placeholderTextColor="#94A3B8"
					keyboardType="numeric"
					value={budget.amount}
					onChangeText={(text) =>
						setBudget((prev) => ({ ...prev, amount: text }))
					}
				/>
				<PeriodSelector
					selected={budget.period}
					onSelect={(period) => setBudget((prev) => ({ ...prev, period }))}
				/>
				<TouchableOpacity
					style={[styles.button, budget.isRecurring && styles.selectedPeriod]}
					onPress={() =>
						setBudget((prev) => ({
							...prev,
							isRecurring: !prev.isRecurring,
						}))
					}
				>
					<Text style={[styles.buttonText, budget.isRecurring && styles.selectedPeriodText]}>
						{budget.isRecurring ? "Recurring" : "Not Recurring"}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.updateButton}
					onPress={handleUpdate}
					disabled={loading}
				>
					<LinearGradient
						colors={["#8B5CF6", "#6366F1"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.updateButtonGradient}
					>
						<Text style={styles.updateButtonText}>
							{loading ? "Updating..." : "Update Budget"}
						</Text>
					</LinearGradient>
				</TouchableOpacity>
			</View>
		</KeyboardAwareView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F172A",
	},
	form: {
		padding: 16,
		gap: 12,
	},
	input: {
		backgroundColor: "#1E293B",
		padding: 16,
		borderRadius: 12,
		color: "#F8FAFC",
		fontSize: 16,
	},
	select: {
		backgroundColor: "#1E293B",
		borderWidth: 0,
		padding: 16,
		borderRadius: 12,
	},
	selectText: {
		color: "#F8FAFC",
		fontSize: 16,
	},
	dropdown: {
		backgroundColor: "#1E293B",
		borderWidth: 0,
	},
	dropdownItem: {
		padding: 16,
	},
	dropdownText: {
		color: "#F8FAFC",
		fontSize: 16,
	},
	button: {
		backgroundColor: "#1E293B",
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
	},
	buttonText: {
		color: "#F8FAFC",
		fontSize: 16,
	},
	updateButton: {
		marginTop: 8,
	},
	updateButtonGradient: {
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
	},
	updateButtonText: {
		color: "#F8FAFC",
		fontSize: 16,
		fontWeight: "600",
	},
	periodSelector: {
		flexDirection: "row",
		gap: 8,
	},
	periodButton: {
		flex: 1,
		backgroundColor: "#1E293B",
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
	},
	selectedPeriod: {
		backgroundColor: "#6366F1",
	},
	periodButtonText: {
		color: "#F8FAFC",
		fontSize: 16,
	},
	selectedPeriodText: {
		color: "#FFFFFF",
		fontWeight: "600",
	},
});
