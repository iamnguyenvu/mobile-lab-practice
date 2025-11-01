import { getExpense, updateExpense } from "@/db/sqlite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

export default function Edit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [loading, setLoading] = useState(true);

  const titleRef = useRef<TextInput>(null);
  const amountRef = useRef<TextInput>(null);

  useEffect(() => {
    loadExpense();
  }, [id]);

  const loadExpense = async () => {
    if (Platform.OS === "web") {
      setLoading(false);
      return;
    }
    if (!id) {
      Alert.alert("Lỗi", "Không tìm thấy ID");
      router.back();
      return;
    }
    try {
      const expense = await getExpense(id as string);
      if (expense) {
        setTitle(expense.title);
        setAmount(expense.amount.toString());
        setType(expense.type);
      } else {
        Alert.alert("Lỗi", "Không tìm thấy khoản chi tiêu");
        router.back();
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu: " + error);
    } finally {
      setLoading(false);
    }
  };

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
      // Câu 4b: Gọi function sửa
      await updateExpense(id as string, {
        title: title.trim(),
        amount: num,
        type,
      });

      Alert.alert("Thành công", "Đã cập nhật khoản chi tiêu");
      
      // Câu 4c: Quay lại để cập nhật danh sách
      router.back();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật: " + error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (Platform.OS === "web") {
    return (
      <SafeAreaView style={styles.container}>
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Câu 4a: Screen mới để sửa */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Quay lại</Text>
          </Pressable>
          <Text style={styles.title}>Sửa Thu/Chi</Text>
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

          {/* Câu 4b: Nút Save để cập nhật */}
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
