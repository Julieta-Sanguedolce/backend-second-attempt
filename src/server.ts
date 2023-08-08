import express from "express";
import cors from "cors";
import dotenv from "dotenv";


const app = express();

const thingsToDo = [
  {id:1, action: "Read Selene", date: "08/08/2023", completed: "No"},
  {id:2, action: "Finish todo app", date: "05/08/2023", completed: "Yes"},
  {id:3, action: "Plan trip", date: "10/08/2023", completed: "No"}];


/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// read in contents of any environment variables in the .env file
dotenv.config();

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

app.get("/", (req, res) => {
res.json(thingsToDo)
});

app.post("/", (req,res) => {
  const receivedTodo = req.body;
  thingsToDo.push(receivedTodo);
  res.send(`I now have ${thingsToDo.length} todos`)
})


//not finished - need to add logic in app to delete
// app.delete("/",(req,res)=> {
//   const toDelete = parseInt(req.params.id);
//   let index = thingsToDo.findIndex((task)=>task.id === toDelete) 
//   thingsToDo.splice(index,1);
//   res.send("task deleted");
// })



app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
