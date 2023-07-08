// import dependencies
import React, { useContext, useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthContext, { AuthContextProvider } from "./context/AuthProvider";

// import pages
import "./App.css";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {

  return(
    <AuthContextProvider>
      <AppRoutes />
    </AuthContextProvider>
  )

}

function AppRoutes (){

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    setIsAuthenticated(authContext.isLoggedIn);
  }, [authContext.isLoggedIn]);

  return(
    <div className="App">
      <Router>
        <Routes>
          <Route
            path='/'
            element={
              isAuthenticated ? (
                <Homepage/>
              ) : (
                <Navigate to='/login' replace={true} />
              )
            }
          />
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register />}/>
        </Routes>
      </Router>
    </div>
  );
}


export default App;




/*
  const [currentForm, setCurrentForm] = useState("login");
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };
  return (<>
    <div className="background"></div>
    <div className="App">
      {currentForm === "login" ? (<Login onFormSwitch={toggleForm}/>) : (<Register onFormSwitch={toggleForm}/>)}
    </div>
  </>);
*/