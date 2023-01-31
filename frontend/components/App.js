import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { axiosWithAuth } from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { 
    navigate('/');
  }
  const redirectToArticles = () => { 
    navigate('/articles');
  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if (localStorage.getItem('token')) {
      localStorage.setItem('token', '');
    }
    setMessage("Goodbye!");
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!

    setSpinnerOn(true);
    setMessage('');
    axios.post(loginUrl, { "username": username, "password": password })
      .then(res => {
        // console.log(res.data);
        localStorage.setItem('token', res.data.token);
        setMessage(res.data.message);
        redirectToArticles();
        setSpinnerOn(false);
      })
      .catch(err => {
        console.log(err);
        setMessage(err.message)
      })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!

    setSpinnerOn(true);
    setMessage('');
    axiosWithAuth().get(articlesUrl)
    .then(res => {
      console.log(res.data);
      setArticles(res.data.articles);
      setMessage(res.data.message);
      redirectToArticles();
      setSpinnerOn(false);
    })
    .catch(err => {
      console.log(err);
      // setMessage(err.response)
    })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true);
    setMessage('');
    axiosWithAuth().post(articlesUrl, article)
    .then(res => {
      // console.log(res.data);
      setArticles([...articles, article])
      setMessage(res.data.message);
      redirectToArticles();
      setSpinnerOn(false);
    })
    .catch(err => {
      console.log(err);
      // setMessage(err.response)
    })
  }

  const updateArticle = ({ article_id, title, text, topic }) => {
    // ✨ implement
    // You got this!
    setSpinnerOn(true);
    setMessage('');
    axiosWithAuth().put(`${articlesUrl}/${article_id}`, { "title": title, "text": text, "topic": topic })
    .then(res => {
      console.log(res.data);
      setArticles(articles.map(a => {
        if (a.article_id === article_id) {
          return ({ article_id, title, text, topic });
        }
        else 
          return a;
      }))
      setMessage(res.data.message);
      redirectToArticles();
      setSpinnerOn(false);
    })
    .catch(err => {
      console.log(err);
      // setMessage(err.response)
    })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setSpinnerOn(true);
    setMessage('');
    axiosWithAuth().delete(`${articlesUrl}/${article_id}`)
    .then(res => {
      console.log(res.data);
      setMessage(res.data.message);
      setArticles(articles.filter(a => (a.article_id !== article_id)));
      redirectToArticles();
      setSpinnerOn(false);
    })
    .catch(err => {
      console.log(err);
      // setMessage(err.response)
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm  login={login} />} />
          <Route path="/articles" element={
            <>
              <ArticleForm postArticle={postArticle} 
              updateArticle={updateArticle} 
              setCurrentArticleId={setCurrentArticleId} 
              currentArticle={articles.find(a => a.article_id === currentArticleId)} />
              <Articles articles={articles} 
              getArticles={getArticles} 
              deleteArticle={deleteArticle} 
              setCurrentArticleId={setCurrentArticleId} 
              currentArticleId={currentArticleId}
               />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
