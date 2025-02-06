import type { FormData } from "@/app.d.ts";
import { KeyboardAwareView } from "@/components/KeyboardAwareView";
import { useAuth } from "@/contexts/auth";
import * as schema from "@/services/db/schemas";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function UpdateAccountScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [formData, setFormData] = useState<FormData>({
		name: "",
		type: "",
		balance: "",
		accountNumber: "",
	});

	const { user } = useAuth();

	const sqlite = useSQLiteContext();
	const db = drizzle(sqlite, { schema });

	useEffect(() => {
		const loadAccount = async () => {
			if (!id) return;

			try {
				const account = await db.query.accounts.findFirst({
					where: (accounts, { eq, and }) =>
						and(eq(accounts.id, id), eq(accounts.userId, user?.id || "")),
				});

				if (account) {
					setFormData({
						name: account.name,
						type: account.type,
						balance: account.balance.toString(),
						accountNumber: account.accountNumber || "",
					});
				}
			} catch (error) {
				console.error("Error loading account:", error);
			}
		};

		loadAccount();
	}, [id, user?.id, db]);

	const handleUpdateAccount = async () => {
		if (!user?.id || !id) return;

		try {
			await db
				.update(schema.accounts)
				.set({
					name: formData.name,
					type: formData.type,
					balance: Number.parseFloat(formData.balance),
					accountNumber: formData.accountNumber,
				})
				.where(eq(schema.accounts.id, id));
			router.back();
		} catch (error) {
			console.error("Error updating account:", error);
		}
	};

	return (
		<KeyboardAwareView style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
			>
				<View style={styles.header}>
					<Text style={styles.title}>Update Account</Text>
					<Text style={styles.subtitle}>
						Update your account information to keep your records accurate.
					</Text>
				</View>

				<View style={styles.formContainer}>
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Account Name</Text>
						<Text style={styles.description}>
							Give your account a memorable name (e.g., "Main Checking",
							"Savings")
						</Text>
						<TextInput
							style={styles.input}
							placeholder="Account Name"
							value={formData.name}
							onChangeText={(text) => setFormData({ ...formData, name: text })}
							placeholderTextColor="#94A3B8"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Account Type</Text>
						<Text style={styles.description}>
							Specify the type of account (e.g., checking, savings, credit card)
						</Text>
						<TextInput
							style={styles.input}
							placeholder="Account Type"
							value={formData.type}
							onChangeText={(text) => setFormData({ ...formData, type: text })}
							placeholderTextColor="#94A3B8"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Current Balance</Text>
						<Text style={styles.description}>
							Enter the current balance in your account
						</Text>
						<TextInput
							style={styles.input}
							placeholder="Balance"
							value={formData.balance}
							onChangeText={(text) =>
								setFormData({ ...formData, balance: text })
							}
							keyboardType="decimal-pad"
							placeholderTextColor="#94A3B8"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Account Number (Optional)</Text>
						<Text style={styles.description}>
							Add your account number for reference
						</Text>
						<TextInput
							style={styles.input}
							placeholder="Account Number"
							value={formData.accountNumber}
							onChangeText={(text) =>
								setFormData({ ...formData, accountNumber: text })
							}
							placeholderTextColor="#94A3B8"
						/>
					</View>
				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.cancelButton}
						onPress={() => router.back()}
					>
						<Text style={styles.buttonText}>Cancel</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={handleUpdateAccount}>
						<LinearGradient
							colors={["#8B5CF6", "#6366F1"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={styles.updateButton}
						>
							<Text style={styles.buttonText}>Update Account</Text>
						</LinearGradient>
					</TouchableOpacity>
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
	scrollContent: {
		paddingBottom: 40,
	},
	header: {
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 16,
	},
	title: {
		color: "#F8FAFC",
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 8,
		textAlign: "center",
	},
	subtitle: {
		color: "#94A3B8",
		fontSize: 16,
		textAlign: "center",
		marginBottom: 24,
	},
	formContainer: {
		paddingHorizontal: 20,
	},
	inputGroup: {
		marginBottom: 24,
	},
	label: {
		color: "#F8FAFC",
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 4,
	},
	description: {
		color: "#94A3B8",
		fontSize: 14,
		marginBottom: 8,
	},
	input: {
		backgroundColor: "#1E293B",
		borderRadius: 8,
		color: "#F8FAFC",
		fontSize: 16,
		padding: 16,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		marginTop: 16,
	},
	cancelButton: {
		backgroundColor: "#475569",
		borderRadius: 8,
		padding: 16,
		flex: 1,
		marginRight: 8,
		alignItems: "center",
	},
	updateButton: {
		borderRadius: 8,
		padding: 16,
		flex: 1,
		marginLeft: 8,
		alignItems: "center",
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
});
