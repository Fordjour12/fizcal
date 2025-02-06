import type { Account } from "@/app.d.ts";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AccountCard } from "./AccountCard";

type AccountListProps = {
	accounts: Account[];
	onEditAccount: (account: Account) => void;
	onDeleteAccount: (accountId: string) => void;
};

export const AccountList = ({
	accounts,
	onEditAccount,
	onDeleteAccount,
}: AccountListProps) => {
	return (
		<View style={styles.accountsList}>
			{accounts.map((account, index) => (
				<AccountCard
					key={account.id}
					account={account}
					index={index}
					onPress={() => onEditAccount(account)}
					onDelete={() => onDeleteAccount(account.id)}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	accountsList: {
		paddingHorizontal: 16,
	},
});
