import User from "../models/userModels.js";
import bycriptjs from 'bcryptjs'
import jwtToken from "../utils/jwtwebToken.js";


export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, genero, password, profileepic } = req.body;

        // Verifica si el username o el email ya existen
        const existingUser = await User.findOne({ $or: [{ username }, { fullname }, { email }] });
        
        // Si ya existe el username, fullname o email
        if (existingUser) {
            let message = '';
            if (existingUser.username === username) {
                message = 'El nombre de usuario ya está en uso';
            } else if (existingUser.fullname === fullname) {
                message = 'El nombre completo ya está registrado';
            } else if (existingUser.email === email) {
                message = 'El correo electrónico ya está registrado';
            }
            return res.status(400).send({ success: false, message });
        }

        // Hash de la contraseña
        const hasPassword = bycriptjs.hashSync(password, 10);
        
        // Configura el avatar dependiendo del género
        const profileBoy = profileepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profileepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // Crea el nuevo usuario
        const newUser = new User({
            fullname,
            username,
            email,
            password: hasPassword,
            genero,
            profileepic: genero === 'masculino' ? profileBoy : profileGirl
        });

        // Guarda el nuevo usuario en la base de datos
        await newUser.save();

        // Genera el token JWT para el nuevo usuario
        jwtToken(newUser._id, res);

        // Responde con la información del usuario creado
        res.status(201).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profileepic: newUser.profileepic,
            email: newUser.email
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: error.message });
    }
};




export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca al usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ success: false, message: 'El email no existe, ¡regístrate!' });
        }

        // Verifica la contraseña
        const comparePass = bycriptjs.compareSync(password, user.password || "");
        if (!comparePass) {
            return res.status(401).send({ success: false, message: 'Email o contraseña incorrectos' });
        }

        // Genera el token y lo envía en la cookie
        jwtToken(user._id, res);

        // Responde con los datos del usuario
        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profileepic: user.profileepic,
            email: user.email,
            message: 'Inicio de sesión exitosamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error en el servidor' });
    }
};



export const userLogout = async(req,res) => {
   
    try {
        res.cookie('jwt','', {
            maxAge:0
        })
        res.status(200).send({message:'Cierre de sesión exitoso'})
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error en el servidor' });
    }
    




}
