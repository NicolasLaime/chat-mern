import jwt from 'jsonwebtoken'
import User from '../models/userModels.js'


 const isLogin = (req,res,next) => {
    try {
        const token = req.cookies.jwt
        if(!token) return res.status(500).send({success: false, message: 'Usuario no autorizado'})
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        if(!decode) return res.status(500).send({success:false, message:'Usuario No autorizado-token invalido'});
        const user = User.findById(decode.userId).select('-password');
        if(!user) return res.status(500).send({success:false, message:'Usuario no encontrado'})
        req.user = user,
        next()
    } catch (error) {
        console.log(`error en islogin middlawae ${error.message}`)
        res.status(500).send({success:false, message:error})
    }
}


export default isLogin