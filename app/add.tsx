import { insertExpense } from "@/db/sqlite";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Add() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  // Câu 3d: useRef để clear input
  const titleRef = useRef<TextInput>(null);
  const amountRef = useRef<TextInput>(null);

  const handleSave = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Error", "SQLite is not supported on web. Please use Android/iOS.");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên khoản chi");
      return;
    }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }

    try {
      // Câu 3c: Lưu vào SQLite
      await insertExpense({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: title.trim(),
        amount: num,
        type,
        createdAt: new Date().toISOString(),
        deletedAt: null,
      });

      Alert.alert("Thành công", "Đã thêm khoản chi tiêu mới");

      // Câu 3d: Clear input sau khi thêm
      setTitle("");
      setAmount("");
      setType("expense");
      titleRef.current?.clear();
      amountRef.current?.clear();

      // Quay lại màn hình chính
      router.back();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu dữ liệu: " + error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Câu 3a: Screen mới để thêm */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Quay lại</Text>
          </Pressable>
          <Text style={styles.title}>Thêm Thu/Chi Mới</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Tên khoản chi</Text>
            <TextInput
              ref={titleRef}
              placeholder="Ví dụ: Ăn sáng, Lương tháng..."
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Số tiền (VNĐ)</Text>
            <TextInput
              ref={amountRef}
              placeholder="Ví dụ: 50000"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Loại</Text>
            <View style={styles.typeRow}>
              <Pressable
                onPress={() => setType("income")}
                style={[
                  styles.typeBtn,
                  type === "income" && styles.typeBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    type === "income" && styles.typeBtnTextActive,
                  ]}
                >
                  Thu
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setType("expense")}
                style={[
                  styles.typeBtn,
                  type === "expense" && styles.typeBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    type === "expense" && styles.typeBtnTextActive,
                  ]}
                >
                  Chi
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Câu 3b & 3c: Nút Save */}
          <Pressable onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },
  scroll: { padding: 16 },
  header: { marginBottom: 20 },
  backBtn: { marginBottom: 12 },
  backBtnText: { fontSize: 16, color: "#007AFF" },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    color: "#222",
  },
  form: { gap: 20 },
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", color: "#555" },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  typeRow: { flexDirection: "row", gap: 12 },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  typeBtnActive: {
    backgroundColor: "#222",
    borderColor: "#222",
  },
  typeBtnText: { fontSize: 16, fontWeight: "600", color: "#555" },
  typeBtnTextActive: { color: "#fff" },
  saveBtn: {
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: "#222",
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: { fontSize: 18, fontWeight: "700", color: "#fff" },
});
