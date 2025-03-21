import AppRoutes from "./routes/AppRoutes";

function App() {
  const role = "admin"; // You can change this dynamically from authService
  return <AppRoutes role={role} />;
}

export default App;
