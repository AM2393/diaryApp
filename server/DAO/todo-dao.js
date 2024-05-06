const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const todoFolderPath = path.join(__dirname, "storage", "todoList");

// Method to read a todo from a file
function get(todoId) {
  try {
    const filePath = path.join(todoFolderPath, `${todoId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadTodo", message: error.message };
  }
}

// Method to write a todo to a file
function create(todo) {
  try {
    todo.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(todoFolderPath, `${todo.id}.json`);
    const fileData = JSON.stringify(todo);
    fs.writeFileSync(filePath, fileData, "utf8");
    return todo;
  } catch (error) {
    throw { code: "failedToCreateTodo", message: error.message };
  }
}

// Method to update todo in a file
function update(todo) {
  try {
    const currentTodo = get(todo.id);
    if (!currentTodo) return null;
    const newTodo = { ...currentTodo, ...todo };
    const filePath = path.join(todoFolderPath, `${todo.id}.json`);
    const fileData = JSON.stringify(newTodo);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newTodo;
  } catch (error) {
    throw { code: "failedToUpdateTodo", message: error.message };
  }
}

// Method to remove a todo from a file
function remove(todoId) {
  try {
    const filePath = path.join(todoFolderPath, `${todoId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveTodo", message: error.message };
  }
}

// Method to list todos in a folder
function list() {
  try {
    const files = fs.readdirSync(todoFolderPath);
    const todoList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(todoFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return todoList;
  } catch (error) {
    throw { code: "failedToListTodos", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
}; 
