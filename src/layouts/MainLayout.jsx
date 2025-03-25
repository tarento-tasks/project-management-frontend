import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = ({ role }) => {
  return (
    <div className="d-flex">
      <Sidebar role={role} />
      <div className="content p-4">
        <Outlet /> 
      </div>
    </div>
  );
};

export default MainLayout;
