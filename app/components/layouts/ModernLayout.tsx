"use client";

import { LayoutProps } from "./LayoutSelector";
import { useTheme } from "../ThemeContext";

export function ModernLayout({
  eventState,
  onTaskProgress,
  onToggleItem,
  onResetEvent,
}: LayoutProps) {
  const theme = useTheme();
  const { tasks, categories, guests, totalProgress } = eventState;

  const tasksByCategory = categories.map((cat) => ({
    ...cat,
    tasks: tasks.filter((t) => t.category === cat.id),
  }));

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: theme.bgPrimary,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: "20px 24px",
          borderBottom: `1px solid ${theme.primaryColor}22`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: theme.primaryColor, margin: 0 }}>
            {eventState.eventName}
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#666", margin: "4px 0 0" }}>
            {eventState.hostName} • {eventState.estimatedGuests} guests
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.2rem", fontWeight: 900, color: theme.primaryColor }}>
            {totalProgress}%
          </div>
          <div style={{ fontSize: "0.8rem", color: "#666" }}>Completed</div>
          <button
            onClick={onResetEvent}
            style={{
              marginTop: "8px",
              padding: "6px 12px",
              background: "#f3f4f6",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
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
            background: "#f9f9f9",
            padding: "20px",
            borderRight: "1px solid #eee",
            overflowY: "auto",
          }}
        >
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: theme.primaryColor, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Categories
          </h3>
          {tasksByCategory.map((cat) => (
            <div
              key={cat.id}
              style={{
                padding: "10px 12px",
                marginBottom: "8px",
                background: cat.status === "active" ? `${theme.primaryColor}15` : "#f3f4f6",
                borderLeft: `3px solid ${cat.status === "active" ? theme.primaryColor : "#ddd"}`,
                borderRadius: "4px",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: cat.status === "active" ? theme.primaryColor : "#999",
              }}
            >
              {cat.icon} {cat.name}
              <div style={{ fontSize: "0.75rem", color: "#999", marginTop: "2px" }}>
                {cat.tasks.length} tasks
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  background: "#fff",
                  border: `1px solid ${theme.primaryColor}22`,
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
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
                  <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#1e293b" }}>
                    {task.title}
                  </h4>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background:
                        task.status === "completed"
                          ? "#dcfce7"
                          : task.status === "active"
                            ? `${theme.primaryColor}15`
                            : "#f3f4f6",
                      color:
                        task.status === "completed"
                          ? "#16a34a"
                          : task.status === "active"
                            ? theme.primaryColor
                            : "#666",
                    }}
                  >
                    {task.status === "completed" ? "Done" : task.status === "active" ? "Active" : "Locked"}
                  </span>
                </div>

                <p style={{ fontSize: "0.85rem", color: "#666", margin: "0 0 10px" }}>
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
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => onToggleItem(task.id, item.id)}
                        style={{ marginRight: "6px" }}
                      />
                      <span style={{ color: item.completed ? "#999" : "#333", textDecoration: item.completed ? "line-through" : "none" }}>
                        {item.title}
                      </span>
                    </label>
                  ))}
                  {task.items.length > 3 && (
                    <div style={{ fontSize: "0.75rem", color: "#999", marginTop: "4px" }}>
                      +{task.items.length - 3} more
                    </div>
                  )}
                </div>

                {/* Budget */}
                <div
                  style={{
                    padding: "8px",
                    background: "#f9f9f9",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  Budget: ${task.estimatedCost}
                </div>

                <button
                  onClick={() => onTaskProgress(task.id)}
                  disabled={task.status === "completed"}
                  style={{
                    width: "100%",
                    padding: "6px",
                    background: task.status === "completed" ? "#f3f4f6" : theme.primaryColor,
                    color: task.status === "completed" ? "#999" : "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: task.status === "completed" ? "not-allowed" : "pointer",
                  }}
                >
                  {task.status === "completed" ? "✓ Complete" : "Report Progress"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
