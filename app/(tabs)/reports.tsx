import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	RefreshControl,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/auth";
import * as schema from "@/services/db/schemas";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import RecentTransactions from '@/components/RecentTransactions';

type TimeFrame = "week" | "month" | "year";

interface Transaction {
	id: string;
	type: "income" | "expense";
	amount: number;
	category: string;
	date: Date;
}

interface CategoryTotal {
	category: string;
	total: number;
	color: string;
}

export default function Reports() {
	const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>("week");
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [totalIncome, setTotalIncome] = useState(0);
	const [totalExpense, setTotalExpense] = useState(0);
	const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);

	const { session } = useAuth();
	const sqlite = useSQLiteContext();
	const db = drizzle(sqlite, { schema });

	const colors = [
		"#059669",
		"#DC2626",
		"#EAB308",
		"#8B5CF6",
		"#EC4899",
		"#14B8A6",
		"#F97316",
		"#6366F1",
	];

	const loadData = useCallback(async () => {
		if (!session?.user?.id) return;

		try {
			const startDate = new Date();
			let endDate = new Date();

			// Set date range based on timeframe
			switch (activeTimeFrame) {
				case "week":
					startDate.setDate(endDate.getDate() - 7);
					break;
				case "month":
					startDate.setMonth(endDate.getMonth() - 1);
					break;
				case "year":
					startDate.setFullYear(endDate.getFullYear() - 1);
					break;
			}

			// Load transactions
			const transactionResults = await db.query.transactions.findMany({
				where: (transactions, { and, gte, lte }) =>
					and(
						gte(transactions.date, startDate.getTime()),
						lte(transactions.date, endDate.getTime()),
					),
			});

			setTransactions(transactionResults as Transaction[]);

			// Calculate totals
			let income = 0;
			let expense = 0;
			const categoryMap = new Map<string, number>();

			transactionResults.forEach((t) => {
				if (t.type === "income") {
					income += t.amount;
				} else {
					expense += t.amount;
					const currentTotal = categoryMap.get(t.category) || 0;
					categoryMap.set(t.category, currentTotal + t.amount);
				}
			});

			setTotalIncome(income);
			setTotalExpense(expense);

			// Calculate category totals
			const totals = Array.from(categoryMap.entries())
				.map(([category, total], index) => ({
					category,
					total,
					color: colors[index % colors.length],
				}))
				.sort((a, b) => b.total - a.total);

			setCategoryTotals(totals);
		} catch (error) {
			console.error("Error loading transactions:", error);
		}
	}, [session?.user?.id, db, activeTimeFrame]);

	useEffect(() => {
		loadData();
	}, [loadData, activeTimeFrame]);

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

	const getChartData = () => {
		const data: { [key: string]: { labels: string[]; data: number[] } } = {
			week: {
				labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				data: new Array(7).fill(0),
			},
			month: {
				labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
				data: new Array(4).fill(0),
			},
			year: {
				labels: [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				],
				data: new Array(12).fill(0),
			},
		};

		transactions.forEach((t) => {
			const date = new Date(t.date);
			if (t.type === "expense") {
				switch (activeTimeFrame) {
					case "week":
						const day = date.getDay();
						data.week.data[day] += t.amount;
						break;
					case "month":
						const week = Math.floor(date.getDate() / 7);
						data.month.data[week] += t.amount;
						break;
					case "year":
						const month = date.getMonth();
						data.year.data[month] += t.amount;
						break;
				}
			}
		});

		return data[activeTimeFrame];
	};

	const chartData = getChartData();

	return (
		<ScrollView
			style={styles.container}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			{/* Time Frame Selector */}
			<View style={styles.timeFrameSelector}>
				{(["week", "month", "year"] as TimeFrame[]).map((timeFrame) => (
					<TouchableOpacity
						key={timeFrame}
						style={[
							styles.timeFrameButton,
							activeTimeFrame === timeFrame &&
								styles.timeFrameButtonActive,
						]}
						onPress={() => setActiveTimeFrame(timeFrame)}
					>
						<Text
							style={[
								styles.timeFrameButtonText,
								activeTimeFrame === timeFrame &&
									styles.timeFrameButtonTextActive,
							]}
						>
							{timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* Summary Cards */}
			<View style={styles.summaryContainer}>
				<LinearGradient
					colors={["#059669", "#047857"]}
					style={styles.summaryCard}
				>
					<Text style={styles.summaryLabel}>Income</Text>
					<Text style={styles.summaryAmount}>
						{formatCurrency(totalIncome)}
					</Text>
				</LinearGradient>

				<LinearGradient
					colors={["#DC2626", "#B91C1C"]}
					style={styles.summaryCard}
				>
					<Text style={styles.summaryLabel}>Expenses</Text>
					<Text style={styles.summaryAmount}>
						{formatCurrency(totalExpense)}
					</Text>
				</LinearGradient>

				<LinearGradient
					colors={["#8B5CF6", "#6366F1"]}
					style={styles.summaryCard}
				>
					<Text style={styles.summaryLabel}>Balance</Text>
					<Text style={styles.summaryAmount}>
						{formatCurrency(totalIncome - totalExpense)}
					</Text>
				</LinearGradient>
			</View>

			{/* Expense Trend Chart */}
			<View style={styles.chartContainer}>
				<Text style={styles.chartTitle}>Expense Trend</Text>
				<LineChart
					data={{
						labels: chartData.labels,
						datasets: [
							{
								data: chartData.data,
							},
						],
					}}
					width={Dimensions.get("window").width - 32}
					height={220}
					chartConfig={{
						backgroundColor: "#1E293B",
						backgroundGradientFrom: "#1E293B",
						backgroundGradientTo: "#1E293B",
						decimalPlaces: 0,
						color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						style: {
							borderRadius: 16,
						},
					}}
					bezier
					style={styles.chart}
				/>
			</View>

			{/* Category Breakdown */}
			<View style={styles.categoryContainer}>
				<Text style={styles.chartTitle}>Expense Categories</Text>
				{categoryTotals.length > 0 ? (
					<>
						<PieChart
							data={categoryTotals.map((cat) => ({
								name: cat.category,
								population: cat.total,
								color: cat.color,
								legendFontColor: "#94A3B8",
								legendFontSize: 12,
							}))}
							width={Dimensions.get("window").width - 32}
							height={220}
							chartConfig={{
								color: (opacity = 1) =>
									`rgba(255, 255, 255, ${opacity})`,
							}}
							accessor="population"
							backgroundColor="transparent"
							paddingLeft="15"
							absolute
						/>
						<View style={styles.categoryList}>
							{categoryTotals.map((category) => (
								<View
									key={category.category}
									style={styles.categoryItem}
								>
									<View style={styles.categoryHeader}>
										<View
											style={[
												styles.categoryDot,
												{ backgroundColor: category.color },
											]}
										/>
										<Text style={styles.categoryName}>
											{category.category}
										</Text>
									</View>
									<Text style={styles.categoryAmount}>
										{formatCurrency(category.total)}
									</Text>
								</View>
							))}
						</View>
					</>
				) : (
					<Text style={styles.noDataText}>No expense data available</Text>
				)}
			</View>

			{/* Recent Transactions */}
			<View style={styles.transactionList}>
				<Text style={styles.sectionTitle}>Recent Transactions</Text>
				<RecentTransactions/>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F172A",
	},
	timeFrameSelector: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 16,
		gap: 8,
	},
	timeFrameButton: {
		flex: 1,
		backgroundColor: "#1E293B",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	timeFrameButtonActive: {
		backgroundColor: "#4F46E5",
	},
	timeFrameButtonText: {
		color: "#94A3B8",
		fontSize: 14,
		fontWeight: "600",
	},
	timeFrameButtonTextActive: {
		color: "#FFFFFF",
	},
	summaryContainer: {
		flexDirection: "row",
		padding: 16,
		gap: 8,
	},
	summaryCard: {
		flex: 1,
		padding: 12,
		borderRadius: 12,
		alignItems: "center",
	},
	summaryLabel: {
		color: "#F8FAFC",
		fontSize: 14,
		marginBottom: 4,
	},
	summaryAmount: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
	chartContainer: {
		padding: 16,
	},
	chartTitle: {
		color: "#F8FAFC",
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 16,
	},
	chart: {
		marginVertical: 8,
		borderRadius: 16,
	},
	categoryContainer: {
		padding: 16,
	},
	categoryList: {
		marginTop: 16,
	},
	categoryItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	categoryHeader: {
		flexDirection: "row",
		alignItems: "center",
	},
	categoryDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 8,
	},
	categoryName: {
		color: "#F8FAFC",
		fontSize: 14,
	},
	categoryAmount: {
		color: "#94A3B8",
		fontSize: 14,
	},
	noDataText: {
		color: "#94A3B8",
		fontSize: 14,
		textAlign: "center",
		marginTop: 16,
	},
	transactionList: {
		padding: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 16,
	},
});