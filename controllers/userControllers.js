import User from '../Models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



export const userLogin = async(req, res)=>{
  const {email,  password} = req.body
  try {

    //It is used for the filtering data
    const isExist = await User.findOne({email: email});

    if (isExist){
      const pass = bcrypt.compareSync(password, isExist.password);
      if(!pass) return res.status(401).json({
        status: 'error',
        data: 'Invalid credential'
      });

      const token = jwt.sign({
        userId: isExist._id,
        isAdmin: isExist.isAdmin
      }, 'tokenkey')

  
      return res.status(200).json({
          status: 'successfully login',
         data: {
          email,
          token,
         isAdmin: isExist.isAdmin,
         fullname: isExist.fullname,
         id: isExist._id,
         shippingAddress: isExist.shippingAddress
         }
          // obj: req.body
  
          //for filtering
          // obj: data
        });
    } 

    return res.status(401).json({
      status: 'error',
      message: 'user doesn\'t exist'
    });
    
  } catch (error) {
    return res.status(400).json({
        status: 'error',
        message: `${error}`,
      });
  }
}



export const userRegester = async (req, res)=>{
    const {email, fullname, password} = req.body
  try {

    //It is used for the filtering data
    const isExist = await User.findOne({email: email});

    if (isExist) return res.status(400).json({
      status: 'error',
      data: 'user alreduy exist'
    });
    const hash = bcrypt.hashSync(password, 10)

    await User.create({
     email,
     password: hash, 
     fullname
    });
    return res.status(200).json({
        status: 'succes',
        message: 'successfully user register',
        // obj: req.body

        //for filtering
        // obj: data
      });
  } catch (error) {
    return res.status(400).json({
        status: 'error',
        message: `${error}`,
      });
  }
}


//Provfile update 
export const userUpdate = async (req, res)=>{
    const {email, fullname, shippingAddress} = req.body
  try {

    //It is used for the filtering data
    const isExist = await User.findById(req.userId);

    if (isExist){
      isExist.fullname = fullname || isExist.fullname;
      isExist.email =  email || isExist.email;
      isExist.shippingAddress = shippingAddress || isExist.shippingAddress;
      await isExist.save();
      return res.status(200).json({
        status: 'success',
        message: 'successfully user updated'
      });

    } else {
      return res.status(400).json({
        status: 'error',
        data: 'user doesn\'t exist'
      });
    }
   
  } catch (error) {
    return res.status(400).json({
        status: 'error',
        message: `${error}`,
      });
  }
}

// it is without module use
// export const userRegester = (req, res)=>{
//   console.log(req.body)
// return res.status(200).json({
//   status: 'succes',
//   data: 'successfully logged in',
//   obj: req.body
// });

// }

// export const userLogin = (req, res)=>{
//   return res.status(200).json({
//     status: 'succes',
//     data: 'successfully logged in',
//     obj: req.body
//   });
//   }
  

