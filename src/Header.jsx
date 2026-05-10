import {Link} from "react-router-dom";
import "./Header.css";

export default function Header(){
    return(
        <>
            <div className="header">
                <Link to='/'>
                    <h1 className="myApp">My Notion</h1>
                </Link>
            </div>
        </>
    )
}