import './App.css';
import { useEffect, useState} from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import CircularProgress  from '@material-ui/core/CircularProgress';

import { getUser } from './redux/actions';

import Home from './components/home/Home'
import Nav from './components/Nav'
import StockContainer from './components/stock/StockContainer';
import Signup from './components/Signup'
import Signin from './components/Signin';
import PublicHome from './components/publicViews/PublicHome';


export const BASE_API = 'https://market-buddy-server.herokuapp.com'


function App() {
  const [signup, setSignup] = useState(true)
  const history = useHistory()
  
  //REDUX: Create dispatch to update user state, useSelector to retrieve user from the store
  //NOTE:  I passed the user down manually via props because many components will need it, so there will be no excessive "prop" drilling
  //       This is slightly easier than getting it from the store everytime.
  const dispatch = useDispatch() 
  const user = useSelector((state) => state.user)

  
  //Initial fetch user from API upon app mounting
  useEffect(() => {
    const token = localStorage.getItem("token")
    const profile = localStorage.getItem("profile")

    if(token) {
      const profileObj = JSON.parse(profile)
    

      axios({
        method: 'GET',
        url: `${BASE_API}/users/${profileObj._id}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(userObj => {
        dispatch(getUser(userObj.data))
      })
    }
  }, [dispatch])

  const signupHandler = (userInfo) => {
    dispatch(getUser("loading"))
    axios({
      url: `${BASE_API}/users/signup`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: userInfo
    })

    .then(data => {
      localStorage.setItem("token", data.data.token)
      localStorage.setItem("profile", JSON.stringify({...data.data.result}))
      dispatch(getUser(data.data.result))
      history.push('/home')
    })
    .catch((error) => {
      alert("Username already in use")
      dispatch(getUser(false))
    })
  }

  const signinHandler = (userInfo) => {
    axios({
      url: `${BASE_API}/users/signin`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: userInfo
    })

    .then(data => {
      localStorage.setItem("token", data.data.token)
      localStorage.setItem("profile", JSON.stringify({...data.data.result}))
      dispatch(getUser(data.data.result))
      history.push('/home')
    })
  }

  const logoutHandler = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("profile")
    dispatch(getUser(false))
    history.push('/signup')
  }

  const toggleHandler = (set) => {
    setSignup(set)
  }

  //Don't render until the user has been retrieved. Once we have the user, render two routes- home page and stock show page
  if (!user) 
    return (
    <>
    <div className="App">
      <Nav />
      <Switch>
      <Route exact path="/home"><PublicHome /></Route>
      <Route path="/stocks" render={() => <StockContainer user={user}/>}/>
      <div className="signin-page">
        {signup ?
        <div>
          <Route exact path="/signup" render={() => <Signup toggle={toggleHandler} signupHandler={signupHandler}/>}/>
        </div>
        :
        <div>
          <Route exact path="/signup" render={() => <Signin toggle={toggleHandler} signinHandler={signinHandler}/>}/>
        </div>
        }
        <img src="https://images.cartoonstock.com/previews/CC22230_preview.jpg" alt=""/>
      </div>
      </Switch>
      </div>
    </>
    )

  if (user === "loading"){
    return(
      <div>
        <CircularProgress />
        <p>Signing in...</p>
      </div>
    )
  }
  return (
    <div className="App">
        <Nav user={user} logoutHandler={logoutHandler}/>
      <Switch>
        <Route path="/home" render={() => <Home user={user}/>}/>
        <Route path="/stocks" render={() => <StockContainer user={user}/>}/>
      </Switch>
    </div>
  );
}

export default App;
