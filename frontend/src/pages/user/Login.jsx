import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "../../context/AuthContext"
const Login = () => {

    
    const navigate = useNavigate()
    const {setAuthUser} = useAuth();
    
    const [userInput, setUserInput] = useState({})
    const [loading, setLoading] = useState(false)



    const handleInput = (e) => {
        setUserInput({
            ...userInput, [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const login =  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, userInput);
            const data = login.data;
            if (data.success === false) {
                setLoading(false)
            }
            toast.success(data.message)
            localStorage.setItem('chatapp',JSON.stringify(data))
            setAuthUser(data)
            setLoading(false)
            navigate('/')
        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-w-full mx-auto">
            <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                <h1 className="text-3xl font-bold text-center text-gray-300 mb-4">
                    Iniciar Sesión <span className="text-gray-950">Chat Mern</span>
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div>
                        <label className="label p-2">
                            <span className="font-bold text-gray-500 text-xl label-text">Email:</span>
                        </label>
                        <input
                            id='email'
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
                            id='password'
                            type="password"
                            onChange={handleInput}
                            placeholder="Ingresa tu contraseña"
                            required
                            className="w-full input input-bordered h-10"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-10 self-center w-auto px-2 py-1 bg-gray-800 hover:bg-gray-950 text-white rounded-lg transition-transform transform hover:scale-105"
                    >
                        {loading ? 'Cargando...' : 'Iniciar sesión'}
                    </button>
                </form>

                <div className="pt-4">
                    <p className="text-sm font-semibold text-gray-600 text-center">
                        No tienes cuenta?{" "}
                        <Link to={'/register'}>
                            <span className="text-gray-500 font-bold underline cursor-pointer hover:text-blue-600">
                                Registrate Ahora!
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login