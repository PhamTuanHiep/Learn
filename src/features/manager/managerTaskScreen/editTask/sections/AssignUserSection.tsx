import {
  Avatar,
  Chip,
  CircularProgress,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useTaskForm } from "../../../../../contexts/adminContext/AdminContext";
import { useGetUsersQuery } from "../../../../../services/api/userApi";

const AssignUserSection = () => {
  const { draft, dispatch } = useTaskForm();
  const { data: users, isLoading, isError } = useGetUsersQuery();

  if (isLoading) return <CircularProgress size={20} />;
  if (isError || !users)
    return <Typography color="error">Failed to load users.</Typography>;

  return (
    <Stack spacing={1}>
      <FormLabel>Assign Users</FormLabel>
      <Stack direction="row" sx={{ flexWrap: "wrap" }} spacing={1}>
        {users.map((user) => {
          const selected = draft.assignedUserIds.includes(user.userId);
          return (
            <Chip
              key={user.userId}
              label={user.name}
              avatar={<Avatar>{user.name[0]}</Avatar>}
              color={selected ? "primary" : "default"}
              onClick={() =>
                dispatch({ type: "TOGGLE_ASSIGN_USER", payload: user.userId })
              }
              clickable
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export default AssignUserSection;
