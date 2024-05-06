const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;
const completementController=require("./controller/completement.js")
const todoController=require("./controller/todo.js")
const todoListController=require("./controller/todoList.js")
// Middleware pro zpracování JSON požadavků
app.use(bodyParser.json());

// Simulace databáze pro ukládání to-do položek
let todoList = [];
/*

// Přidání nové položky do to-do seznamu
app.post('/todos', (req, res) => {
    const newItem = req.body;
    todoList.push(newItem);
    res.json(newItem);
});

// Úprava existující položky v to-do seznamu
app.put('/todos/:id', (req, res) => {
    const itemId = req.params.id;
    const updatedItem = req.body;

    // Najdi položku podle indexu v poli
    const index = parseInt(itemId);
    if (index >= 0 && index < todoList.length) {
        todoList[index] = { ...todoList[index], ...updatedItem };
        res.json(todoList[index]);
    } else {
        res.status(404).json({ error: 'Položka nenalezena.' });
    }
});

// Označení položky v to-do seznamu jako hotovou
app.patch('/todos/:id/complete', (req, res) => {
    const itemId = req.params.id;

    // Najdi položku podle indexu v poli
    const index = parseInt(itemId);
    if (index >= 0 && index < todoList.length) {
        todoList[index].completed = true;
        res.json(todoList[index]);
    } else {
        res.status(404).json({ error: 'Položka nenalezena.' });
    }
});

// Odstranění položky z to-do seznamu
app.delete('/todos/:id', (req, res) => {
    const itemId = req.params.id;

    // Najdi index položky v poli
    const index = parseInt(itemId);
    if (index >= 0 && index < todoList.length) {
        todoList.splice(index, 1);
        res.json({ message: 'Položka byla odstraněna.' });
    } else {
        res.status(404).json({ error: 'Položka nenalezena.' });
    }
});

// Získání všech položek z to-do seznamu
app.get('/todos', (req, res) => {
    res.json(todoList);
});

// Nastavení routy pro základní URL
app.get('/', (req, res) => {
    res.send('Hello world!');
});
*/

app.use("/completement",completementController)
app.use("/todo",todoController)
app.use("/todoList",todoListController)

// Spuštění serveru
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});





// AMU! Tohle si tu zatím nech, ale pak to nezapomeň předělat, až to budeš chtít testovat!