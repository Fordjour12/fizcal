import { useAuth } from "@/contexts/auth";
import * as schema from "@/services/db/schemas";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as Crypto from "expo-crypto";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const CURRENCIES = ["USD", "GHS", "EUR", "GBP", "NGN"] as const;
type Currency = (typeof CURRENCIES)[number];

export default function UserSetupScreen() {
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [currency, setCurrency] = useState<Currency>("USD");
	const [loading, setLoading] = useState<boolean>(false);

	const db = useSQLiteContext();
	const drizzleDB = drizzle(db, { schema });
	useDrizzleStudio(db);
	const router = useRouter();
	const { signIn } = useAuth();

	const handleNext = async () => {
		const UUID = Crypto.randomUUID();
		try {
			setLoading(true);
			const userData = {
				id: UUID,
				name,
				email,
				currency,
			};

			await drizzleDB.insert(schema.users).values(userData);
			await signIn(userData);
			router.push("/boarding/accountSetup");
		} catch (error) {
			console.error("Error creating user:", error);
			// Here you might want to show an error message to the user
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>Welcome to Fizcal!</Text>
				<Text style={styles.subtitle}>
					Let's get to know you better. This will help personalize your
					experience.
				</Text>
				<TextInput
					style={styles.input}
					placeholder="Your Name"
					placeholderTextColor="#94A3B8"
					value={name}
					onChangeText={setName}
				/>
				<TextInput
					style={styles.input}
					placeholder="Email Address"
					placeholderTextColor="#94A3B8"
					keyboardType="email-address"
					autoCapitalize="none"
					value={email}
					onChangeText={setEmail}
				/>
				<View style={styles.currencyContainer}>
					{CURRENCIES.map((curr) => (
						<Pressable
							key={curr}
							onPress={() => setCurrency(curr)}
							style={[
								styles.currencyButton,
								currency === curr && styles.selectedCurrency,
							]}
						>
							<Text
								style={[
									styles.currencyText,
									currency === curr && styles.selectedCurrencyText,
								]}
							>
								{curr}
							</Text>
						</Pressable>
					))}
				</View>
				<Pressable
					onPress={handleNext}
					disabled={!name || !email || loading}
					style={({ pressed }) => [
						{
							opacity: !name || !email || loading ? 0.5 : pressed ? 0.8 : 1,
						},
					]}
				>
					<LinearGradient
						colors={["#8B5CF6", "#6366F1"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.button}
					>
						<Text style={styles.buttonText}>
							{loading ? "Loading..." : "Continue"}
						</Text>
					</LinearGradient>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F172A",
	},
	content: {
		flex: 1,
		padding: 24,
		justifyContent: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#F8FAFC",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#94A3B8",
		marginBottom: 32,
	},
	input: {
		backgroundColor: "#1E293B",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		fontSize: 16,
		color: "#F8FAFC",
	},
	currencyContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginBottom: 32,
	},
	currencyButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		backgroundColor: "#1E293B",
	},
	selectedCurrency: {
		backgroundColor: "#8B5CF6",
	},
	currencyText: {
		color: "#94A3B8",
		fontSize: 16,
	},
	selectedCurrencyText: {
		color: "#F8FAFC",
	},
	button: {
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
	},
	buttonText: {
		color: "#F8FAFC",
		fontSize: 16,
		fontWeight: "600",
	},
	helperText: {
		color: "#94A3B8",
		fontSize: 14,
		textAlign: "center",
		marginTop: 16,
	},
});
