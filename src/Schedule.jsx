import { useState, useEffect } from "react";
import "./Schedule.css";
import { Link } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MyCalendar({list}){
    const [value,onChange]=useState(new Date());

    return(
        <div>
            <Calendar onChange={onChange} 
                     value={value}
                     tileContent={({date,view})=>{
                        if(view==="month"){
                            const hasSchedule=list.some(item=>
                                new Date(item.date).toDateString()===date.toDateString());
                                return hasSchedule ? <div className="dot"></div> : null;
                        }
                     }} />
        </div>
    );
}

export default function Schedule() {
    const [list, setList] = useState([]);
    const [done,setDoneList]=useState([]);

    // 데이터 불러오기
    useEffect(() => {
        fetch("http://localhost:3002/list")
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                );
                setList(sorted);
            });

        fetch("http://localhost:3002/done")
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                );
                setDoneList(sorted);
            });
    }, []);

    // 복구 함수
    const handleChangeCheck = async (item) => {
        try {
            // list에서 삭제
            const delRes = await fetch(`http://localhost:3002/list/${item.id}`, {
                method: "DELETE",
            });

            if (!delRes.ok) return;

            setList(prev => prev.filter(el => el.id !== item.id));

            // done에 추가
            const postRes = await fetch(`http://localhost:3002/done`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...item,completed: true,})
            });

            const newItem = await postRes.json();
            setDoneList(prev =>
                [...prev, newItem].sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                )
            );

        } catch (err) {
            console.error(err);
        }
    };

    // 복구 함수
    const handleUncheck = async (item) => {
        try {
            // done에서 삭제
            const delRes = await fetch(`http://localhost:3002/done/${item.id}`, {
                method: "DELETE",
            });

            if (!delRes.ok) return;

            // done state에서 제거
            setDoneList(prev => prev.filter(el=>el.id!==item.id));

            // list에 추가
            const postRes = await fetch(`http://localhost:3002/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...item,completed:false,}),
            });

            const newItem = await postRes.json();
            setList(prev =>
                [...prev, newItem].sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    // 삭제하는 함수
    const handleDelete= async(item)=>{
        try{
            const deleteRes=await fetch(`http://localhost:3002/list/${item.id}`, {
                method: "DELETE",
            });
            if(!deleteRes) return;
            setList(prev=>prev.filter(el=>el.id!==item.id));
        }catch(error){
            console.log(error);
        }
    };


    return (
        <div className="list">
            <MyCalendar list={list} />
            <ul>
                {list.map((item) => (
                    <li key={item.id} className={item.completed ? "done" : ""}>
                        <input 
                            type="checkbox"
                            checked={false} 
                            // item 객체 전체를 전달하여 처리
                            onChange={() => handleChangeCheck(item)} 
                        />
                        <div className="list_content">
                            <h2 className="list_title">{item.title}</h2>
                            <p className="list_date">{item.date}</p>
                        </div>
                        <button className="delete_btn" 
                            onClick={()=>{handleDelete(item)}}>🗑️</button>

                    </li>
                ))}
            </ul>
            <ul>
                {done.map((item)=>(
                    <li key={item.id} className={item.completed?"done":""}>
                        <input type="checkbox"
                            checked={true}
                            onChange={()=>handleUncheck(item)}
                        />
                        <div className="list_content">
                            <h2 className="list_title">{item.title}</h2>
                            <p className="list_date">{item.date}</p>
                        </div>
                    </li>
                    ))}
            </ul>
            <Link to="/add" className="add_btn">➕</Link>
        </div>
    );
}
