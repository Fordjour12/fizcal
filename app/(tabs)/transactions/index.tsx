import { KeyboardAwareView } from "@/components/KeyboardAwareView";
import { useAuth } from "@/contexts/auth";
import * as schema from "@/services/db/schemas";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
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
	View
} from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

type Transaction = {
	id: string;
	accountId: string;
	type: "income" | "expense";
	amount: number;
	category: string;
	description: string;
	date: Date;
};

type Account = {
	id: string;
	name: string;
};

export default function TransactionsScreen() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [formData, setFormData] = useState({
		accountId: "",
		type: "expense" as "income" | "expense",
		amount: "",
		category: "",
		description: "",
	});

	const { user } = useAuth();
	const sqlite = useSQLiteContext();
	const db = drizzle(sqlite, { schema });

	const loadData = useCallback(async () => {
		if (!user?.id) return;

		// Load accounts
		const accountResults = await db.query.accounts.findMany({
			where: (accounts, { eq }) => eq(accounts.userId, user.id),
			columns: {
				id: true,
				name: true,
			},
		});
		setAccounts(accountResults);

		// Load transactions
		const transactionResults = await db.query.transactions.findMany({
			where: (transactions, { eq, and, inArray }) =>
				and(
					inArray(
						transactions.accountId,
						accountResults.map((a) => a.id),
					),
				),
		});
		setTransactions(transactionResults as Transaction[]);
	}, [user?.id, db]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await loadData();
		setRefreshing(false);
	}, [loadData]);

	const handleAddTransaction = async () => {
		if (!user?.id || !formData.accountId) return;

		try {
			const newTransaction = {
				accountId: formData.accountId,
				type: formData.type,
				amount: Number.parseFloat(formData.amount),
				category: formData.category,
				description: formData.description,
				date: new Date(),
			};

			// Update account balance
			const account = await db.query.accounts.findFirst({
				where: (accounts, { eq }) => eq(accounts.id, formData.accountId),
			});

			if (account) {
				const balanceChange =
					formData.type === "income"
						? Number.parseFloat(formData.amount)
						: -Number.parseFloat(formData.amount);

				await db
					.update(schema.accounts)
					.set({
						balance: account.balance + balanceChange,
					})
					.where((accounts: { id: { equals: (arg0: string) => any; }; }) => accounts.id.equals(formData.accountId));
			}

			await db.insert(schema.transactions).values(newTransaction);
			await loadData();
			setModalVisible(false);
			resetForm();
		} catch (error) {
			console.error("Error adding transaction:", error);
		}
	};

	const resetForm = () => {
		setFormData({
			accountId: "",
			type: "expense",
			amount: "",
			category: "",
			description: "",
		});
	};

	const formatCurrency = (amount: number, accountId: string) => {
		const account = accounts.find((a) => a.id === accountId);
		return amount.toLocaleString("en-US", {
			style: "currency",
			currency: account?.currency || "USD",
		});
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Filter transactions based on search query
	const filteredTransactions = transactions.filter(
		(transaction) =>
			transaction.description
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			transaction.category.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<KeyboardAwareView style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View style={styles.content}>
					{/* Search Bar */}
					<View style={styles.searchContainer}>
						<TextInput
							style={styles.searchInput}
							placeholder="Search transactions..."
							placeholderTextColor="#94A3B8"
							value={searchQuery}
							onChangeText={setSearchQuery}
						/>
					</View>

					{/* Transactions List */}
					<View style={styles.transactionsList}>
						{filteredTransactions.map((transaction, index) => (
							<Animated.View
								key={transaction.id}
								entering={FadeIn.delay(index * 100).duration(500)}
								exiting={FadeOut.duration(300)}
								layout={Layout.springify()}
							>
								<LinearGradient
									colors={
										transaction.type === "income"
											? ["#059669", "#047857"]
											: ["#DC2626", "#B91C1C"]
									}
									style={styles.transactionCard}
								>
									<View style={styles.transactionInfo}>
										<Text style={styles.transactionDescription}>
											{transaction.description}
										</Text>
										<Text style={styles.transactionCategory}>
											{transaction.category}
										</Text>
										<Text style={styles.transactionDate}>
											{formatDate(transaction.date)}
										</Text>
									</View>
									<Text
										style={[
											styles.transactionAmount,
											transaction.type === "income"
												? styles.incomeText
												: styles.expenseText,
										]}
									>
										{transaction.type === "income" ? "+" : "-"}
										{formatCurrency(Math.abs(transaction.amount), transaction.accountId)}
									</Text>
								</LinearGradient>
							</Animated.View>
						))}
					</View>

					{/* Add Transaction Button */}
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
							<Text style={styles.addButtonText}>Add Transaction</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</ScrollView>

			{/* Add Transaction Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Add Transaction</Text>

						<View style={styles.formGroup}>
							<Text style={styles.label}>Account</Text>
							<View style={styles.accountButtons}>
								{accounts.map((account) => (
									<TouchableOpacity
										key={account.id}
										style={[
											styles.accountButton,
											formData.accountId === account.id &&
											styles.accountButtonActive,
										]}
										onPress={() =>
											setFormData({
												...formData,
												accountId: account.id,
											})
										}
									>
										<Text
											style={[
												styles.accountButtonText,
												formData.accountId === account.id &&
												styles.accountButtonTextActive,
											]}
										>
											{account.name}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						<View style={styles.formGroup}>
							<Text style={styles.label}>Type</Text>
							<View style={styles.typeButtons}>
								<TouchableOpacity
									style={[
										styles.typeButton,
										formData.type === "expense" &&
										styles.typeButtonActive,
									]}
									onPress={() =>
										setFormData({ ...formData, type: "expense" })
									}
								>
									<Text
										style={[
											styles.typeButtonText,
											formData.type === "expense" &&
											styles.typeButtonTextActive,
										]}
									>
										Expense
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										styles.typeButton,
										formData.type === "income" &&
										styles.typeButtonActive,
									]}
									onPress={() =>
										setFormData({ ...formData, type: "income" })
									}
								>
									<Text
										style={[
											styles.typeButtonText,
											formData.type === "income" &&
											styles.typeButtonTextActive,
										]}
									>
										Income
									</Text>
								</TouchableOpacity>
							</View>
						</View>

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
							placeholder="Description"
							value={formData.description}
							onChangeText={(text) =>
								setFormData({ ...formData, description: text })
							}
							placeholderTextColor="#666"
						/>

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
								onPress={handleAddTransaction}
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
	searchContainer: {
		marginBottom: 16,
	},
	searchInput: {
		backgroundColor: "#1E293B",
		borderRadius: 12,
		padding: 16,
		color: "#F8FAFC",
		fontSize: 16,
	},
	transactionsList: {
		gap: 12,
		marginBottom: 24,
	},
	transactionCard: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		borderRadius: 12,
	},
	transactionInfo: {
		flex: 1,
	},
	transactionDescription: {
		color: "#F8FAFC",
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 4,
	},
	transactionCategory: {
		color: "#94A3B8",
		fontSize: 14,
		marginBottom: 2,
	},
	transactionDate: {
		color: "#94A3B8",
		fontSize: 12,
	},
	transactionAmount: {
		fontSize: 18,
		fontWeight: "600",
	},
	incomeText: {
		color: "#ECFDF5",
	},
	expenseText: {
		color: "#FEE2E2",
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
	formGroup: {
		marginBottom: 16,
	},
	label: {
		color: "#94A3B8",
		fontSize: 14,
		marginBottom: 8,
	},
	accountButtons: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	accountButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
		backgroundColor: "#334155",
	},
	accountButtonActive: {
		backgroundColor: "#4F46E5",
	},
	accountButtonText: {
		color: "#94A3B8",
		fontSize: 14,
	},
	accountButtonTextActive: {
		color: "#FFFFFF",
	},
	typeButtons: {
		flexDirection: "row",
		gap: 8,
	},
	typeButton: {
		flex: 1,
		paddingVertical: 8,
		borderRadius: 8,
		backgroundColor: "#334155",
		alignItems: "center",
	},
	typeButtonActive: {
		backgroundColor: "#4F46E5",
	},
	typeButtonText: {
		color: "#94A3B8",
		fontSize: 14,
	},
	typeButtonTextActive: {
		color: "#FFFFFF",
	},
	input: {
		backgroundColor: "#334155",
		padding: 12,
		borderRadius: 8,
		color: "#FFFFFF",
		marginBottom: 12,
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
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