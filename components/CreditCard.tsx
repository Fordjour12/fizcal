import { LinearGradient } from "expo-linear-gradient";
import type React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

interface CreditCardProps {
	accountName: string;
	accountNumber: string;
	balance: number;
	type?: string;
	currency?: string;
}

export const CreditCard: React.FC<CreditCardProps> = ({
	accountName,
	accountNumber,
	balance,
	type = "debit",
	currency = "USD",
}) => {
	// Mask account number to show only last 4 digits
	const maskedNumber = `•••• •••• •••• ${accountNumber.slice(-4)}`;

	return (
		<View style={styles.container}>
			<LinearGradient
				colors={["#4F46E5", "#7C3AED"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.cardGradient}
			>
				<View style={styles.cardContent}>
					<View style={styles.topRow}>
						<Text style={styles.balance}>
							{currency === "USD" ? "$" : currency} {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
						</Text>
						<Text style={styles.type}>{type.toUpperCase()}</Text>
					</View>

					<View style={styles.bottomSection}>
						<Text style={styles.accountNumber}>{maskedNumber}</Text>
						<Text style={styles.accountName}>{accountName}</Text>
					</View>
				</View>
			</LinearGradient>
		</View>
	);
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
	container: {
		width: width - 40,
		aspectRatio: 1.586, // Standard credit card ratio
		borderRadius: 16,
		marginVertical: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
	},
	cardGradient: {
		flex: 1,
		borderRadius: 16,
		padding: 20,
	},
	cardContent: {
		flex: 1,
		justifyContent: "space-between",
	},
	topRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	balance: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	type: {
		fontSize: 14,
		color: "#FFFFFF",
		opacity: 0.8,
	},
	bottomSection: {
		gap: 8,
	},
	accountNumber: {
		fontSize: 18,
		letterSpacing: 2,
		color: "#FFFFFF",
	},
	accountName: {
		fontSize: 16,
		color: "#FFFFFF",
		textTransform: "uppercase",
	},
});
