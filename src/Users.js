import React from 'react'
import { useParams } from 'react-router-dom'
import { user_Data } from './UsersData'
import { Col, Row,Card } from 'reactstrap'
import { Button, Rating, Stack } from '@mui/material'

const Users = () => {
    const {currentscreen} =useParams()
    const show_Data = user_Data.find(user => user.id == currentscreen)
    console.log("currentscreen...",currentscreen)
  return (
    <div>
       <Card className='p-3 border-0'>
        <Row>
          <Col md={4}>
          <img className='fs-5 fw-bold w-100'  src={show_Data.image}/>
          </Col>
          <Col md={8}>
         <div className='mt-5'>
          <div>
          <h1>{show_Data.title}</h1>
          <p>{show_Data.description}</p>
          <h4>₹{show_Data.price}</h4>
          </div>
         </div>
         <div className='d-flex '>
          <Button variant="contained" size='sm' color="secondary">Order</Button>
    
        <Stack spacing={1} className='ms-3'>

          <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
        </Stack>
         </div>
          </Col>
        </Row>
       </Card>
    </div>
  )
}

export default Users