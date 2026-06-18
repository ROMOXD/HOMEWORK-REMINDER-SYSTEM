import { BRAND_GREEN, cardShadow } from "@/constants/theme";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TaskCard } from "@/components/TaskCard";
import { useTasks } from "@/contexts/TaskContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarScreen() {
  const { tasks } = useTasks();
  const { colors } = useAppTheme();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekday(year, month);
  const monthLabel = new Date(year, month, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const tasksByDay = useMemo(() => {
    const map = new Map<number, typeof tasks>();
    tasks.forEach((task) => {
      const due = new Date(task.dueDate);
      if (due.getMonth() === month && due.getFullYear() === year) {
        const day = due.getDate();
        map.set(day, [...(map.get(day) ?? []), task]);
      }
    });
    return map;
  }, [tasks, month, year]);

  const selectedTasks = tasksByDay.get(selectedDay) ?? [];

  const changeMonth = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
    setSelectedDay(1);
  };

  const calendarCells = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    calendarCells.push(day);
  }

  return (
    <ScreenContainer scroll padded={false}>
      <View style={[styles.calendarSection, styles.padded]}>
        <View style={styles.monthRow}>
          <Pressable onPress={() => changeMonth(-1)} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={BRAND_GREEN} />
          </Pressable>
          <Text style={[styles.monthLabel, { color: colors.text }]}>{monthLabel}</Text>
          <Pressable onPress={() => changeMonth(1)} hitSlop={12}>
            <Ionicons name="chevron-forward" size={22} color={BRAND_GREEN} />
          </Pressable>
        </View>

        <View style={styles.weekdays}>
          {WEEKDAYS.map((day) => (
            <Text key={day} style={[styles.weekday, { color: colors.textMuted }]}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {calendarCells.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.cell} />;
            }

            const hasTasks = (tasksByDay.get(day)?.length ?? 0) > 0;
            const isSelected = day === selectedDay;
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            return (
              <Pressable
                key={day}
                onPress={() => setSelectedDay(day)}
                style={[
                  styles.cell,
                  isSelected && { backgroundColor: colors.primaryTint },
                  isToday && !isSelected && { borderColor: BRAND_GREEN, borderWidth: 1.5 },
                ]}
              >
                <Text
                  style={{
                    color: isSelected ? colors.primaryDark : colors.text,
                    fontWeight: isToday ? "800" : "600",
                    fontSize: 15,
                  }}
                >
                  {day}
                </Text>
                {hasTasks ? (
                  <View style={[styles.dot, { backgroundColor: BRAND_GREEN }]} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.deadlineSection, { backgroundColor: colors.backgroundMuted }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Deadline Tracking
        </Text>
        <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
          {monthLabel.split(" ")[0]} {selectedDay}
        </Text>

        <View style={styles.list}>
          {selectedTasks.length === 0 ? (
            <View style={[styles.empty, cardShadow, { backgroundColor: colors.card }]}>
              <Text style={{ color: colors.textSecondary }}>
                No deadlines on this day.
              </Text>
            </View>
          ) : (
            selectedTasks.map((task) => (
              <TaskCard key={task.id} task={task} variant="deadline" />
            ))
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: 20 },
  calendarSection: { paddingTop: 8, paddingBottom: 20, gap: 12 },
  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monthLabel: { fontSize: 20, fontWeight: "800" },
  weekdays: { flexDirection: "row", justifyContent: "space-between" },
  weekday: { width: "14.28%", textAlign: "center", fontWeight: "700", fontSize: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    borderRadius: 12,
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  deadlineSection: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    gap: 4,
    minHeight: 280,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  sectionSub: { fontSize: 14, marginBottom: 12 },
  list: { gap: 10 },
  empty: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
});
