import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute"; // ✅ Protect Routes
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import DynamicForm from "./pages/DynamicForm";
import AddNewEvents from "./pages/AddNewEvents";
import ViewForm from "./pages/ViewForm";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Volunteer from "./pages/Volunteer";
import VolunteerLogin from "./pages/VolunteerLogin";
import Events from "./pages/Events";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="create-new-events" element={<AddNewEvents />} />
            <Route path="events" element={<Events />} />
            <Route path="create-new-form" element={<DynamicForm />} />
            <Route path="create-new-form" element={<DynamicForm />} />
            <Route path="volunteer" element={<Volunteer />} />
            <Route path="/volunteer/login" element={<VolunteerLogin />} />
            <Route path="events-form" element={<ViewForm />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
