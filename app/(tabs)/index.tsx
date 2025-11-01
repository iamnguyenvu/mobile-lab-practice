import { Expense, listExpenses, softDeleteExpense } from "@/db/sqlite";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, Platform, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExpenseItem from "../../components/ExpenseItem";

export default function HomeScreen() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (Platform.OS === "web") return;
    try {
      const rows = await listExpenses(q);
      setData(rows);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  }, [q]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  // Câu 5: Xóa với long press
  const handleDelete = (item: Expense) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa "${item.title}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await softDeleteExpense(item.id);
              Alert.alert("Thành công", "Đã xóa khoản chi tiêu");
              load();
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa: " + error);
            }
          },
        },
      ]
    );
  };

  if (Platform.OS === "web") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>EXPENSE TRACKER</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: "center", color: "#666" }}>
            📱 This app requires SQLite which is only available on Android/iOS.{"\n\n"}
            Please run on a mobile device or emulator.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>EXPENSE TRACKER</Text>

        {/* Search + Add */}
        <View style={styles.row}>
          <TextInput
            placeholder="Tìm theo tên hoặc số tiền…"
            value={q}
            onChangeText={setQ}
            style={styles.search}
          />
          <Pressable onPress={() => router.push("/add")} style={styles.addBtn}>
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/trash")} style={styles.trashBtn}>
            <Text style={styles.trashBtnText}>🗑️</Text>
          </Pressable>
        </View>

        {/* Filter (placeholder UI) */}
        <View style={styles.filterRow}>
          <View style={[styles.pill, styles.pillActive]}><Text style={[styles.pillText, styles.pillTextActive]}>Tất cả</Text></View>
          <View style={styles.pill}><Text style={styles.pillText}>Thu</Text></View>
          <View style={styles.pill}><Text style={styles.pillText}>Chi</Text></View>
        </View>
      </View>

      {/* Danh sách từ SQLite */}
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <ExpenseItem
            title={item.title}
            amount={item.amount}
            createdAt={item.createdAt}
            type={item.type}
            onPress={() => router.push({ pathname: "/edit", params: { id: item.id } })}
            onLongPress={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có dữ liệu</Text>}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  trashBtn: { backgroundColor: "#666", paddingHorizontal: 12, borderRadius: 8, justifyContent: "center", height: 40 },
  trashBtnText: { fontSize: 20 },
  filterRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  pill: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: "#eee", borderRadius: 999 },
  pillActive: { backgroundColor: "#222" },
  pillText: { color: "#333" },
  pillTextActive: { color: "#fff" },
  listContent: { paddingBottom: 24 },
  empty: { textAlign: "center", marginTop: 24, color: "#888" },
});
