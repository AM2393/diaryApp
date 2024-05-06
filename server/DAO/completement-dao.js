const fs = require("fs");
const path = require("path");

const todoFolderPath = path.join(__dirname, "storage", "todoList");

// Metoda pro čtení položky z úkolu z souboru
function get(todoId) {
  try {
    const todoList = list();
    const todo = todoList.find((todo) => todo.id === todoId);
    return todo;
  } catch (error) {
    throw { code: "failedToReadTodo", message: error.message };
  }
}

// Metoda pro aktualizaci úkolu v souboru
function update(todo) {
  try {
    const currentTodo = get(todo.id) || {};
    if (currentTodo.file) {
      const filePath = path.join(todoFolderPath, currentTodo.file);
      fs.unlinkSync(filePath);
    }
    const newTodo = { ...currentTodo, ...todo };

    const filePath = path.join(
      todoFolderPath,
      `${newTodo.id}_${newTodo.title}_${newTodo.completed}.txt`
    );
    fs.writeFileSync(filePath, "", "utf8");
    return newTodo;
  } catch (error) {
    throw { code: "failedToUpdateTodo", message: error.message };
  }
}

// Metoda pro odstranění úkolu ze souboru
function remove(todoId) {
  try {
    const todo = get(todoId);
    if (todo) {
      const filePath = path.join(todoFolderPath, todo.file);
      fs.unlinkSync(filePath);
    }
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveTodo", message: error.message };
  }
}

// Metoda pro výpis všech úkolů ve složce
function list() {
  try {
    const files = fs.readdirSync(todoFolderPath);
    const todoList = files.map((file) => {
      const todoData = file.replace(".txt", "").split("_");
      return {
        id: todoData[0],
        title: todoData[1],
        completed: Boolean(todoData[2]),
        file,
      };
    });
    return todoList;
  } catch (error) {
    throw { code: "failedToListTodos", message: error.message };
  }
}

module.exports = {
  get,
  update,
  remove,
  list,
};
