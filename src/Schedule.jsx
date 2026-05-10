import { useState, useEffect } from "react";
import "./Schedule.css";
import { Link } from "react-router-dom";

export default function Schedule() {
    const [list, setList] = useState([]); // 1. setList가 여기서 정의됨

    // 데이터 불러오기
    useEffect(() => {
        fetch("http://localhost:3001/list")
            .then(res => res.json())
            .then(data => setList(data));
    }, []);

    // 체크 상태 변경 및 서버 저장
    const handleChangeCheck = (item) => {
        // 서버에 PATCH 요청 (데이터 수정)
        fetch(`http://localhost:3001/list/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !item.completed }),
        })
        .then(res => {
            if (res.ok) {
                // 서버 저장 성공 시에만 화면의 State를 업데이트
                const updatedList = list.map(el => 
                    el.id === item.id ? { ...el, completed: !el.completed } : el
                );
                setList(updatedList);
            }
        })
        .catch(err => console.error("Update failed:", err));
    };

    return (
        <div className="list">
            <ul>
                {list.map((item) => (
                    <li key={item.id} className={item.completed ? "done" : ""}>
                        <input 
                            type="checkbox"
                            checked={item.completed || false} 
                            // 2. item 객체 전체를 전달하여 처리
                            onChange={() => handleChangeCheck(item)} 
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
