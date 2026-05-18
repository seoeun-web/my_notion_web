import { useEffect } from 'react';
import {useState} from 'react';

export default function Reading(){
    const [books,setBooks]=useState([]);

    useEffect(()=>{
        fetch("http://localhost:3002/books")
        .then(res => res.json())
        .then(data => {
            const sorted = data.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
        setBooks(sorted);
        });
    },[]);

    const AddBook=async(read)=>{
        try{
            const bookList = await fetch(`http://localhost:3002/books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({read})
            });

            const newItem = await bookList.json();
            setBooks(prev =>
                [...prev, newItem].sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                ));
            } catch (err) {
            console.error(err);
        };
    }

    return(
        <div>
            <div className="header">
                <h1>My Reading Records📚</h1>
                <p>⭐️올해는 책 12권 이상 읽기!⭐️</p>
            </div>
            <div className="main">
                <h2>🍀Book List🍀</h2>
                <ul>
                    {books.map((item)=>(
                        <li key={item.id}>
                            {item.title}
                        </li>
                    ))}
                </ul>
                <button>✚</button>
            </div>
        </div>
    )
}