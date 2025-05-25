// src/pages/Goals/index.tsx
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GoalModal } from "@/components/goals/GoalModal";
import type { Goal } from "@/types/goal";
import { apiService } from "@/services/goals.service";

export default function GoalListPage() {
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "add" | "edit";
    currentGoal?: Goal;
  }>({ open: false, mode: "add" });

  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    apiService
      .getGoals()
      .then((resp) => {
        setGoals(resp as Goal[]);
      })
      .catch((err) => console.log(err.message));
  }, []);

  const handleSubmit = (goalData: Goal) => {
    if (modalState.mode === "add") {
      // Add new goal
      apiService
        .createGoal({ ...goalData })
        .then((resp) => {
          setGoals((prev) => [...prev, { ...goalData, id: resp.id }]);
        })
        .catch((err) => console.log(err.message));
    } else {
      const { id, ...rest } = goalData;
      // Update existing goal
      apiService
        .updateGoal(id, rest)
        .then((resp) => {
          setGoals((prev) =>
            prev.map((goal) =>
              goal.id === modalState.currentGoal?.id
                ? { ...goal, ...goalData }
                : goal
            )
          );
        })
        .catch((err) => console.log(err.message));
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Goals</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setModalState({ open: true, mode: "add" })}
          >
            Add Goal
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.map((goal) => (
              <TableRow key={goal.id}>
                <TableCell className="font-medium">{goal.title}</TableCell>
                <TableCell>{goal.description}</TableCell>
                <TableCell>
                  {new Date(goal.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {goal.status.replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setModalState({
                        open: true,
                        mode: "edit",
                        currentGoal: goal,
                      })
                    }
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <GoalModal
        open={modalState.open}
        onOpenChange={(open) => setModalState((prev) => ({ ...prev, open }))}
        mode={modalState.mode}
        goal={modalState.currentGoal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
