import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function New() {
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [period, setPeriod] = useState("monthly");
    const [errors, setErrors] = useState({ category: "", amount: "" });
    const [selectedCategoryItem, setSelectedCategoryItem] = useState("");

    const periods = ["weekly", "monthly", "yearly"];
    const categories = [
        { id: "food", name: "Food & Dining", icon: "restaurant" },
        { id: "transport", name: "Transportation", icon: "car" },
        { id: "entertainment", name: "Entertainment", icon: "game-controller" },
        { id: "shopping", name: "Shopping", icon: "cart" },
        { id: "utilities", name: "Utilities", icon: "flash" },
        { id: "health", name: "Healthcare", icon: "medical" },
    ];

    const calculateDailyAmount = useMemo(() => {
        if (!amount) return 0;
        const numAmount = Number.parseFloat(amount);
        if (isNaN(numAmount)) return 0;

        switch (period) {
            case "weekly":
                return numAmount / 7;
            case "monthly":
                return numAmount / 30;
            case "yearly":
                return numAmount / 365;
            default:
                return 0;
        }
    }, [amount, period]);

    const [isRecurring, setIsRecurring] = useState(false);
    const [endDate, setEndDate] = useState("");

    const handleCreateBudget = () => {
        const newErrors = {
            category: !selectedCategoryItem ? "Please select a category" : "",
            amount:
                !amount || isNaN(Number.parseFloat(amount))
                    ? "Please enter a valid amount"
                    : "",
        };
        setErrors(newErrors);

        if (!newErrors.category && !newErrors.amount) {
            // TODO: Implement budget creation logic
            console.log("Creating budget:", {
                category: selectedCategoryItem,
                amount: Number.parseFloat(amount),
                period,
                isRecurring,
                endDate: endDate || null,
            });
        }
    };
    const router = useRouter()

    return (
        <ScrollView style={styles.container}>
            <LinearGradient colors={["#1E1E1E", "#2C2C2C"]} style={styles.card}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Create New Budget</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.categoriesGrid}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryItem,
                                    cat.id === selectedCategoryItem && styles.selectedCategory,
                                ]}
                                onPress={() => setSelectedCategoryItem(cat.id)}
                            >
                                <Ionicons
                                    name={cat.icon}
                                    size={24}
                                    color={cat.id === selectedCategoryItem ? "#FFF" : "#CCC"}
                                />
                                <Text
                                    style={[
                                        styles.categoryItemText,
                                        cat.id === selectedCategoryItem &&
                                        styles.selectedCategoryText,
                                    ]}
                                >
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.category ? (
                        <Text style={styles.errorText}>{errors.category}</Text>
                    ) : null}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={[styles.input, errors.amount && styles.inputError]}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter budget amount"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                    />
                    {errors.amount ? (
                        <Text style={styles.errorText}>{errors.amount}</Text>
                    ) : null}
                    {amount && !errors.amount && (
                        <Text style={styles.previewText}>
                            ≈ ${calculateDailyAmount.toFixed(2)} per day
                        </Text>
                    )}
                </View>

                <View style={styles.periodContainer}>
                    <Text style={styles.label}>Period</Text>
                    <View style={styles.periodButtons}>
                        {periods.map((p) => (
                            <TouchableOpacity
                                key={p}
                                style={[
                                    styles.periodButton,
                                    p === period && styles.activePeriod,
                                ]}
                                onPress={() => setPeriod(p)}
                            >
                                <Text
                                    style={[
                                        styles.periodButtonText,
                                        p === period && styles.activePeriodText,
                                    ]}
                                >
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.recurringContainer}>
                        <TouchableOpacity
                            style={[styles.recurringButton, isRecurring && styles.activeRecurring]}
                            onPress={() => setIsRecurring(!isRecurring)}
                        >
                            <Ionicons
                                name={isRecurring ? "repeat" : "repeat-outline"}
                                size={20}
                                color={isRecurring ? "#FFF" : "#CCC"}
                                style={styles.recurringIcon}
                            />
                            <Text style={[styles.recurringText, isRecurring && styles.activeRecurringText]}>
                                Recurring Budget
                            </Text>
                        </TouchableOpacity>
                        {isRecurring && (
                            <TextInput
                                style={styles.input}
                                value={endDate}
                                onChangeText={setEndDate}
                                placeholder="End Date (Optional)"
                                placeholderTextColor="#666"
                            />
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.createButton,
                        (!selectedCategoryItem || !amount) && styles.createButtonDisabled,
                    ]}
                    onPress={handleCreateBudget}
                >
                    <Text style={styles.createButtonText}>Create Budget</Text>
                </TouchableOpacity>
            </LinearGradient>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    errorText: {
        color: "#FF4444",
        fontSize: 12,
        marginTop: 4,
    },
    inputError: {
        borderWidth: 1,
        borderColor: "#FF4444",
    },
    previewText: {
        color: "#4ADE80",
        fontSize: 14,
        marginTop: 8,
        textAlign: "right",
    },
    categoriesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 8,
    },
    categoryItem: {
        backgroundColor: "#2C2C2C",
        borderRadius: 8,
        padding: 12,
        width: "48%",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "transparent",
    },
    selectedCategory: {
        backgroundColor: "#3700B3",
        borderColor: "#8B5CF6",
    },
    categoryItemText: {
        color: "#CCC",
        fontSize: 14,
        marginTop: 8,
        textAlign: "center",
    },
    selectedCategoryText: {
        color: "#FFF",
        fontWeight: "bold",
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#0F172A",
    },
    card: {
        backgroundColor: "#1E1E1E",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#FFF",
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: "#CCC",
    },
    input: {
        backgroundColor: "#2C2C2C",
        borderRadius: 8,
        padding: 12,
        color: "#FFF",
        fontSize: 16,
    },
    periodContainer: {
        marginBottom: 24,
    },
    periodButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    periodButton: {
        flex: 1,
        backgroundColor: "#2C2C2C",
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 4,
        alignItems: "center",
    },
    activePeriod: {
        backgroundColor: "#3700B3",
    },
    periodButtonText: {
        color: "#CCC",
        fontSize: 14,
    },
    activePeriodText: {
        color: "#FFF",
        fontWeight: "bold",
    },
    createButton: {
        backgroundColor: "#3700B3",
        borderRadius: 8,
        padding: 16,
        alignItems: "center",
    },
    createButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    recurringContainer: {
        marginTop: 16,
    },
    recurringButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2C2C2C",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    activeRecurring: {
        backgroundColor: "#3700B3",
        borderColor: "#8B5CF6",
        borderWidth: 1,
    },
    recurringIcon: {
        marginRight: 8,
    },
    recurringText: {
        color: "#CCC",
        fontSize: 14,
    },
    activeRecurringText: {
        color: "#FFF",
        fontWeight: "bold",
    },
});
