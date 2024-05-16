// import axios from "axios";

import Product from "../Models/Product.js";
import mongoose from "mongoose";
import fs from 'fs'

export const getTopProducts = (req, res, next) =>{
  req.query = {rating: {$gt: 4}};
  req.query.limit = 5;
  next();
}


export const getAllProducts = async(req, res)=>{
const queryObj = { ...req.query };
const excludeFields = ['sort', 'page', 'fields', 'search', 'limit'];
excludeFields.forEach((val)=> delete queryObj[val])
// console.log(queryObj);

  try {
    
    if(req.query.search){
      queryObj.product_name = req.query.search;
    }
  

    let query = Product.find(queryObj);
    // const data = await Product.find({});

    //it is used for just test
    // const dat = 'price , rating';
    // console.log(dat.split(',').join(''))

    if (req.query.fields) {
      const selectFields = req.query.fields.split(',').join('');
      query = query.select(selectFields);
    }

    if (req.query.sort) {
      const sorts = req.query.sort.split(',').join('');
      query = query.sort(-sorts);
    }

    //for prentation
    const page =  req.query.page || 1;
    const limit = req.query.limit || 10;
     
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit)

    const data = await query;

    const count = await Product.countDocuments(query);
    return res.status(200).json({
      status: 'success',
      products: data ,
      count
    })
    //before use the modle
    // const response =  await axios.get('https://dummyjson.com/products');
    // return res.status(200).json(response.data)
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: `${error}`
    })
  }
}

//GeProductById for the view More page

export const getProductById = async(req, res)=>{
    const {id}= req.params;
           
  try {
  if (mongoose.isValidObjectId(id)) {
    const data = await Product.findById(id);
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


export const addProduct = async(req, res)=>{
  const {
    product_name,
    product_detail,
    product_price,
    brand,
    category,
    countInStock
  } = req.body;

  try {
    const data = await Product.create({
      product_name,
      product_detail,
      brand,
      category, 
      countInStock,
      product_price,
      product_image: req.imagePath
      
    });

    return res.status(200).json({
      status: 'success',
     message: "product added successfully"
    })

  } catch (error) {
      if(error.code != 11000){
        fs.unlink(`${req.imagePath}`, (err)=> console.log(err))
      }
    return res.status(400).json({
      status: 'error',
      message: `${error}`
    })
  }
}

//============

export const updateProduct = async(req, res)=>{
  const {id} = req.params;

  const {
    product_name,
    product_detail,
    product_price,
    brand,
    category,
    countInStock
  } = req.body;
``
  try {

    if (req.imagePath) {
      const data = await Product.findByIdAndUpdate(id, { 
        product_name,
        product_detail,
        brand,
        category, 
        countInStock,
        product_price,
        product_image: req.imagePath
      });
      return res.status(200).json({
        status: 'success',
       message: "product added successfully"
      });
    }else{
      const data = await Product.findByIdAndUpdate(id, { 
        product_name,
        product_detail,
        brand,
        category, 
        countInStock,
        product_price,
      });
      return res.status(200).json({
        status: 'success',
       message: "product added successfully"
      }) 
    }
    

  } catch (error) {
      if(error.code != 11000){
        fs.unlink(`${req.imagePath}`, (err)=> console.log(err))
      }
    return res.status(400).json({
      status: 'error',
      message: `${error}`
    })
  }
}

//for delete the product

export const removeProduct = async(req, res)=>{
  const {id} = req.params;

  try {
    const exist = await Product.findById(id);
    if (!exist) return res.status(400).json({message: `product not found`})
    fs.unlink(`${exist.product_image}`, (err)=> console.log(err))
    await exist.deleteOne();

    return res.status(200).json({
      status: 'success',
     message: "product removed successfully"
    })

  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: `${error}`
    })
  }
}



//====
export const addReview = async(req, res)=>{
  const {id} = req.params;
  const {comment, rating, username} = req.body;

  try {
   const isExist = await Product.findById(id);
   if (isExist) {
    const isReviewExist = isExist.reviews.find((review) => review.user.toString() == req.userId);

    if(isReviewExist) return  res.status(400).json({message: `You alredy reviewed it` });

    isExist.reviews.push({comment, rating, username, user: req.userId});
    isExist.rating = isExist.reviews.reduce((a, b)=> a + b.rating , 0)/ isExist.reviews.length;
    isExist.numReviews = isExist.reviews.length;
     await isExist.save();
     res.status(200).json({
      status: 'response',
      message: `review added successfully`
     });
   } else {
    res.status(404).json({
      status: 'error',
      message: `product not found`
    })
   }
  } catch (error) {
   res.status(400).json({
      status: 'error',
      message: `${error}`
    })
  }
}