import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { useHistory } from "react-router-dom";
import { useGetTasksQuery, useDeleteTaskMutation } from "../../../services/api/taskApi";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toggleMode } from "../../../store/themeSlice";
import { MANAGER_PATH } from "../../../constants/app.constants";
import type { Task } from "../../../types/admin/admin.types";

type HeaderTaskTable = Task & { action: string };
interface Column {
  id: keyof HeaderTaskTable;
  label: string;
  minWidth?: number;
  align?: "right";
}
const columns: readonly Column[] = [
  { id: "taskId", label: "ID", minWidth: 60 },
  { id: "title", label: "Task Name", minWidth: 140 },
  { id: "description", label: "Description", minWidth: 200 },
  { id: "note", label: "Note", minWidth: 140 },
  { id: "action", label: "Action", minWidth: 190, align: "right" },
];

const ManagerTaskScreen = () => {
  const history = useHistory();
  const { data: tasks = [], isLoading, isError } = useGetTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((s) => s.theme.mode);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  if (isLoading) return <CircularProgress sx={{ m: 4 }} />;
  if (isError)
    return (
      <Typography color="error" sx={{ m: 4 }}>
        Failed to load tasks.
      </Typography>
    );

  return (
    <Card sx={{ padding: 2 }}>
      <CardHeader
        title="List Tasks"
        action={
          <Tooltip title={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => dispatch(toggleMode())}
              startIcon={themeMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            >
              {themeMode === "light" ? "Dark" : "Light"}
            </Button>
          </Tooltip>
        }
      />
      <CardContent sx={{ paddingTop: 0 }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="task table">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((task) => (
                  <TableRow hover key={task.taskId}>
                    {columns.map((col) => {
                      if (col.id === "action") {
                        return (
                          <TableCell key="action" align="right">
                            <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() =>
                                  history.push(
                                    MANAGER_PATH.TASK_EDIT.replace(":id", String(task.taskId)),
                                  )
                                }
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => deleteTask(task.taskId)}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={col.id} align={col.align}>
                          {task[col.id as keyof Task] ?? "—"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
        />
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => history.push(MANAGER_PATH.TASK_NEW)}
        >
          New Task
        </Button>
      </CardActions>
    </Card>
  );
};

export default ManagerTaskScreen;
