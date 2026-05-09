"use client";

import { LayoutProps } from "./LayoutSelector";
import { useTheme } from "../ThemeContext";

export type DashboardVariant =
  | "modern"
  | "hacienda"
  | "tropical"
  | "luxury"
  | "romantic"
  | "industrial";

interface FunctionalDashboardProps extends LayoutProps {
  variant: DashboardVariant;
}

function isColorDark(hex: string) {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.45;
}

function getVariantStyles(variant: DashboardVariant, isDark: boolean, theme: ReturnType<typeof useTheme>) {
  const baseBg = theme.bgPrimary;
  const cardRadius = variant === "luxury" ? 16 : variant === "romantic" ? 18 : 10;
  const headerBg =
    variant === "tropical"
      ? `linear-gradient(90deg, ${theme.primaryColor}, ${theme.accentColor})`
      : variant === "hacienda"
        ? `linear-gradient(90deg, ${theme.primaryColor}55, ${theme.accentColor}33)`
        : variant === "luxury"
          ? `linear-gradient(90deg, #111111, ${theme.primaryColor}55)`
          : variant === "industrial"
            ? "#0f172a"
            : "#ffffff";

  const pageBg =
    variant === "romantic"
      ? `radial-gradient(circle at 20% 10%, ${theme.primaryColor}22, transparent 55%), ${baseBg}`
      : variant === "industrial"
        ? `repeating-linear-gradient(45deg, ${baseBg}, ${baseBg} 12px, ${theme.bgSecondary} 12px, ${theme.bgSecondary} 24px)`
        : variant === "hacienda"
          ? `linear-gradient(135deg, ${theme.bgPrimary}, ${theme.bgSecondary})`
          : variant === "tropical"
            ? `linear-gradient(135deg, ${theme.bgPrimary}, ${theme.accentColor}22, ${theme.bgSecondary})`
            : baseBg;

  return {
    pageBg,
    headerBg,
    headerText: variant === "modern" && !isDark ? theme.primaryColor : "#ffffff",
    sidebarBg: isDark ? "rgba(255,255,255,0.06)" : "#f9f9f9",
    panelBg: isDark ? "rgba(255,255,255,0.08)" : "#ffffff",
    cardBg: isDark ? "rgba(255,255,255,0.08)" : "#ffffff",
    cardRadius,
    borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)",
    textColor: isDark ? "#f8fafc" : "#0f172a",
    mutedText: isDark ? "rgba(226,232,240,0.6)" : "#64748b",
    accent: theme.primaryColor,
  };
}

