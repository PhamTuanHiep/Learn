import {
  Box,
  FormControl,
  FormLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useTaskForm } from "../../../../../contexts/adminContext/AdminContext";
import type {
  TaskPriority,
  TaskStatus,
} from "../../../../../types/admin/admin.types";

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "Todo" },
  { value: "doing", label: "Doing" },
  { value: "done", label: "Done" },
];

const PriorityDeadlineSection = () => {
  const { draft, dispatch } = useTaskForm();
  const { schedule } = draft;

  return (
    <Stack spacing={2}>
      <FormLabel>Priority &amp; Deadline</FormLabel>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 140 }}>
          <TextField
            select
            size="small"
            label="Priority"
            value={schedule.priority}
            onChange={(e) =>
              dispatch({
                type: "SET_SCHEDULE",
                payload: { priority: e.target.value as TaskPriority },
              })
            }
          >
            {PRIORITIES.map((p) => (
              <MenuItem key={p.value} value={p.value}>
                {p.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        <TextField
          type="date"
          size="small"
          label="Due Date"
          slotProps={{ inputLabel: { shrink: true } }}
          value={schedule.dueDate}
          onChange={(e) =>
            dispatch({
              type: "SET_SCHEDULE",
              payload: { dueDate: e.target.value },
            })
          }
        />

        <FormControl sx={{ minWidth: 140 }}>
          <TextField
            select
            size="small"
            label="Status"
            value={schedule.status}
            onChange={(e) =>
              dispatch({
                type: "SET_SCHEDULE",
                payload: { status: e.target.value as TaskStatus },
              })
            }
          >
            {STATUSES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Box>
    </Stack>
  );
};

export default PriorityDeadlineSection;
