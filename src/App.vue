<script setup lang="ts">
import { ref, computed } from "vue";
import TodoCard, {
  type Priority,
  type SubtaskInfo,
} from "@/components/TodoCard.vue";
import { Plus, CheckCircle2, Sparkles } from "@lucide/vue";
import { DATA } from "./data/mock_up";

interface TodoItem {
  id: number;
  title: string;
  description?: string;
  is_done: boolean;
  priority?: Priority;
  dueDate?: string;
  subtasks?: SubtaskInfo;
}

const todos = ref<TodoItem[]>(DATA as TodoItem[]); // equal to useState()

const newTitle = ref("");
const newPriority = ref<Priority>("medium");

const completedCount = computed(
  // equal to useMemo()
  () => todos.value.filter((t) => t.is_done).length,
);
const totalCount = computed(() => todos.value.length);
const progressPercent = computed(() =>
  totalCount.value === 0
    ? 0
    : Math.round((completedCount.value / totalCount.value) * 100),
);

function handleToggle(todo: TodoItem, state: boolean) {
  todo.is_done = state;
}

function handleDelete(id: number | string) {
  todos.value = todos.value.filter((t) => t.id !== id);
}

function handleEdit(id: number | string) {
  const todo = todos.value.find((t) => t.id === id);
  if (!todo) return;
  const updated = window.prompt("Edit task title:", todo.title);

  if (updated && updated.trim()) {
    todo.title = updated.trim();
  }
}

function handleAddTodo() {
  if (!newTitle.value.trim()) return;
  todos.value.unshift({
    id: Date.now(),
    title: newTitle.value.trim(),
    is_done: false,
    priority: newPriority.value,
    dueDate: "Today",
  });
  newTitle.value = "";
}
</script>

<template>
  <main
    class="min-h-screen bg-zinc-950 text-zinc-100 flex justify-center py-12 px-4 sm:px-6"
  >
    <div class="max-w-2xl w-full space-y-6">
      <!-- Header -->
      <div
        class="flex items-center justify-between pb-2 border-b border-zinc-800/80"
      >
        <div>
          <h1 class="font-bold text-3xl tracking-tight text-white">
            Today's Tasks
          </h1>
          <p class="text-sm text-zinc-400 mt-1">
            Keep track of what matters today
          </p>
        </div>

        <!-- Progress Indicator -->
        <div class="text-right">
          <div
            class="flex items-center justify-end gap-1.5 text-sm font-medium text-zinc-300"
          >
            <CheckCircle2 class="size-4 text-emerald-400" />
            <span>{{ completedCount }} / {{ totalCount }}</span>
          </div>
          <div class="w-24 h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div
              class="h-full bg-emerald-500 rounded-full transition-all duration-300"
              :style="{ width: `${progressPercent}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Quick Add Input -->
      <form
        @submit.prevent="handleAddTodo"
        class="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 focus-within:border-zinc-700 focus-within:ring-1 focus-within:ring-zinc-700 transition-all"
      >
        <input
          v-model="newTitle"
          type="text"
          placeholder="Add a new task..."
          class="flex-1 bg-transparent px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-hidden"
        />

        <select
          v-model="newPriority"
          class="bg-zinc-800 border border-zinc-700/60 text-xs text-zinc-300 rounded-lg px-2.5 py-1.5 outline-hidden cursor-pointer hover:bg-zinc-750 transition-colors"
        >
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button
          type="submit"
          class="inline-flex items-center gap-1 bg-zinc-100 text-zinc-950 hover:bg-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Plus class="size-3.5" />
          Add
        </button>
      </form>

      <!-- Todo Cards List -->
      <div class="space-y-3">
        <!-- v-for used to loop the element from iterable object -->
        <TodoCard
          v-for="todo in todos"
          :key="todo.id"
          :id="todo.id"
          :title="todo.title"
          :description="todo.description"
          :is_done="todo.is_done"
          :priority="todo.priority"
          :due-date="todo.dueDate"
          :subtasks="todo.subtasks"
          @toggle="(val) => handleToggle(todo, val)"
          @delete="handleDelete"
          @edit="handleEdit"
        />

        <div
          v-if="todos.length === 0"
          class="text-center py-12 border border-dashed border-zinc-800 rounded-xl text-zinc-500"
        >
          <p class="text-sm">No tasks remaining! Enjoy your day.</p>
        </div>
      </div>
    </div>
  </main>
</template>
