import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import "dotenv/config";
import queryAndLog from "./queryAndLog";

const app = express();

// read in contents of any environment variables in the .env file
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

app.get("/", handleSeeAllTodos);

async function handleSeeAllTodos(req: Request, res: Response) {
  const allTodos = await queryAndLog(client, 'SELECT * FROM "todos"');
  res.json(allTodos.rows);
}

app.post("/", async (req, res) => {
  const { task, due_date, completed } = req.body;
  await queryAndLog(
    client,
    'INSERT INTO todos ("task", "due_date", "completed") VALUES($1, $2, $3)',
    [task, due_date, completed]
  );
  res.json("new todo posted");
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const task: string = req.body.task;
  await client.query("UPDATE todos SET task = $2 WHERE id=$1", [id, task]);
  res.json("todo was updated");
});

app.put("/complete/true/:id", async (req, res) => {
  const { id } = req.params;
  await client.query("UPDATE todos SET completed = false WHERE id=$1", [id]);
  res.json("marked as not completed");
});

app.put("/complete/false/:id", async (req, res) => {
  const { id } = req.params;
  await client.query("UPDATE todos SET completed = true WHERE id=$1", [id]);
  res.json("marked as completed");
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await client.query("DELETE FROM todos WHERE id=$1", [id]);
  res.json("todo was deleted");
});

// OLD CODE
// app.get("/", (req, res) => {
//   res.json(thingsToDo);
// });
// app.post("/", (req,res) => {
//   const receivedTodo = req.body;
//   thingsToDo.push(receivedTodo);
//   res.send(`I now have ${thingsToDo.length} todos`)
// })

async function connectToDBAndStartExpress() {
  await client.connect();
  app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
  });
}

connectToDBAndStartExpress();

// const thingsToDo = [
//   { id: 1, action: "Read Selene", date: "08/08/2023", completed: "No" },
//   { id: 2, action: "Finish todo app", date: "05/08/2023", completed: "Yes" },
//   { id: 3, action: "Plan trip", date: "10/08/2023", completed: "No" },
// ];
