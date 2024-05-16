import Order from "../Models/Order.js";
import mongoose from "mongoose";

export const getAllOrders = async (req, res) =>{

  try {
     const data = await Order.find({}).sort('-createdAt')
     return res.status(200).json({
      status: 'success',
      orders: data ,
      count
    })
  
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: `${error}`
    })
  }
}

//==================

export const getOrderByUser = async(req, res)=>{         
try {
  const data = await Order.find({user: req.userId});
  return res.status(200).json({
    status: 'success',
    orders: data ,
  })
} catch (error) {
  return res.status(400).json({
    status: 'error',
    message: `${error}`
  })
}
}


//GetOrderById for the view More page

export const getOrderById = async(req, res)=>{
    const {id}= req.params;
           
  try {
  if (mongoose.isValidObjectId(id)) {
    const data = await Order.findById(id);
    if(!data) return res.status(404).json({message: 'data not found'});
    return res.status(200).json({
      status: 'success',
     data: data
    })


  }else{
    return res.status(400).json({
      status: 'error',
      message: `Please provide valid id`
    })
  }

  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: `${error}`
    })
  }
}


export const addOrder= async(req, res)=>{
  const {
   totalAmount,
   orderItems
  } = req.body;

  try {
    const data = await Order.create({
      totalAmount,
      orderItems,
      user: req.userId
      
    });

    return res.status(200).json({
      status: 'success',
     message: "Order added successfully"
    })

  } catch (error) { 
    return res.status(400).json({
      status: 'error',
      message: `${error}`
    })
  }
}
