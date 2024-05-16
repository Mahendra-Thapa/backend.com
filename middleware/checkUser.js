import jwt from 'jsonwebtoken'


export const checkUser = (req, res, next)=>{
   try {
    const token = req.headers.authorization;
    const decode = jwt.decode(token, 'tokenKey');
    // console.log(token)
    // console.log(decode)
  
   if (decode) {
    req.userId = decode.userId;
    req.isAdmin  = decode.isAdmin;
   
    next();
   } else {
    return res.status(401).json({status: 'error', message: 'you are not authorised'})
   }

   } catch (error) {
    return res.status(400).json({status: "error", message: `${error}`})
   }
}


export const checkAdmin = (req, res, next)=>{

  if (req.isAdmin) {
    next();
  }else{
    return res.status(400).json({status: "error", message: `you are not authorised`})
  }
}


// before wala 
// export const adminCheck = (req, res, next)=>{
//   const token = req.headers.authorization;
//    if (token) {
    
//    }else{
//     return res.status(401).json({
//       status: 'error',
//       message: 'you are not authorised'
//     });
//    }
//   next();
// }