import React, { useEffect } from 'react'
import axios from 'axios'
import { user_Data } from '../UsersData'
import { Card } from 'reactstrap'
import { Link } from 'react-router-dom'
import AppBar_Nav from './AppBar'

const Home = () => {
    const {currentscreen} = user_Data
  return (
    <>
     <AppBar_Nav/>
    <div className='d-flex  flex-wrap gap-3 p-3'>
        {user_Data.map((person,i)=>{
          const {id} = person
          return (
            <>
           
            <Card className= ' border border-primary border-2  h-100 p-2 shadow'>
            <Link to={`/home/${id}`} key={i} className='text-decoration-none text-dark'>

            <img className='fs-5 fw-bold' style={{height:'10rem',width:'12rem'}} src={person.image}/>
            
            </Link>
            </Card>
           
            </>
          )
        })}
        <h1>Git Commitmmdmdmmdm</h1>
    </div>
    </>
  )
}

export default Home