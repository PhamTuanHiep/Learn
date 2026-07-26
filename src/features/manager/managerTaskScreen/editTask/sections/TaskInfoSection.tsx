import { Stack, TextField, FormLabel, Box } from "@mui/material";
import { useTaskForm } from "../../../../../contexts/adminContext/AdminContext";

const TaskInfoSection = () => {
  const { draft, dispatch } = useTaskForm();
  const { info } = draft;

  return (
    <Stack spacing={2}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <FormLabel sx={{ minWidth: 90 }}>Title *</FormLabel>
        <TextField
          fullWidth
          size="small"
          value={info.title}
          onChange={(e) =>
            dispatch({ type: "SET_INFO", payload: { title: e.target.value } })
          }
        />
      </Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <FormLabel sx={{ minWidth: 90 }}>Description</FormLabel>
        <TextField
          fullWidth
          size="small"
          multiline
          rows={2}
          value={info.description}
          onChange={(e) =>
            dispatch({
              type: "SET_INFO",
              payload: { description: e.target.value },
            })
          }
        />
      </Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <FormLabel sx={{ minWidth: 90 }}>Note</FormLabel>
        <TextField
          fullWidth
          size="small"
          value={info.note}
          onChange={(e) =>
            dispatch({ type: "SET_INFO", payload: { note: e.target.value } })
          }
        />
      </Box>
    </Stack>
  );
};

export default TaskInfoSection;
