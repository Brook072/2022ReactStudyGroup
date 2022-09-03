import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import useAuth from './authContext';
import axios from "axios"

export default function ToDoList(){
    const navigate = useNavigate()
    const { token } = useAuth()
    const [ newtodo, setNewtodo ] = useState(null)
    const [ todolist, setTodolist ] = useState(null)
    const [ todoNum, setTodoNum ] = useState(0)
    const [ currentTab, setCurrentTab] = useState('all')
    const [ loading, setLoading ] = useState(true)
    const newTodoInput = useRef();
    const signOut = e => {
      e.preventDefault();
      axios({
        headers:{
          'Content-Type': 'application/json', 
          'authorization' : token
        },
        method: 'delete',
        url:"https://todoo.5xcamp.us/users/sign_out",
        })
      .then((res) => {
        console.log(res)
        if(res.status === 200){
          alert('登出成功！') 
        }
      })
      .then(()=>{
        navigate('/');
      })
      .catch((err) => {
        if(err.response.status===401){
          alert(err.response.data.error);
        }
      })
    }
    const ListGet = async (type) => {
      setLoading(true);
      try{
        const res = await axios({
          headers:{
            'Content-Type': 'application/json',
            'authorization' : token
          },
          method: 'get',
          url:"https://todoo.5xcamp.us/todos",
        })
        setTodolist(res.data.todos)
        setTodoNum(res.data.todos.length)
        if(type==='incomplete'){
          setTodolist(res.data.todos.filter((item) => item.completed_at === null))
          setTodoNum(res.data.todos.filter((item) => item.completed_at === null).length)
        }
        if(type==='complete'){
          setTodolist(res.data.todos.filter((item) => item.completed_at != null))
          setTodoNum(res.data.todos.filter((item) => item.completed_at != null).length)
        }
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }
    
    const todoAdd = (e) => {
      e.preventDefault();
      const content = newtodo;
      axios({
        headers:{
          'Content-Type': 'application/json',
          'authorization' : token
        },
        method: 'post',
        url:"https://todoo.5xcamp.us/todos",
        data:{
          'todo':{
            'content':content
          }
        }
        })
      .then(() => {
        newTodoInput.current.value= '';
        ListGet();
      })
      .catch((err) => {
        console.log('err', err)
      })
    }
  
    const todoDelete = id => e => {
      e.preventDefault();
      axios({
        headers:{
          'Content-Type': 'application/json',
          'authorization' : token
        },
        method: 'delete',
        url:`https://todoo.5xcamp.us/todos/${id}`,
        })
      .then((res) => {
        console.log(res.data)
      }).then(() => {
        ListGet();
      })
      .catch((err) => {
        console.log('err', err)
      })
    }
  
    const todoToggle = id => e => {
      e.preventDefault();
      axios({
        headers:{
          'Content-Type': 'application/json',
          'authorization' : token
        },
        method: 'patch',
        url:`https://todoo.5xcamp.us/todos/${id}/toggle`,
        })
      .then(() => {
        ListGet();
      })
      .catch((err) => {
        console.log('err', err)
      })
    }
  
    const tabSwitch = type => e => {
      e.preventDefault();
      setCurrentTab(type);
      ListGet(type);
    }
  
    const completeListDelete = async (e) =>{
      e.preventDefault();
      try{
        const res = await axios({
          headers:{
            'Content-Type': 'application/json',
            'authorization' : token
          },
          method: 'get',
          url:"https://todoo.5xcamp.us/todos",
        })
        let completeList = res.data.todos.filter((item) => item.completed_at != null)
        completeList.forEach((e)=>{
          axios({
            headers:{
              'Content-Type': 'application/json',
              'authorization' : token
            },
            method: 'delete',
            url:`https://todoo.5xcamp.us/todos/${e.id}`,
            })
          .then(() => {
            ListGet();
          })
        })
      } catch (err) {
        console.log(err)
      }
    }
    
    useEffect(() => {
      ListGet()
    }, [])
    return (
      <div id="todoListPage" className="bg-half">
          <nav>
              <h1><Link to='/'>ONLINE TODO LIST</Link></h1>
              <ul>
                  <li className="todo_sm"><span>王小明的代辦</span></li>
                  <li><a href="/" onClick={signOut}>登出</a></li>
              </ul>
          </nav>
          <div className="container todoListPage vhContainer">
              <div className="todoList_Content">
                  <div className="inputBox">
                      <input type="text" ref={newTodoInput} placeholder="請輸入待辦事項" onChange={(e)=>{setNewtodo(e.target.value);}}/>
                      <a href="/" onClick={todoAdd}>
                          <i className="fa fa-plus"></i>
                      </a>
                  </div>
                  <div className="todoList_list">
                      <ul className="todoList_tab">
                          <li><a href="/" className={(currentTab === "all" ? "active": "")} onClick={tabSwitch('all')}>全部</a></li>
                          <li><a href="/" className={(currentTab === "incomplete" ? "active": "")} onClick={tabSwitch('incomplete')}>待完成</a></li>
                          <li><a href="/" className={(currentTab === "complete" ? "active": "")} onClick={tabSwitch('complete')}>已完成</a></li>
                      </ul>
                      {currentTab === 'all' && todoNum === 0 && <h2 className='noTodoText'>目前尚無待辦事項</h2>}
                      {currentTab === 'incomplete' && todoNum === 0 && <h2 className='noTodoText'>目前無未完成待辦事項</h2>}
                      {currentTab === 'complete' && todoNum === 0 && <h2 className='noTodoText'>目前無已完成待辦事項</h2>}
                      {todoNum!== 0 && <div className="todoList_items">
                          <ul className="todoList_item">
                              {!loading && (
                                todolist.map((e)=>{
                                  return (
                                    <li key={e.id}>
                                      <label className="todoList_label">
                                          <input className="todoList_input" type="checkbox" value="true" checked={e.completed_at != null} onChange={todoToggle(e.id)}/>
                                          <span>{e.content}</span>
                                      </label>
                                      <a href="/" onClick={todoDelete(e.id)}>
                                          <i className="fa fa-times"></i>
                                      </a>
                                    </li>
                                  )
                                })
                              )}
                              {/* 
                              把冰箱發霉的檸檬拿去丟
                              打電話叫媽媽匯款給我
                              整理電腦資料夾
                              繳電費水費瓦斯費
                              約vicky禮拜三泡溫泉
                              約ada禮拜四吃晚餐
                              */}
                          </ul>
                          <div className="todoList_statistics">
                          {currentTab==='all' && <p> {todoNum} 個待辦事項</p>}
                          {currentTab==='incomplete' && <p> {todoNum} 個未完成事項</p>}
                          {currentTab==='complete' && <p> {todoNum} 個已完成事項</p>}
                              <a href="/" onClick={completeListDelete}>清除已完成項目</a>
                          </div>
                      </div>}
                  </div>
              </div>
          </div>
      </div>
    )
  }