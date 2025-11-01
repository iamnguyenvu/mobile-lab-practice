import { Expense, listDeletedExpenses, restoreExpense } from "@/db/sqlite";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    Platform,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExpenseItem from "../components/ExpenseItem";

export default function TrashScreen() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (Platform.OS === "web") return;
    try {
      const rows = await listDeletedExpenses(q);
      setData(rows);
    } catch (error) {
      console.error("Error loading deleted expenses:", error);
    }
  }, [q]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  // Câu 8: Restore expense from trash
  const handleRestore = (item: Expense) => {
    Alert.alert(
      "Khôi phục",
      `Bạn có muốn khôi phục "${item.title}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Khôi phục",
          onPress: async () => {
            try {
              await restoreExpense(item.id);
              Alert.alert("Thành công", "Đã khôi phục khoản chi tiêu");
              load();
            } catch (error) {
              Alert.alert("Lỗi", "Không thể khôi phục: " + error);
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
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Quay lại</Text>
          </Pressable>
          <Text style={styles.title}>Thùng rác</Text>
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
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </Pressable>
        <Text style={styles.title}>Thùng rác 🗑️</Text>

        {/* Search */}
        <View style={styles.row}>
          <TextInput
            placeholder="Tìm trong thùng rác..."
            value={q}
            onChangeText={setQ}
            style={styles.search}
          />
        </View>
      </View>

      {/* Danh sách đã xóa */}
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <ExpenseItem
            title={item.title}
            amount={item.amount}
            createdAt={item.deletedAt || item.createdAt}
            type={item.type}
            onLongPress={() => handleRestore(item)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Thùng rác trống</Text>}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f7f7" },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  backBtn: { marginBottom: 8 },
  backBtnText: { fontSize: 16, color: "#007AFF" },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: { flexDirection: "row", gap: 8 },
  search: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  listContent: { paddingBottom: 24 },
  empty: { textAlign: "center", marginTop: 24, color: "#888" },
});
