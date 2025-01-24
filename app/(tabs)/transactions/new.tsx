import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import Colors from '../../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function New() {
  const [amount, setAmount] = useState('0');
  const [comment, setComment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('shopping');

  const handleNumberPress = (num: string) => {
    if (amount === '0') {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleDecimalPress = () => {
    if (!amount.includes('.')) {
      setAmount(amount + '.');
    }
  };

  const handleDeletePress = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const formatAmount = () => {
    const num = parseFloat(amount);
    return isNaN(num) ? '0.00' : num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const CalcButton = ({ onPress, children, style }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.calcButton, style]}
    >
      <Text style={styles.calcButtonText}>{children}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <LinearGradient
          colors={[Colors.dark.gradient.primary, Colors.dark.gradient.secondary]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.totalLabel}>Total Balance</Text>
          <Text style={styles.totalAmount}>${formatAmount()}</Text>
        </LinearGradient>
      </View>

      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'cash' && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory('cash')}
        >
          <Ionicons name="cash-outline" size={24} color={selectedCategory === 'cash' ? Colors.dark.gradient.primary : '#fff'} />
          <Text style={styles.categoryButtonText}>Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'shopping' && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory('shopping')}
        >
          <Ionicons name="cart-outline" size={24} color={selectedCategory === 'shopping' ? Colors.dark.gradient.primary : '#fff'} />
          <Text style={styles.categoryButtonText}>Shopping</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.commentInput}
        placeholder="Add a comment"
        placeholderTextColor="#666"
        value={comment}
        onChangeText={setComment}
      />

      <View style={styles.keypadContainer}>
        <View style={styles.keypadRow}>
          <CalcButton onPress={() => handleNumberPress('7')}>7</CalcButton>
          <CalcButton onPress={() => handleNumberPress('8')}>8</CalcButton>
          <CalcButton onPress={() => handleNumberPress('9')}>9</CalcButton>
        </View>
        <View style={styles.keypadRow}>
          <CalcButton onPress={() => handleNumberPress('4')}>4</CalcButton>
          <CalcButton onPress={() => handleNumberPress('5')}>5</CalcButton>
          <CalcButton onPress={() => handleNumberPress('6')}>6</CalcButton>
        </View>
        <View style={styles.keypadRow}>
          <CalcButton onPress={() => handleNumberPress('1')}>1</CalcButton>
          <CalcButton onPress={() => handleNumberPress('2')}>2</CalcButton>
          <CalcButton onPress={() => handleNumberPress('3')}>3</CalcButton>
        </View>
        <View style={styles.keypadRow}>
          <CalcButton onPress={() => handleNumberPress('0')}>0</CalcButton>
          <CalcButton onPress={handleDecimalPress}>.</CalcButton>
          <CalcButton onPress={handleDeletePress}>
            <Ionicons name="backspace-outline" size={24} color="#fff" />
          </CalcButton>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <LinearGradient
          colors={[Colors.dark.gradient.primary, Colors.dark.gradient.secondary]}
          style={styles.submitGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="checkmark" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    
  },
  totalContainer: {
    width: '100%',
    paddingVertical: 32,
    marginBottom: 24,
  },
  gradientBackground: {
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  totalLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginBottom: 8,
  },
  totalAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '45%',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(138, 124, 255, 0.2)',
    borderWidth: 1,
    borderColor: Colors.dark.gradient.primary,
  },
  categoryButtonText: {
    color: '#fff',
    marginTop: 8,
  },
  commentInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    color: '#fff',
  },
  keypadContainer: {
    padding: 16,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calcButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    width: (Dimensions.get('window').width - 64) / 3,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calcButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  submitButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
  },
  submitGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});