import type { Account } from "@/app.d.ts";
import { CreditCard } from "@/components/CreditCard";
import React from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, {
	FadeIn,
	Layout,
	SlideInRight,
} from "react-native-reanimated";

type AccountCardProps = {
	account: Account;
	index: number;
	onPress: () => void;
	onDelete: () => void;
};

export const AccountCard = ({
	account,
	index,
	onPress,
	onDelete,
}: AccountCardProps) => {
	const renderRightActions = () => (
		<Animated.View entering={SlideInRight} style={styles.rightActions}>
			<TouchableOpacity
				style={[styles.actionButton, styles.deleteButton]}
				onPress={onDelete}
			>
				<Text style={styles.actionButtonText}>Delete</Text>
			</TouchableOpacity>
		</Animated.View>
	);

	return (
		<Animated.View
			entering={FadeIn.delay(300 + index * 100).duration(500)}
			layout={Layout.springify()}
		>
			<Swipeable renderRightActions={renderRightActions}>
				<TouchableOpacity onPress={onPress} activeOpacity={0.9}>
					<CreditCard
						accountName={account.name}
						accountNumber={account.id}
						balance={account.balance}
						type={account.type}
					/>
				</TouchableOpacity>
			</Swipeable>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	rightActions: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 8,
	},
	actionButton: {
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		width: 100,
		borderRadius: 12,
	},
	deleteButton: {
		backgroundColor: "#EF4444",
	},
	actionButtonText: {
		color: "white",
		fontWeight: "600",
	},
});