export function FunctionalDashboard({
  eventState,
  onTaskProgress,
  onToggleItem,
  onResetEvent,
  variant,
}: FunctionalDashboardProps) {
  const theme = useTheme();
  const isDark = isColorDark(theme.bgPrimary);
  const styles = getVariantStyles(variant, isDark, theme);
  const { tasks, categories, totalProgress } = eventState;

  const tasksByCategory = categories.map((cat) => ({
    ...cat,
    tasks: tasks.filter((t) => t.category === cat.id),
  }));

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: styles.pageBg,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: styles.textColor,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: styles.headerBg,
          padding: "18px 24px",
          borderBottom: `1px solid ${styles.borderColor}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.4rem",
              fontWeight: 900,
              color: styles.headerText,
              margin: 0,
            }}
          >
            {eventState.eventName}
          </h1>
          <p style={{ fontSize: "0.9rem", color: styles.headerText, margin: "4px 0 0", opacity: 0.8 }}>
            {eventState.hostName} • {eventState.estimatedGuests} guests • {eventState.eventDate}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.2rem", fontWeight: 900, color: styles.headerText }}>
            {totalProgress}%
          </div>
          <div style={{ fontSize: "0.8rem", color: styles.headerText, opacity: 0.75 }}>Completed</div>
          <button
            onClick={onResetEvent}
            style={{
              marginTop: "8px",
              padding: "6px 12px",
              background: isDark ? "rgba(255,255,255,0.12)" : "#f3f4f6",
              border: `1px solid ${styles.borderColor}`,
              borderRadius: "8px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              color: styles.headerText,
            }}
          >
            New Event
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "260px",
            background: styles.sidebarBg,
            padding: "20px",
            borderRight: `1px solid ${styles.borderColor}`,
            overflowY: "auto",
          }}
        >
          <h3
            style={{
              fontSize: "0.8rem",
              fontWeight: 800,
              color: styles.accent,
              margin: "0 0 16px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Categories
          </h3>
          {tasksByCategory.map((cat) => (
            <div
              key={cat.id}
              style={{
                padding: "10px 12px",
                marginBottom: "8px",
                background: cat.status === "active" ? `${styles.accent}1a` : "transparent",
                borderLeft: `3px solid ${cat.status === "active" ? styles.accent : styles.borderColor}`,
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: cat.status === "active" ? styles.accent : styles.mutedText,
              }}
            >
              {cat.icon} {cat.name}
              <div style={{ fontSize: "0.75rem", color: styles.mutedText, marginTop: "2px" }}>
                {cat.tasks.length} tasks
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            {tasks.map((task) => {
              const isLocked = task.status === "locked";
              const isCompleted = task.status === "completed";
              return (
                <div
                  key={task.id}
                  style={{
                    background: styles.cardBg,
                    border: `1px solid ${styles.borderColor}`,
                    borderRadius: `${styles.cardRadius}px`,
                    padding: "16px",
                    boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.05)",
                    opacity: isLocked ? 0.6 : 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: styles.textColor,
                      }}
                    >
                      {task.title}
                    </h4>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "999px",
                        background:
                          task.status === "completed"
                            ? "#dcfce7"
                            : task.status === "active"
                              ? `${styles.accent}1a`
                              : "rgba(148,163,184,0.18)",
                        color:
                          task.status === "completed"
                            ? "#16a34a"
                            : task.status === "active"
                              ? styles.accent
                              : styles.mutedText,
                      }}
                    >
                      {task.status === "completed" ? "Done" : task.status === "active" ? "Active" : "Locked"}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: styles.mutedText, margin: "0 0 10px" }}>
                    {task.description}
                  </p>

                  {/* Items */}
                  <div style={{ marginBottom: "10px" }}>
                    {task.items.slice(0, 3).map((item) => (
                      <label
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.8rem",
                          marginBottom: "6px",
                          cursor: isLocked ? "not-allowed" : "pointer",
                          color: styles.textColor,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          disabled={isLocked}
                          onChange={() => onToggleItem(task.id, item.id)}
                          style={{ marginRight: "6px" }}
                        />
                        <span
                          style={{
                            color: item.completed ? styles.mutedText : styles.textColor,
                            textDecoration: item.completed ? "line-through" : "none",
                          }}
                        >
                          {item.title}
                        </span>
                      </label>
                    ))}
                    {task.items.length > 3 && (
                      <div style={{ fontSize: "0.75rem", color: styles.mutedText, marginTop: "4px" }}>
                        +{task.items.length - 3} more
                      </div>
                    )}
                  </div>

                  {/* Budget */}
                  <div
                    style={{
                      padding: "8px",
                      background: styles.panelBg,
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      color: styles.mutedText,
                      marginBottom: "10px",
                      border: `1px solid ${styles.borderColor}`,
                    }}
                  >
                    Budget: ${task.estimatedCost}
                  </div>

                  <button
                    onClick={() => onTaskProgress(task.id)}
                    disabled={isCompleted || isLocked}
                    style={{
                      width: "100%",
                      padding: "8px",
                      background: isCompleted || isLocked ? "rgba(148,163,184,0.2)" : styles.accent,
                      color: isCompleted || isLocked ? styles.mutedText : "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: isCompleted || isLocked ? "not-allowed" : "pointer",
                    }}
                  >
                    {isCompleted ? "✓ Complete" : "Report Progress"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
