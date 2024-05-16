import express from 'express';
import { userLogin, userRegester, userUpdate } from '../controllers/userControllers.js';
import joi from 'joi';
import validator from 'express-joi-validation';
import { checkUser } from '../middleware/checkUser.js';
const validate = validator.createValidator({});

const loginSchema = joi.object({
email: joi.string().email().required(),
password: joi.string().required()
})
const registerSchema = joi.object({
email: joi.string().email().required(),
password: joi.string().required(),
fullname: joi.string().min(5).max(20).required()
})

const router = express.Router();

const handleMAll = (req, res)=>{
  res.status(405).json({
    status: 'error',
    message: 'method not found'
  })
}

router.route('/login').post(validate.body(loginSchema), userLogin).all(handleMAll);

router.route('/register').post( validate.body(registerSchema),userRegester).all(handleMAll);

router.route('/update').patch(checkUser, userUpdate)

export default router;

