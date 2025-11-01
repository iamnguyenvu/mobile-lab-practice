import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [q, setQ] = useState("");

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

        {/* Bộ lọc Thu/Chi (UI trước) */}
        <View style={styles.filterRow}>
          <View style={[styles.pill, styles.pillActive]}>
            <Text style={[styles.pillText, styles.pillTextActive]}>Tất cả</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Thu</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Chi</Text>
          </View>
        </View>
      </View>

      {/* Danh sách (placeholder UI) */}
      <FlatList
        data={[]}
        keyExtractor={(_, i) => String(i)}
        renderItem={() => null}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có dữ liệu</Text>}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  search: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  addBtn: {
    backgroundColor: "#222",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    height: 40,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 999,
  },
  pillActive: {
    backgroundColor: "#222",
  },
  pillText: {
    color: "#333",
  },
  pillTextActive: {
    color: "#fff",
  },
  listContent: {
    padding: 16,
  },
  empty: {
    textAlign: "center",
    marginTop: 24,
    color: "#888",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
});
