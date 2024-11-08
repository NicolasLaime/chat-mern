import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const navigate = useNavigate()
    const {setAuthUser} = useAuth()
    
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({});

    // Maneja los cambios en los inputs de texto
    const handleInput = (e) => {
        setInputData({
            ...inputData,
            [e.target.id]: e.target.value,
        });
    };

    // Maneja la selección del género
    const selectGenero = (selectGenero) => {
        setInputData((prev) => ({
            ...prev,
            genero: selectGenero === inputData.genero ? '' : selectGenero,
        }));
    };

    // Maneja el envío del formulario
    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        if(inputData.password !== inputData.confpassword.toLowerCase()){
            setLoading(false)
            return toast.error('Confirmacion de contraseña incorrecta')
        }
        try {
           const register = await axios.post('/api/auth/register', inputData);
           const data = register.data;
           if(data.success === false){
            setLoading(false)
            toast.error(data.message)
            console.log(data.message)


           }

           toast.success(data?.messsage)
           localStorage.setItem('chatapp', JSON.stringify(data))
           setAuthUser(data)
           setLoading(false)
           navigate('/login')



        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-w-full mx-auto">
            <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                <h1 className="text-3xl font-bold text-center text-gray-400">
                    Crear <span className="text-gray-950">Usuario</span>
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div>
                        <label className="label p-2">
                            <span className="font-bold text-gray-500 text-xl label-text">FullName:</span>
                        </label>
                        <input
                            id="fullname"
                            type="text"
                            onChange={handleInput}
                            placeholder="Ingresa tu nombre completo"
                            required
                            className="w-full input input-bordered h-10"
                        />
                    </div>

                    <div>
                        <label className="label p-2">
                            <span className="font-bold text-gray-500 text-xl label-text">Username:</span>
                        </label>
                        <input
                            id="username"
                            type="text"
                            onChange={handleInput}
                            placeholder="Ingresa tu nombre de usuario"
                            required
                            className="w-full input input-bordered h-10"
                        />
                    </div>

                    <div>
                        <label className="label p-2">
                            <span className="font-bold text-gray-500 text-xl label-text">Email:</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            onChange={handleInput}
                            placeholder="Ingresa tu email"
                            required
                            className="w-full input input-bordered h-10"
                        />
                    </div>

                    <div>
                        <label className="label p-2">
                            <span className="font-bold text-gray-500 text-xl label-text">Contraseña:</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            onChange={handleInput}
                            placeholder="Ingresa tu contraseña"
                            required
                            className="w-full input input-bordered h-10"
                        />
                    </div>

                    <div>
                        <label className="label p-2">
                            <span className="font-bold text-gray-500 text-xl label-text">Confirmar Contraseña:</span>
                        </label>
                        <input
                            id="confpassword"
                            type="text"
                            onChange={handleInput}
                            placeholder="Confirma tu contraseña"
                            required
                            className="w-full input input-bordered h-10"
                        />
                    </div>

                    <div id="genero" className="flex gap-2">
                        <label className="cursor-pointer label flex gap-2">
                            <span className="text-2xl label-text font-semibold text-gray-950">Masculino</span>
                            <input
                                onChange={() => selectGenero('masculino')}
                                checked={inputData.genero === 'masculino'}
                                type="checkbox"
                                className="checkbox checkbox-info"
                            />
                        </label>

                        <label className="cursor-pointer label flex gap-2">
                            <span className="text-2xl label-text font-semibold text-gray-950">Femenino</span>
                            <input
                                onChange={() => selectGenero('femenino')}
                                checked={inputData.genero === 'femenino'}
                                type="checkbox"
                                className="checkbox checkbox-info"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="mt-10 self-center w-auto px-2 py-1 bg-gray-800 hover:bg-gray-950 text-white rounded-lg transition-transform transform hover:scale-105"
                    >
                        {loading ? 'Cargando...' : 'Registrate'}
                    </button>
                </form>

                <div className="pt-4">
                    <p className="text-sm font-semibold text-gray-600 text-center">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to={'/login'}>
                            <span className="text-gray-500 font-bold underline cursor-pointer hover:text-blue-600">
                                Inicia sesión ahora!
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
