const API_URL = "/api/employees";
const form = document.getElementById("employee-form");
const list = document.getElementById("employee-list");
const message = document.getElementById("message");
const idInput = document.getElementById("employee-id");
const nameInput = document.getElementById("name");
const departmentInput = document.getElementById("department");
const emailInput = document.getElementById("email");
const formTitle = document.getElementById("form-title");
const saveButton = document.getElementById("save-button");

function showMessage(text, error = false) {
  message.textContent = text;
  message.className = error ? "error" : "success";
}

function resetForm() {
  form.reset();
  idInput.value = "";
  formTitle.textContent = "Add employee";
  saveButton.textContent = "Add employee";
}

async function loadEmployees() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Could not load employees");
    const employees = await response.json();
    list.replaceChildren();

    if (employees.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.textContent = "No employees found.";
      row.appendChild(cell);
      list.appendChild(row);
      return;
    }

    employees.forEach(employee => {
      const row = document.createElement("tr");
      [employee.id, employee.name, employee.department, employee.email].forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      const actions = document.createElement("td");
      const edit = document.createElement("button");
      edit.textContent = "Edit";
      edit.className = "edit";
      edit.addEventListener("click", () => {
        idInput.value = employee.id;
        nameInput.value = employee.name;
        departmentInput.value = employee.department;
        emailInput.value = employee.email;
        formTitle.textContent = "Update employee";
        saveButton.textContent = "Update employee";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      const remove = document.createElement("button");
      remove.textContent = "Delete";
      remove.className = "delete";
      remove.addEventListener("click", () => deleteEmployee(employee.id));
      actions.append(edit, remove);
      row.appendChild(actions);
      list.appendChild(row);
    });
  } catch (error) {
    showMessage(error.message, true);
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const id = idInput.value;
  const employee = {
    name: nameInput.value.trim(),
    department: departmentInput.value.trim(),
    email: emailInput.value.trim()
  };

  try {
    const response = await fetch(id ? `${API_URL}/${id}` : API_URL, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee)
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || "Unable to save employee");
    }

    showMessage(id ? "Employee updated." : "Employee added.");
    resetForm();
    await loadEmployees();
  } catch (error) {
    showMessage(error.message, true);
  }
});

async function deleteEmployee(id) {
  if (!window.confirm("Delete this employee?")) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Unable to delete employee");
    showMessage("Employee deleted.");
    await loadEmployees();
  } catch (error) {
    showMessage(error.message, true);
  }
}

document.getElementById("cancel-button").addEventListener("click", resetForm);
loadEmployees();
