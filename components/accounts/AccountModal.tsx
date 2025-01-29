import type { Account, FormData } from "@/app";
import React from "react";
import {
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

type AccountModalProps = {
	visible: boolean;
	editingAccount: Account | null;
	formData: FormData;
	onClose: () => void;
	onSave: () => void;
	onUpdateForm: (updates: Partial<FormData>) => void;
};

export const AccountModal = ({
	visible,
	editingAccount,
	formData,
	onClose,
	onSave,
	onUpdateForm,
}: AccountModalProps) => {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>
						{editingAccount ? "Edit Account" : "Add Account"}
					</Text>

					<TextInput
						style={styles.input}
						placeholder="Account Name"
						value={formData.name}
						onChangeText={(text) => onUpdateForm({ name: text })}
						placeholderTextColor="#666"
					/>

					<TextInput
						style={styles.input}
						placeholder="Account Type (e.g., debit, credit)"
						value={formData.type}
						onChangeText={(text) => onUpdateForm({ type: text })}
						placeholderTextColor="#666"
					/>

					<TextInput
						style={styles.input}
						placeholder="Balance"
						value={formData.balance}
						onChangeText={(text) => onUpdateForm({ balance: text })}
						keyboardType="decimal-pad"
						placeholderTextColor="#666"
					/>

					<TextInput
						style={styles.input}
						placeholder="Account Number (optional)"
						value={formData.accountNumber}
						onChangeText={(text) => onUpdateForm({ accountNumber: text })}
						placeholderTextColor="#666"
					/>

					<View style={styles.modalButtons}>
						<TouchableOpacity
							style={[styles.modalButton, styles.cancelButton]}
							onPress={onClose}
						>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.modalButton, styles.saveButton]}
							onPress={onSave}
						>
							<Text style={styles.buttonText}>
								{editingAccount ? "Update" : "Add"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		flex: 1,
		justifyContent: "flex-end",
	},
	modalContent: {
		backgroundColor: "#1E293B",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
	},
	modalTitle: {
		color: "#F8FAFC",
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		backgroundColor: "#0F172A",
		borderRadius: 8,
		color: "#F8FAFC",
		fontSize: 16,
		marginBottom: 12,
		padding: 12,
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
	modalButton: {
		alignItems: "center",
		borderRadius: 8,
		flex: 1,
		marginHorizontal: 8,
		padding: 12,
	},
	cancelButton: {
		backgroundColor: "#475569",
	},
	saveButton: {
		backgroundColor: "#6366F1",
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
});
