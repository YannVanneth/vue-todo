export const DATA = [
  {
    id: 1,
    title: "Finalize design system & dark theme tokens",
    description:
      "Ensure contrast ratios pass WCAG AA standards across all cards and interactive controls.",
    is_done: false,
    priority: "urgent",
    dueDate: "Today",
    subtasks: { completed: 2, total: 3 },
  },
  {
    id: 2,
    title: "Implement TodoCard component with hover actions",
    description:
      "Add smooth checkbox toggle, priority badge, and quick edit/delete buttons.",
    is_done: true,
    priority: "high",
    dueDate: "Today",
  },
  {
    id: 3,
    title: "Configure TypeScript types and state models",
    description:
      "Define clean interfaces for todo items, subtasks, and priority levels.",
    is_done: false,
    priority: "medium",
    dueDate: "Tomorrow",
    subtasks: { completed: 1, total: 2 },
  },
  {
    id: 4,
    title: "Explore animation transitions for completed tasks",
    is_done: false,
    priority: "low",
    dueDate: "Oct 18",
  },
];
