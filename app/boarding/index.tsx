import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function BoardingScreen() {
	return (
		<View style={styles.container}>
			<View style={styles.cardsContainer}>
				<LinearGradient
					colors={["#8B5CF6", "#6366F1"]}
					style={[styles.card, styles.cardTop]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
				>
					<Text style={styles.cardLogo}>VISA</Text>
					<Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
					<Text style={styles.cardHolder}>John Austin</Text>
					<Text style={styles.cardExpiry}>02/28</Text>
				</LinearGradient>

				<LinearGradient
					colors={["#4F46E5", "#3730A3"]}
					style={[styles.card, styles.cardBottom]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
				/>
			</View>

			<View style={styles.contentContainer}>
				<Text style={styles.title}>Smart Banking For Your Transactions</Text>

				<Link href="/boarding/accountSetup" asChild>
					<Pressable style={styles.signInButton}>
						<Text style={styles.signInText}>Let&apos;s go</Text>
					</Pressable>
				</Link>

				<View style={styles.signupContainer}>
					<Text style={styles.signupText}>Don't have an account? </Text>
					<Link href="/" asChild>
						<Pressable>
							<Text style={styles.signupLink}>Sign up</Text>
						</Pressable>
					</Link>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0F172A",
		padding: 20,
	},
	cardsContainer: {
		height: "45%",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	card: {
		width: "90%",
		height: 200,
		borderRadius: 20,
		padding: 20,
		position: "absolute",
	},
	cardTop: {
		zIndex: 2,
		transform: [{ rotate: "-5deg" }],
	},
	cardBottom: {
		transform: [{ rotate: "5deg" }],
	},
	cardLogo: {
		color: "#FFFFFF",
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 40,
	},
	cardNumber: {
		color: "#FFFFFF",
		fontSize: 18,
		letterSpacing: 2,
		marginBottom: 20,
	},
	cardHolder: {
		color: "#FFFFFF",
		fontSize: 16,
	},
	cardExpiry: {
		color: "#FFFFFF",
		fontSize: 16,
		position: "absolute",
		right: 20,
		bottom: 20,
	},
	contentContainer: {
		flex: 1,
		justifyContent: "flex-end",
		paddingBottom: 40,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#FFFFFF",
		textAlign: "center",
		marginBottom: 30,
	},
	signInButton: {
		backgroundColor: "#6366F1",
		paddingVertical: 16,
		borderRadius: 12,
		marginBottom: 20,
	},
	signInText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "600",
		textAlign: "center",
	},
	socialButtonsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 20,
		marginBottom: 20,
	},
	socialButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
	},
	appleBg: {
		backgroundColor: "#000000",
	},
	googleBg: {
		backgroundColor: "#FFFFFF",
	},
	socialIcon: {
		width: 24,
		height: 24,
	},
	signupContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	signupText: {
		color: "#94A3B8",
		fontSize: 16,
	},
	signupLink: {
		color: "#6366F1",
		fontSize: 16,
		fontWeight: "600",
	},
});
