
import React, {useEffect, useState} from "react";
import axios from "axios";
import "./App.css";

export default function App(){
  const [query,setQuery] = useState("");
  const [result,setResult] = useState(null);
  const [history,setHistory] = useState([]);
  const [loading,setLoading] = useState(false);

  const API = "https://ai-event-concierge-pro.onrender.com";

  const fetchHistory = async ()=>{
    const res = await axios.get(API+"/api/history");
    setHistory(res.data);
  };

  useEffect(()=>{ fetchHistory(); },[]);

  const submit = async ()=>{
    if(!query) return;
    setLoading(true);
    const res = await axios.post(API+"/api/generate",{query});
    setResult(res.data);
    setLoading(false);
    fetchHistory();
  };

  const Card = ({data})=>(
    <div className="card">
      <div><b>Venue:</b> {data.venue_name}</div>
      <div><b>Location:</b> {data.location}</div>
      <div><b>Cost:</b> {data.estimated_cost}</div>
      <div><b>Why:</b> {data.why_it_fits}</div>
    </div>
  );

  return (
    <div className="app-container">
      <h2>AI Event Concierge</h2>

      <div className="search-box">
        <input 
          value={query} 
          onChange={e=>setQuery(e.target.value)} 
          placeholder="Describe your dream event..." 
        />
        <button onClick={submit}>Generate</button>
      </div>

      {loading && <p className="loading">⏳ AI is crafting your experience...</p>}

      {result && (
        <>
          <h3>Latest Match</h3>
          <Card data={result}/>
        </>
      )}

      {history.length > 0 && <h3>Previous Ideas</h3>}
      {history.map((item,i)=>(
        <div key={i} className="history-item">
          <div className="history-query"><b>Query:</b> {item.query}</div>
          <Card data={item.response}/>
        </div>
      ))}
    </div>
  );
}
