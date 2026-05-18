import { useState,useEffect } from "react";
import "./Add.css"
import { useNavigate } from "react-router-dom";

export default function Add({list,setList}){
    const [title,setTitle]=useState('');
    const [content,setContent]=useState('');
    const [date,setDate]=useState('');
    const navigate=useNavigate();
    const today=new Date().toISOString().split('T')[0];

    const Input1=(e)=>{
        setTitle(e.target.value);
    };

    const Input2=(e)=>{
        setContent(e.target.value);
    };

    const Input3=(e)=>{
        setDate(e.target.value);
    }

    const Button=()=>{
        if(title.trim()==="" || content.trim()==="") {alert("뭐라도 입력해라"); return;}
        
    const newItem = {
        title: title,
        content: content,
        date: date,
        completed: false
    };

        fetch("http://localhost:3002/list", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(newItem),
        }).then((res)=>{
            if(res.ok){
                setTitle(""); setContent(""); setDate("");
                navigate('/schedule');
            }else{
                alert("저장 실패!");
            }
        });
    };

    return(
        <>
            <div className="input_box">
                <textarea
                    value={title} onChange={Input1} placeholder="제목을 입력하세요" className="title"/>
                <textarea type="text" value={content} onChange={Input2} placeholder="내용을 입력하세요" className="content"/>
                <input type="date" value={date} min={today} onChange={Input3} placeholder="due date를 입력하세요" className="date"/>
                <button onClick={Button}>Add</button>
            </div>
        </>
    )
}