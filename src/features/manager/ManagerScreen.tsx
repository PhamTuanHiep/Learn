import { Route, Switch, useRouteMatch } from "react-router-dom";
import ManagerTaskScreen from "./managerTaskScreen/ManagerTaskScreen";
import EditTask from "./managerTaskScreen/editTask/EditTask";

const ManagerScreen = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={ManagerTaskScreen} />
      <Route path={`${path}/task/new`} component={EditTask} />
      <Route path={`${path}/task/:id/edit`} component={EditTask} />
    </Switch>
  );
};

export default ManagerScreen;
