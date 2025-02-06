import { formatCurrency } from "@/services/formatters";
import React from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

type TotalBalanceCardProps = {
	totalBalance: number;
};

export const TotalBalanceCard = ({ totalBalance }: TotalBalanceCardProps) => {
	return (
		<Animated.View
			entering={FadeIn.delay(200).duration(500)}
			style={styles.totalBalanceCard}
		>
			<Text style={styles.totalBalanceLabel}>Total Balance</Text>
			<Text style={styles.totalBalanceAmount}>
				{formatCurrency(totalBalance)}
			</Text>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	totalBalanceCard: {
		backgroundColor: "#1E293B",
		borderRadius: 12,
		marginBottom: 24,
		marginHorizontal: 16,
		padding: 16,
	},
	totalBalanceLabel: {
		color: "#94A3B8",
		fontSize: 16,
		marginBottom: 8,
	},
	totalBalanceAmount: {
		color: "#F8FAFC",
		fontSize: 32,
		fontWeight: "bold",
	},
});
