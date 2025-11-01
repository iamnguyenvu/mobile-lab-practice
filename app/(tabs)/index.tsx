import ExpenseItem, { ExpenseType } from "@/components/ExpenseItem";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Expense = {
  id: string;
  title: string;
  amount: number;
  createdAt: string;   // ISO
  type: ExpenseType;
};

const demoData: Expense[] = [
  { id: "1", title: "Lương tháng 10", amount: 15000000, type: "income",  createdAt: new Date().toISOString() },
  { id: "2", title: "Cà phê sáng",   amount: 35000,    type: "expense", createdAt: new Date().toISOString() },
  { id: "3", title: "Bán đồ cũ",     amount: 500000,   type: "income",  createdAt: new Date().toISOString() },
  { id: "4", title: "Mua sách",      amount: 120000,   type: "expense", createdAt: new Date().toISOString() },
];

export default function HomeScreen() {
  const [q, setQ] = useState("");

  // lọc tạm theo text (title/amount) cho demo
  const filtered = demoData.filter((it) => {
    if (!q.trim()) return true;
    const key = q.trim().toLowerCase();
    return it.title.toLowerCase().includes(key) || String(it.amount).includes(key);
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>EXPENSE TRACKER</Text>

        {/* Thanh thao tác nhanh */}
        <View style={styles.row}>
          <TextInput
            placeholder="Tìm theo tên hoặc số tiền…"
            value={q}
            onChangeText={setQ}
            style={styles.search}
          />
          <Pressable onPress={() => {}} style={styles.addBtn}>
            <Text style={styles.addBtnText}>Thêm</Text>
          </Pressable>
        </View>

        {/* Bộ lọc (UI placeholder) */}
        <View style={styles.filterRow}>
          <View style={[styles.pill, styles.pillActive]}><Text style={[styles.pillText, styles.pillTextActive]}>Tất cả</Text></View>
          <View style={styles.pill}><Text style={styles.pillText}>Thu</Text></View>
          <View style={styles.pill}><Text style={styles.pillText}>Chi</Text></View>
        </View>
      </View>

      {/* Danh sách Thu–Chi */}
      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <ExpenseItem
            title={item.title}
            amount={item.amount}
            createdAt={item.createdAt}
            type={item.type}
            onLongPress={() => {/* soft-delete sau này */}}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có dữ liệu</Text>}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f7f7" },
  header: {
    paddingTop: 8, paddingBottom: 12, paddingHorizontal: 16,
    backgroundColor: "#ffffff", borderBottomWidth: 1, borderColor: "#eee",
  },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center", letterSpacing: 0.5 },
  row: { flexDirection: "row", gap: 8, marginTop: 12 },
  search: {
    flex: 1, height: 40, backgroundColor: "#f0f0f0",
    borderRadius: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: "#e5e5e5",
  },
  addBtn: { backgroundColor: "#222", paddingHorizontal: 16, borderRadius: 8, justifyContent: "center", height: 40 },
  addBtnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  filterRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  pill: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: "#eee", borderRadius: 999 },
  pillActive: { backgroundColor: "#222" },
  pillText: { color: "#333" },
  pillTextActive: { color: "#fff" },
  listContent: { paddingBottom: 24 },
  empty: { textAlign: "center", marginTop: 24, color: "#888" },
});
