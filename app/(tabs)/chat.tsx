import { useAppTheme } from "@/hooks/use-app-theme";
import { sendChatMessage, type ChatMessage } from "@/lib/ai";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I’m your Homework Reminder System assistant. I can help you manage assignments, reminders, subjects, and app features. Ask me anything about the app or your homework workflow.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (!scrollRef.current || !isAtBottom) return;
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 220);

    return () => clearTimeout(timeout);
  }, [messages, isAtBottom]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const nextHistory = [...messages, { role: "user" as const, text: trimmed }];
    setMessages(nextHistory);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const reply = await sendChatMessage(trimmed, nextHistory);
      setMessages((current) => [...current, { role: "assistant" as const, text: reply }]);
    } catch (err: any) {
      const message = err?.message ?? "Unable to get a chat response.";
      setError(message);
      setMessages((current) => [
        ...current,
        { role: "assistant" as const, text: "Sorry, I couldn’t connect to the assistant right now." },
      ]);
      console.error("Chat assistant error:", message);
    } finally {
      setIsSending(false);
    }
  };

  const handleScroll = (e: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const paddingToBottom = 20;
    const atBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    setIsAtBottom(atBottom);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.bottom + 28}
      >
        <View style={[styles.header, { backgroundColor: colors.background }]}> 
          <Text style={[styles.title, { color: colors.text }]}>Studii Chatbot</Text>
        </View>

        <View style={styles.body}>
          <ScrollView
            ref={scrollRef}
            style={styles.chatArea}
            contentContainerStyle={[styles.chatContent, { paddingBottom: 140 + Math.max(insets.bottom, 12) }]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => (
              <View
                key={`${message.role}-${index}`}
                style={[
                  styles.messageBubble,
                  {
                    backgroundColor: message.role === "assistant" ? colors.card : colors.primaryTint,
                    alignSelf: message.role === "assistant" ? "flex-start" : "flex-end",
                  },
                ]}
              >
                <Text style={[styles.messageText, { color: colors.text }]}> 
                  {message.text}
                </Text>
              </View>
            ))}

            {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}
          </ScrollView>
        </View>

        <View style={[styles.bottomInputWrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}> 
          <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.inputBg }]}> 
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              placeholderTextColor={colors.textMuted}
              multiline
            />
            <Pressable
              onPress={handleSend}
              style={({ pressed }) => [styles.sendButton, { opacity: pressed ? 0.8 : 1 }]}
              disabled={isSending}
            >
              <Ionicons name="send" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16, gap: 6 },
  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 15 },
  body: { flex: 1 },
  chatArea: { flex: 1, paddingHorizontal: 20 },
  chatContent: { gap: 14 },
  bottomInputWrapper: {
    paddingHorizontal: 18,
    width: "100%",
    backgroundColor: "transparent",
  },
  messageBubble: { borderRadius: 18, padding: 16, maxWidth: "80%" },
  messageText: { fontSize: 15, lineHeight: 22 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 14,
    borderRadius: 999,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  input: { flex: 1, minHeight: 50, fontSize: 16, padding: 10 },
  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#3ADB1D",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: { fontSize: 14, marginTop: 10 },
  keyboardAvoiding: { width: "100%" },
  safeArea: { flex: 1 },
});
