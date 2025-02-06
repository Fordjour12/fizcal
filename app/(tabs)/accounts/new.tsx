import type { FormData } from "@/app";
import { KeyboardAwareView } from "@/components/KeyboardAwareView";
import { useAuth } from "@/contexts/auth";
import * as schema from "@/services/db/schemas";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { randomUUID } from "expo-crypto";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CURRENCIES = ["USD", "GHS", "EUR", "GBP", "NGN"] as const;
type Currency = (typeof CURRENCIES)[number];

export default function NewAccountScreen() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "",
    balance: "",
    accountNumber: "",
    currency: "USD", // Add default currency
  });

  const { user } = useAuth();

  const sqlite = useSQLiteContext();
  const db = drizzle(sqlite, { schema });

  const handleAddAccount = async () => {
    if (!user?.id) return;

    try {
      const newAccount = {
        id: randomUUID(),
        userId: user.id,
        name: formData.name,
        type: formData.type,
        balance: Number.parseFloat(formData.balance),
        accountNumber: formData.accountNumber,
        currency: formData.currency, // Add currency to the new account
      };

      await db.insert(schema.accounts).values(newAccount);
      router.back();
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };

  return (
    <KeyboardAwareView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add New Account</Text>
          <Text style={styles.subtitle}>
            Track your finances by adding a new account to your portfolio.
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
              Specify the type of account (e.g., checking, savings, credit card,
              mobile money)
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Currency</Text>
            <Text style={styles.description}>
              Select the currency for this account
            </Text>
            <View style={styles.currencyContainer}>
              {CURRENCIES.map((curr) => (
                <TouchableOpacity
                  key={curr}
                  onPress={() => setFormData({ ...formData, currency: curr })}
                  style={[
                    styles.currencyButton,
                    formData.currency === curr && styles.selectedCurrency,
                  ]}
                >
                  <Text
                    style={[
                      styles.currencyText,
                      formData.currency === curr && styles.selectedCurrencyText,
                    ]}
                  >
                    {curr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleAddAccount}>
            <LinearGradient
              colors={["#8B5CF6", "#6366F1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButton}
            >
              <Text style={styles.buttonText}>Add Account</Text>
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
  currencyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
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
});
