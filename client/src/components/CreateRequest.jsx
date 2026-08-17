import {useState} from 'react'; 
export default function CreateRequest({onSubmit}){
    const[f,setF]=useState({wasteType:'Plastic',quantity:'',address:'',pickupDate:''});
    return <section className="panel">
        <h2>Create Waste Request</h2>
        <form className="formgrid" onSubmit={e=>{e.preventDefault();onSubmit(f)}}>
            <label>Waste Type<select value={f.wasteType} onChange={e=>setF({...f,wasteType:e.target.value})}>{['Plastic','Organic','Paper','Glass','Metal','Electronic','Other'].map(x=><option key={x}>{x}</option>)}
            </select></label>
            <label>Quantity<input required placeholder="e.g. 5 kg" onChange={e=>setF({...f,quantity:e.target.value})}/></label>
            <label className="wide">Pickup Address<textarea required onChange={e=>setF({...f,address:e.target.value})}/></label>
            <label>Preferred Date<input type="date" required onChange={e=>setF({...f,pickupDate:e.target.value})}/></label>
            <button className="primary">Submit Request</button>
            </form>
        </section>}
