import { useParams } from "react-router-dom";

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();

  return <div>UserDetail Page - ID: {id}</div>;
};

export default UserDetail;
