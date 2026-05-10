import { useState } from "react";

import Header from './Header';
import Add from './Add';
import Schedule from "./Schedule";

import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import "./App.css";

function Home(){
  return(
    <>
      <div></div>
    </>
  );
}

function App() {

  const [list, setList] = useState([]);

  return (
    <BrowserRouter>

      <div className="App">

        <Header/>

        <nav>
          <Link to="/">🏠</Link>
          <Link to="/schedule">📆</Link>
        </nav>

        <Routes>

          <Route
            path='/'
            element={<Home/>}
          />

          <Route
            path='/schedule'
            element={<Schedule list={list} />}
          />

          <Route
            path='/add'
            element={
              <Add
                list={list}
                setList={setList}
              />
            }
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;