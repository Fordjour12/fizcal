import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function SetupAccountScreen() {
    const [accountType, setAccountType] = useState<string>("Bank");
    const [accountName, setAccountName] = useState<string>("");
    const [initialBalance, setInitialBalance] = useState<string>("");
    const router = useRouter();

    const handleNext = () => {
        // Save the account data (e.g., call to local DB or state management)
        const accountData = {
            id: Date.now().toString(),
            type: accountType,
            name: accountName,
            balance: parseFloat(initialBalance),
            createdAt: new Date().toISOString()
        };
        
        // Here you would typically save to your storage solution
        console.log('Saving account:', accountData);
        
        // Navigate to dashboard with initial state
        router.replace("/(tabs)");
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Let's Get Started!</Text>
                <Text style={styles.subtitle}>
                    Tell us about your first account. This will help you track your finances effortlessly.
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., My Savings Account, Mobile Wallet"
                    placeholderTextColor="#94A3B8"
                    value={accountName}
                    onChangeText={setAccountName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Bank, Mobile Money, or Other"
                    placeholderTextColor="#94A3B8"
                    value={accountType}
                    onChangeText={setAccountType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="e.g., 500.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={initialBalance}
                    onChangeText={setInitialBalance}
                />
                <Text style={styles.helperText}>
                    Don't worry; you can always add more accounts later.
                </Text>
                <Pressable
                    onPress={handleNext}
                    disabled={!accountName || !initialBalance}
                    style={({ pressed }) => [{
                        opacity: (!accountName || !initialBalance) ? 0.5 : pressed ? 0.8 : 1
                    }]}
                >
                    <LinearGradient
                        colors={['#8B5CF6', '#6366F1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Start Tracking</Text>
                    </LinearGradient>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: "center"
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: "#94A3B8",
        marginBottom: 32,
        lineHeight: 24,
    },
    input: {
        backgroundColor: "rgba(148, 163, 184, 0.1)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        color: "#FFFFFF",
        fontSize: 16,
    },
    helperText: {
        color: "#64748B",
        fontSize: 14,
        textAlign: "center",
        marginTop: 8,
        marginBottom: 24,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        elevation: 2,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
});
