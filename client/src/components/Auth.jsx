import {useState} from 'react'; 
import {API} from '../utils/api';
export default function Auth({onLogin}){
    const [mode,setMode]=useState('login'),[f,setF]=useState({name:'',email:'admin@example.com',password:'admin123',phone:''}),[err,setErr]=useState('');
    const submit=async e=>{
        e.preventDefault();
        try{
            const path=mode==='login'?'/auth/login':'/auth/register';
            const r=await fetch(API+path,{
                method:'POST',headers:{'Content-Type':'application/json'},
                body:JSON.stringify(f)}
            );
            const d=await r.json();if(!r.ok)throw new Error(d.message);
            if(mode==='register'){setMode('login');
                setErr('Registration successful. Please login.')}
            else onLogin(d.token,d.user)}catch(e){setErr(e.message)}};
            return <div className="auth">
                <div className="auth-card">
                    <div className="logo">♻</div>
                    <h1>EcoTrack</h1>
                    <p>Smart waste collection management</p>
                    <div className="tabs">
                        <button type="button" className={mode==='login'?'tabon':''} onClick={()=>setMode('login')}>Login</button>
                        <button type="button" className={mode==='register'?'tabon':''} onClick={()=>setMode('register')}>Register</button>
                    </div>
                    <form onSubmit={submit}>
                        {mode==='register'&&<><input placeholder="Full name" required onChange={e=>setF({...f,name:e.target.value})}/>
                        <input placeholder="Phone" onChange={e=>setF({...f,phone:e.target.value})}/></>}
                        <input placeholder="Email" value={f.email} required onChange={e=>setF({...f,email:e.target.value})}/>
                        <input type="password" placeholder="Password" value={f.password} required onChange={e=>setF({...f,password:e.target.value})}/>
                        <button className="primary">{mode==='login'?'Login':'Create Account'}</button>
                        </form><small>{err}</small>
               
                        </div>
                        </div>
                        }
