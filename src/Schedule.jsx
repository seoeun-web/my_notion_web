import { useState, useEffect } from "react";
import "./Schedule.css";
import { Link } from "react-router-dom";

export default function Schedule() {
    const [list, setList] = useState([]);
    const [done,setDoneList]=useState([]);

    // 데이터 불러오기
    useEffect(() => {
        fetch("http://localhost:3002/list")
            .then(res => res.json())
            .then(data => setList(data));

        fetch("http://localhost:3002/done")
                .then(res => res.json())
                .then(data => setDoneList(data));
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

            setDoneList(prev => [...prev, newItem]);

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

            setDoneList(prev => prev.filter(el => el.id !== item.id));

            // list에 추가
            const postRes = await fetch(`http://localhost:3002/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...item,completed:false,}),
            });

            const newItem = await postRes.json();

            setList(prev => [...prev, newItem]);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="list">
            <ul>
                {list.map((item) => (
                    <li key={item.id} className={item.completed ? "done" : ""}>
                        <input 
                            type="checkbox"
                            checked={false} 
                            // item 객체 전체를 전달하여 처리
                            onChange={() => handleChangeCheck(item)} 
                        />
                        <h4 className="list_title">{item.title}</h4>
                        <p className="list_date">{item.date}</p>
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
                        <h4 className="list_title">{item.title}</h4>
                        <p className="list_date">{item.date}</p>
                    </li>
                    ))}
            </ul>
            <Link to="/add" className="add_btn">➕</Link>
        </div>
    );
}
