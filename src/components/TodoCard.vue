<script setup lang="ts">
import { computed } from "vue";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Flag, ListTodo, Pencil, Trash2 } from "@lucide/vue";
import { cn } from "@/lib/utils";

export type Priority = "urgent" | "high" | "medium" | "low";

export interface SubtaskInfo {
  completed: number;
  total: number;
}

export interface TodoCardProps {
  id?: number | string;
  title: string;
  description?: string;
  is_done?: boolean;
  isDone?: boolean;
  priority?: Priority;
  dueDate?: string;
  subtasks?: SubtaskInfo;
  class?: string;
}

const props = withDefaults(defineProps<TodoCardProps>(), {
  id: () => Math.random().toString(36).substring(2, 9),
  is_done: undefined,
  isDone: undefined,
});

const emit = defineEmits<{
  (e: "update:isDone", value: boolean): void;
  (e: "update:is_done", value: boolean): void;
  (e: "toggle", value: boolean): void;
  (e: "edit", id: number | string): void;
  (e: "delete", id: number | string): void;
}>();

const isCompleted = computed(() => {
  return props.isDone ?? props.is_done ?? false;
});

const priorityStyles: Record<
  Priority,
  { label: string; badge: string; bar: string; icon: string }
> = {
  urgent: {
    label: "Urgent",
    badge: "bg-rose-950/40 text-rose-400 border-rose-800/40",
    bar: "bg-rose-500",
    icon: "text-rose-400",
  },
  high: {
    label: "High",
    badge: "bg-orange-950/40 text-orange-400 border-orange-800/40",
    bar: "bg-orange-500",
    icon: "text-orange-400",
  },
  medium: {
    label: "Medium",
    badge: "bg-amber-950/40 text-amber-400 border-amber-800/40",
    bar: "bg-amber-500",
    icon: "text-amber-400",
  },
  low: {
    label: "Low",
    badge: "bg-emerald-950/40 text-emerald-400 border-emerald-800/40",
    bar: "bg-emerald-500",
    icon: "text-emerald-400",
  },
};

const currentPriority = computed(() => {
  return props.priority ? priorityStyles[props.priority] : null;
});

function handleToggle(value: boolean | "indeterminate") {
  const nextValue = value === true;
  emit("update:isDone", nextValue);
  emit("update:is_done", nextValue);
  emit("toggle", nextValue);
}

function handleEdit() {
  emit("edit", props.id);
}

function handleDelete() {
  emit("delete", props.id);
}
</script>

<template>
  <Card
    :class="
      cn(
        'group relative flex flex-row items-start gap-3.5 p-4 rounded-xl border transition-all duration-200 select-none overflow-hidden',
        isCompleted
          ? 'border-zinc-800/40 bg-zinc-950/40 opacity-60 hover:opacity-85'
          : 'border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 hover:bg-zinc-900 shadow-sm hover:shadow-md hover:shadow-black/25',
        props.class,
      )
    "
  >
    <!-- Priority left edge indicator bar -->
    <div
      v-if="currentPriority && !isCompleted"
      :class="
        cn(
          'absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-md transition-all',
          currentPriority.bar,
        )
      "
    />

    <!-- Checkbox -->
    <div class="pt-0.5 shrink-0">
      <Checkbox
        :id="`todo-${id}`"
        :model-value="isCompleted"
        @update:model-value="handleToggle"
        class="border-zinc-700 data-[state=checked]:bg-zinc-100 data-[state=checked]:text-zinc-950 data-[state=checked]:border-zinc-100 transition-colors cursor-pointer"
      />
    </div>

    <!-- Main Content -->
    <div class="flex-1 min-w-0">
      <label :for="`todo-${id}`" class="cursor-pointer block">
        <p
          :class="
            cn(
              'text-sm sm:text-base font-medium leading-snug tracking-tight transition-all',
              isCompleted
                ? 'line-through text-zinc-500 decoration-zinc-600'
                : 'text-zinc-100 group-hover:text-white',
            )
          "
        >
          {{ title }}
        </p>

        <!-- Description -->
        <p
          v-if="description"
          :class="
            cn(
              'text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed transition-colors',
              isCompleted
                ? 'line-through text-zinc-600 decoration-zinc-700'
                : 'text-zinc-400 group-hover:text-zinc-300',
            )
          "
        >
          {{ description }}
        </p>
      </label>

      <!-- Metadata Badges Row -->
      <div
        v-if="currentPriority || dueDate || subtasks"
        class="mt-2.5 flex flex-wrap items-center gap-2 pt-0.5"
      >
        <!-- Priority Badge -->
        <span
          v-if="currentPriority"
          :class="
            cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors',
              isCompleted
                ? 'border-zinc-800 text-zinc-600 bg-zinc-900/50'
                : currentPriority.badge,
            )
          "
        >
          <Flag :class="cn('size-3', !isCompleted && currentPriority.icon)" />
          {{ currentPriority.label }}
        </span>

        <!-- Due Date Badge -->
        <span
          v-if="dueDate"
          :class="
            cn(
              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors',
              isCompleted
                ? 'border-zinc-800 text-zinc-600 bg-zinc-900/50'
                : 'border-zinc-700/50 bg-zinc-800/80 text-zinc-300',
            )
          "
        >
          <Calendar class="size-3 text-zinc-400" />
          {{ dueDate }}
        </span>

        <!-- Subtasks Badge -->
        <span
          v-if="subtasks"
          :class="
            cn(
              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors',
              isCompleted
                ? 'border-zinc-800 text-zinc-600 bg-zinc-900/50'
                : 'border-zinc-800 bg-zinc-800/40 text-zinc-400',
            )
          "
        >
          <ListTodo class="size-3 text-zinc-400" />
          {{ subtasks.completed }}/{{ subtasks.total }} subtasks
        </span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div
      class="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 shrink-0"
    >
      <button
        type="button"
        title="Edit task"
        @click.stop="handleEdit"
        class="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-zinc-600 transition-colors"
      >
        <Pencil class="size-4" />
      </button>

      <button
        type="button"
        title="Delete task"
        @click.stop="handleDelete"
        class="p-1.5 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 focus:outline-hidden focus:ring-1 focus:ring-rose-500/50 transition-colors"
      >
        <Trash2 class="size-4" />
      </button>
    </div>
  </Card>
</template>
