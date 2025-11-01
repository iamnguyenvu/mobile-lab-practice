import { formatDateTime, formatMoney } from "@/utils/format";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type ExpenseType = "income" | "expense";

export interface ExpenseItemProps {
  title: string;          // a) Tên khoản chi
  amount: number;         // b) Số tiền
  createdAt: string;      // c) Ngày tạo (ISO string)
  type: ExpenseType;      // d) Loại ('income' | 'expense')
  onPress?: () => void;
  onLongPress?: () => void;
}

export default function ExpenseItem(props: ExpenseItemProps) {
  const { title, amount, createdAt, type, onPress, onLongPress } = props;
  const isIncome = type === "income";

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.container}>
      {/* Left: Title + Date */}
      <View style={styles.left}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.date}>{formatDateTime(createdAt)}</Text>
      </View>

      {/* Right: Amount + Type badge */}
      <View style={styles.right}>
        <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
          {isIncome ? "+" : "-"}{formatMoney(amount)}
        </Text>
        <View style={[styles.badge, isIncome ? styles.badgeIncome : styles.badgeExpense]}>
          <Text style={styles.badgeText}>{isIncome ? "Thu" : "Chi"}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  left: { flex: 1, minWidth: 0 },
  right: { alignItems: "flex-end", gap: 6 },
  title: { fontSize: 15, fontWeight: "600", color: "#222" },
  date: { fontSize: 12, color: "#777" },
  amount: { fontSize: 15, fontWeight: "800" },
  income: { color: "#1b5e20" },     // xanh đậm
  expense: { color: "#b71c1c" },    // đỏ đậm
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  badgeIncome: { backgroundColor: "#e8f5e9" },
  badgeExpense: { backgroundColor: "#ffebee" },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#333" },
});
