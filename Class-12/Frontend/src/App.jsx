// App.jsx

import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    salary: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const API_URL = "https://bootcamp-avyq.onrender.com/employees";

  // FETCH EMPLOYEES
  const getEmployees = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD EMPLOYEE
  const addEmployee = async (e) => {
    e.preventDefault();

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setFormData({
        name: "",
        department: "",
        salary: "",
      });

      getEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // START EDIT
  const editEmployee = (employee) => {
    setEditingId(employee.id);

    setFormData({
      name: employee.name,
      department: employee.department,
      salary: employee.salary,
    });
  };

  // UPDATE EMPLOYEE
  const updateEmployee = async (e) => {
    e.preventDefault();

    try {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setEditingId(null);

      setFormData({
        name: "",
        department: "",
        salary: "",
      });

      getEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // DELETE EMPLOYEE
  const deleteEmployee = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      getEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // FILTER + SEARCH
  const filteredEmployees = employees.filter((employee) => {
    const searchMatch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());

    const filterMatch =
      filterDepartment === "" || employee.department === filterDepartment;

    return searchMatch && filterMatch;
  });

  // UNIQUE DEPARTMENTS
  const departments = [...new Set(employees.map((emp) => emp.department))];

  return (
    <div className="container">
      <h1>Employee Management System</h1>

      {/* EMPLOYEE COUNT */}
      <h2>Total Employees: {employees.length}</h2>

      {/* FORM */}
      <form
        onSubmit={editingId ? updateEmployee : addEmployee}
        className="form"
      >
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Employee" : "Add Employee"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                department: "",
                salary: "",
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* SEARCH */}
      <input
        className="search-box"
        type="text"
        placeholder="🔍 Search by Name or Department..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* FILTER */}
      <select
        value={filterDepartment}
        onChange={(e) => setFilterDepartment(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <option value="">All Departments</option>

        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {/* EMPLOYEE CARDS */}
      <div className="employee-grid">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <div key={employee.id} className="card">
              <h3>{employee.name}</h3>

              <p>
                <strong>Department:</strong> {employee.department}
              </p>

              <p>
                <strong>Salary:</strong> ₹{employee.salary}
              </p>

              <div className="action-buttons">
  <button
    className="edit-btn"
    onClick={() => editEmployee(employee)}
  >
    ✏️ Edit
  </button>

  <button
    className="delete-btn"
    onClick={() => deleteEmployee(employee.id)}
  >
    🗑 Delete
  </button>
</div>
            </div>
          ))
        ) : (
          <h3>No employees found.</h3>
        )}
      </div>
    </div>
  );
}

export default App;
