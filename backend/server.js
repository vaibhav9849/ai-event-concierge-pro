
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const Event = require("./models/Event");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("MongoDB Connected"))
  .catch(err=>console.error(err));

async function callLLM(query){
  const prompt = `Convert into strict JSON:
  ${query}
  Return:
  {
    "venue_name": "",
    "location": "",
    "estimated_cost": "",
    "why_it_fits": ""
  }`;

  const res = await axios.post("https://api.openai.com/v1/chat/completions", {
    model: "gpt-4o-mini",
    messages: [{role:"user", content: prompt}]
  },{
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });

  let content = res.data.choices[0].message.content;
  try { return JSON.parse(content); }
  catch { return { raw: content }; }
}

app.post("/api/generate", async (req,res)=>{
  const {query} = req.body;
  const result = await callLLM(query);

  const saved = await Event.create({query, response: result});
  res.json(saved.response);
});

app.get("/api/history", async (req,res)=>{
  const data = await Event.find().sort({createdAt:-1});
  res.json(data);
});

app.listen(process.env.PORT, ()=>console.log("Server running"));
