
import express, { response } from 
'express';
import productRoutes from './route/productRoutes.js'
import userRoutes from './route/userRoutes.js'
import mongoose from 'mongoose'
import cors from 'cors'
import orderRoutes from './route/orderRoutes.js'
import fileUpload from 'express-fileupload';
const port = 5000;
const app =  express();


mongoose.connect('mongodb+srv://thapamahendra671:user500@cluster0.ogg10ts.mongodb.net/Shops').then((val)=>{
  // console.log(val);
  app.listen(port, ()=>{
    console.log('server live');
  });
}).catch((err)=>{  
  console.log(err)
})

app.use(cors());
app.use(express.json());
app.use('./uploads', express.static('uploads'));

app.use(fileUpload({
  limits: {fileSize: 5 * 1024 * 1024},
  abortOnLimit: true
}))
app.get('/' , (req, res)=>{
   return res.status(200).json({
    msg: 'Welcome to my server'
   })
})

app.use('/products', productRoutes)
app.use('/users', userRoutes)
app.use('/orders', orderRoutes)

app.use('/uploads', express.static('uploads'))
app.use((req, res)=>{
  return res.status(404).json({
    status: 'error',
    message: 'not found'
  });
})


