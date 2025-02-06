import type { Account } from '@/app.d.ts';
import { KeyboardAwareView } from '@/components/KeyboardAwareView';
import { useAuth } from '@/contexts/auth';
import * as schema from '@/services/db/schemas';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface TransactionFormData {
  accountId: string;
  type: 'expense' | 'income' | 'savings';
  amount: string;
  category: string;
  description: string;
}

const NewTransactionForm = () => {
  const { user } = useAuth();
  const sqlite = useSQLiteContext();
  const db = drizzle(sqlite, { schema });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState<TransactionFormData>({
    accountId: '',
    type: 'expense',
    amount: '',
    category: '',
    description: ''
  });

  const loadAccounts = useCallback(async () => {
    if (!user?.id) return;
    const results = await db.query.accounts.findMany({
      where: (accounts, { eq }) => eq(accounts.userId, user.id),
    });
    setAccounts(results as Account[]);
  }, [user?.id, db]);

  const resetForm = () => {
    setFormData({
      accountId: '',
      type: 'expense',
      amount: '',
      category: '',
      description: ''
    });
  };

  const handleAddTransaction = () => {
    // TODO: Implement transaction handling logic
    resetForm();
  };

  return (
    <KeyboardAwareView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add Transaction</Text>
          <Text style={styles.subtitle}>
            Record your income, expenses, and track your financial flow.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account</Text>
            <Text style={styles.description}>Select the account for this transaction</Text>

          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Transaction Type</Text>
            <Text style={styles.description}>Select the type of transaction</Text>
            <View style={styles.typeButtons}>
              {['expense', 'income', 'savings'].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFormData({ ...formData, type: type as 'expense' | 'income' })}
                  style={[
                    styles.typeButton,
                    formData.type === type && styles.selectedType,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      formData.type === type && styles.selectedTypeText,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.description}>Enter the transaction amount</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
              keyboardType="decimal-pad"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.description}>What is this transaction for?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Food, Transport, Salary"
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <Text style={styles.description}>Add more details about this transaction</Text>
            <TextInput
              style={styles.input}
              placeholder="Add notes about this transaction"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
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

          <TouchableOpacity onPress={handleAddTransaction}>
            <LinearGradient
              colors={["#8B5CF6", "#6366F1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButton}
            >
              <Text style={styles.buttonText}>Add Transaction</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAwareView>
  );
};

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
  typeButtons: {
    flexDirection: "row",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  selectedType: {
    backgroundColor: "#8B5CF6",
  },
  typeText: {
    color: "#94A3B8",
    fontSize: 16,
  },
  selectedTypeText: {
    color: "#F8FAFC",
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
  addButton: {
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

export default NewTransactionForm;
