import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    fullname:{
        type: String,
        required:true
    },
    username:{
        type: String,
        required:true,
        unique:true
    },
    email:{
        type: String,
        required:true,
        unique:true

    },
    genero:{
        type:String,
        required: true,
        enum:['femenino', 'masculino']
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    profileepic:{
          type:String,
          required:true,
          default:''
    }
},{timesstamp:true});


const User = mongoose.model('User', userSchema)

export default User