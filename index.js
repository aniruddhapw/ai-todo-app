import {db} from './db/index.js';
import { todosTable } from './db/schema.js';
import OpenAI from 'openai';
import readlineSync from 'readline-sync';

const OPENAI_API_KEY=process.env.OPENAI_API_KEY;
const baseURL = "https://api.aimlapi.com/v1";

const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL:baseURL
});
//tools
async function getAllTodos() {
 const todos=await db.select().from(todosTable);
 return todos
}

async function createTodo(todo) {
    const [result]=await db.insert().into(todosTable).values({todo}).returning({
        id:todosTable.id,
    });
    return result.id
}

async function deleteTodoById(id) {
  await db.delete().from(todosTable).where('id').eq(id)
}

async function searchTodos(query) {
  const todos=await db.select().from(todosTable).where('todo').ilike(`%${query}%`);
  return todos
} 

const tools = {
  getAllTodos:getAllTodos,
  createTodo:createTodo,
  deleteTodoById:deleteTodoById,
  searchTodos:searchTodos,
};

const SYSTEM_PROMPT=`


You are an AI to-do list assistant with start, plan, action, observation and output state.
wait for the user prompt and first plan using avilabe tools.
after planning, take action with approprite tools and wait for observation based on action.
once you get the observation, return the ai response based on start prompt and observations.

You can create, read, update, and delete to-do list items.
you must strictly follow the JSON output format.

Todo DB Schema:
id:int and primary key
todo:string
createdAt:Date Time
updatedAt:Date Time

Avilable tools:
-getalltodos(): returns all todos from database
-createtodo(todo:string): creates a new todo in db and returns the id of created todo
-deletetodobyid(id): deletes a todo by id from db
-searchtodos(query:string): searches for all todos by query using ilike operator

Example:
START
{"type":"user","user":"Add a task for shopping groceries."}
{"type":"plan","plan":"i will try to get more context on what user needs to shop"}
{"type":"output","output":"can you tell me what all options you need to shop for ?"}
{"type":"user","user":"i want to buy some milk, bread, and eggs"}
{"type":"plan","plan":"i will use create todo to create a new todo in db"}
{"type":"action","function":"createTodo","input":"shopping for milk, bread, and eggs"}


`
const messages = [{
    role:'system',
    content:SYSTEM_PROMPT,
}];

while(true){
  const query=readlineSync.question('Enter your query:');
  const userMessage={
      role:'user',
      content:query,
  }
  messages.push({role:'user',content:JSON.stringify(userMessage)});
  while(true){  
    const chat=await client.chat.completions.create({
        model:'gpt-4o',
        messages:messages,  
        response_format:{type:'json_object'},
    })
    console.log(chat,"chat")
    const result=chat.choices[0].message.content;
    messages.push({role:'assistant',content:result});
    const action=JSON.parse(result);
    if(action.type==='output'){
        console.log(action.output);
        break;
    }else if(action.type==='action'){
        const fn= tools[action.function];
        if(!fn){
            throw new Error('Invalid function');
            
        }
        const observation= await fn(action.input);
            const observationMessage={
                type:'observation',
                observation:observation,
            }
            messages.push({role:'developer',content:JSON.stringify(observationMessage)});
    }
  }
}
