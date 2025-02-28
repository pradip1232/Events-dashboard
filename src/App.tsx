import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from './pages/Users';
import DynamicForm from "./pages/DynamicForm";
import AddNewEvents from "./pages/AddNewEvents";
import ViewForm from "./pages/ViewForm";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="create-new-events" element={<AddNewEvents />} />
          <Route path="create-new-form" element={<DynamicForm />} />
          <Route path="events-form" element={<ViewForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
