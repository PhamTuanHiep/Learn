import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useHistory, useParams } from "react-router-dom";
import {
  TaskFormProvider,
  useTaskForm,
  type TaskDraft,
} from "../../../../contexts/adminContext/AdminContext";
import {
  useCreateTaskMutation,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
} from "../../../../services/api/taskApi";
import TaskInfoSection from "./sections/TaskInfoSection";
import PriorityDeadlineSection from "./sections/PriorityDeadlineSection";
import AssignUserSection from "./sections/AssignUserSection";
import { MANAGER_PATH } from "../../../../constants/app.constants";

// --- Inner form: reads/writes via context ---
const EditTaskForm = ({ taskId }: { taskId?: number }) => {
  const { draft } = useTaskForm();
  const history = useHistory();
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation();
  const loading = creating || updating;

  const handleSubmit = async () => {
    const { title, description, note } = draft.info;
    if (!title.trim()) return;

    const { priority, dueDate, status } = draft.schedule;
    const payload = {
      title,
      description,
      note,
      priority,
      dueDate,
      status,
      assignedUserIds: draft.assignedUserIds,
    };

    if (taskId) {
      await updateTask({ taskId, ...payload });
    } else {
      await createTask(payload);
    }
    history.push(MANAGER_PATH.MANAGER);
  };

  return (
    <Stack spacing={3}>
      <TaskInfoSection />
      <Divider />
      <PriorityDeadlineSection />
      <Divider />
      <AssignUserSection />
      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => history.push(MANAGER_PATH.MANAGER)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={loading || !draft.info.title.trim()}
          sx={{ minWidth: 160 }}
        >
          {loading ? "Saving…" : taskId ? "Update Task" : "Create Task"}
        </Button>
      </Box>
    </Stack>
  );
};

// --- Wrapper: fetches existing task (edit mode) then provides context ---
const EditTaskWrapper = ({ taskId }: { taskId?: number }) => {
  const { data, isLoading } = useGetTaskByIdQuery(taskId!, { skip: !taskId });

  if (taskId && isLoading) return <CircularProgress />;

  const initialDraft: TaskDraft | undefined = data
    ? {
        info: {
          title: data.title,
          description: data.description ?? "",
          note: data.note ?? "",
        },
        schedule: {
          priority: data.priority ?? "medium",
          dueDate: data.dueDate ?? "",
          status: data.status ?? "todo",
        },
        assignedUserIds: data.assignedUserIds ?? [],
      }
    : undefined;

  return (
    <TaskFormProvider initialDraft={initialDraft}>
      <EditTaskForm taskId={taskId} />
    </TaskFormProvider>
  );
};

// --- Route entry point ---
const EditTask = () => {
  const { id } = useParams<{ id?: string }>();
  const taskId = id ? Number(id) : undefined;

  return (
    <Card sx={{ padding: 2 }}>
      <CardHeader title={taskId ? "Edit Task" : "New Task"} />
      <CardContent>
        <EditTaskWrapper taskId={taskId} />
      </CardContent>
    </Card>
  );
};

export default EditTask;
