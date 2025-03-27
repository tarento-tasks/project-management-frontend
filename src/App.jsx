import AppRoutes from "./routes/AppRoutes";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const role = "admin"; // Hardcoded for now
  console.log("Current Role:", role);
  return <AppRoutes role={role} />;
}

export default App;
