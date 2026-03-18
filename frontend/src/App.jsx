
import React, {useEffect, useState} from "react";
import axios from "axios";

export default function App(){
  const [query,setQuery] = useState("");
  const [result,setResult] = useState(null);
  const [history,setHistory] = useState([]);
  const [loading,setLoading] = useState(false);

  const API = "http://localhost:5000";

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
    <div style={{border:"1px solid #ddd", padding:15, margin:10}}>
      <b>Venue:</b> {data.venue_name}<br/>
      <b>Location:</b> {data.location}<br/>
      <b>Cost:</b> {data.estimated_cost}<br/>
      <b>Why:</b> {data.why_it_fits}
    </div>
  );

  return (
    <div style={{padding:20}}>
      <h2>AI Event Concierge</h2>

      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Describe event..." style={{width:"60%"}}/>
      <button onClick={submit}>Generate</button>

      {loading && <p>⏳ AI is planning...</p>}

      <h3>Result</h3>
      {result && <Card data={result}/>}

      <h3>History</h3>
      {history.map((item,i)=>(
        <div key={i}>
          <div><b>Query:</b> {item.query}</div>
          <Card data={item.response}/>
        </div>
      ))}
    </div>
  );
}
