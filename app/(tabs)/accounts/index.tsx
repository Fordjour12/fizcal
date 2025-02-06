import { KeyboardAwareView } from "@/components/KeyboardAwareView";
import { SearchBar } from "@/components/SearchBar";
import { AccountList } from "@/components/accounts/AccountList";
import { TotalBalanceCard } from "@/components/accounts/TotalBalanceCard";
import { useAccounts } from "@/hooks/useAccounts";
import { calculateTotalBalance } from "@/services/formatters";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function AccountsScreen() {
	const {
		accounts,
		refreshing,
		handleDeleteAccount,
		openEditModal,
		onRefresh,
		loadAccounts,
	} = useAccounts();

	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		loadAccounts();
	}, [loadAccounts]);

	// Filter accounts based on search query
	const filteredAccounts = accounts.filter(
		(account) =>
			account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			account.type.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const totalBalance = calculateTotalBalance(filteredAccounts);

	return (
		<KeyboardAwareView style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View style={styles.content}>
					<SearchBar value={searchQuery} onChangeText={setSearchQuery} />
					<TotalBalanceCard totalBalance={totalBalance} />

					<Text style={styles.accountsLabel}>
						{filteredAccounts.length} Accounts
					</Text>

					<AccountList
						accounts={filteredAccounts}
						onEditAccount={openEditModal}
						onDeleteAccount={handleDeleteAccount}
					/>

					{/* Add Account Button */}
					<Animated.View entering={FadeIn.delay(500).duration(500)}>
						<Link href="/accounts/new" asChild>
							<TouchableOpacity>
								<LinearGradient
									colors={["#8B5CF6", "#6366F1"]}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									style={styles.addButtonGradient}
								>
									<Text style={styles.addButtonText}>Add New Account</Text>
								</LinearGradient>
							</TouchableOpacity>
						</Link>
					</Animated.View>
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
		flex: 1,
		paddingVertical: 24,
	},
	addButtonGradient: {
		alignItems: "center",
		borderRadius: 12,
		marginHorizontal: 16,
		marginTop: 24,
		padding: 16,
	},
	addButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
	accountsLabel: {
		color: "#94A3B8",
		fontSize: 18,
		fontWeight: "500",
		marginHorizontal: 16,
		marginTop: 24,
		marginBottom: 8,
	},
});
