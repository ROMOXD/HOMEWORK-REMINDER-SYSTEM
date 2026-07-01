import { PrimaryButton } from "@/components/PrimaryButton";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type DialogAction = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
};

type AppDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  actions?: DialogAction[];
  onClose?: () => void;
};

export function AppDialog({ visible, title, message, actions, onClose }: AppDialogProps) {
  const { colors } = useAppTheme();
  const dialogActions =
    actions?.length && actions.length > 0
      ? actions
      : [{ label: "OK", onPress: onClose ?? (() => {}), variant: "primary" }];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {message ? (
            <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
          ) : null}

          <View style={styles.actionRow}>
            {dialogActions.map((action, index) => (
              <PrimaryButton
                key={`${action.label}-${index}`}
                title={action.label}
                onPress={action.onPress}
                variant={action.variant ?? "secondary"}
                style={styles.actionButton}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.1,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    minWidth: 100,
    flex: 1,
  },
});
