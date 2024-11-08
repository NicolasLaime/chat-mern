import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import useConversation from "../../../zustand/useConversation";
import { useSocketContext } from "../../../context/socketContext";


const Sidebar = ({onSelectUser}) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([])
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState('')
  const {messages, selectedConversation,setSelectedConversation, setMessage } = useConversation()
  const {onlineUser, socket} = useSocketContext()

  // Mapea solo los IDs de los usuarios con los que el usuario ha chateado

  const nowOnline = chatUser.map((user) => (user._id))
  // chat sockets
  const isOnline = nowOnline.map(userId => onlineUser.includes(userId))
  
 
  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      setNewMessageUsers(newMessage)  
      setMessage([...messages, newMessage])
    })
    return () => socket?.off('newMessage');
  },[socket,messages])



  // useEffect para obtener usuarios con los que se ha chateado al montar el componente 
  useEffect(() => {
    const chatUserHandler = async() => {
      setLoading(true)
      try {
        const chatts = await axios.get('/api/user/currentchatters')
        const data = chatts.data;
        if (data.success === false) {
          setLoading(false)
          console.log(data.message)
        }
        setLoading(false)
        setChatUser(data)

      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }

    chatUserHandler()
  }, [])



  //Función para manejar el envío de búsqueda de usuarios 
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;

      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      if (data.length === 0) {
        toast.info('Usuario no encontrado');
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // SELECCIONAR USUARIO
  const handleUserClick = (user) => {
    onSelectUser(user)
    setSelectedConversation(user)
    setSelectedUserId(user?._id);
    setNewMessageUsers('')
    
  }

  // VOLVER ATRAS
  const handleSearchBack = () => {
    setSearchUser([])
    setSearchInput('')
  }

  // Cerrar sesión
  const handleLogout = async() => {

    const confirmLogout = window.prompt('Escribe tu usuario para cerrar sesión')
    if(confirmLogout === authUser.username){
      setLoading(true)  
      try {
          const logout = await axios.post('/api/auth/logout')
          const data = logout.data
          if(data.success === false){
               setLoading(false)
               console.log(data.message)
          }
          toast.info(data.message)
          localStorage.removeItem('chatapp')
          setAuthUser(null)
          setLoading(false)
          navigate('/login')
        } catch (error) {
          setLoading(false)
          console.log(error)
        }
    }else{
      toast.info('Ingrese su usuario correctamente para poder cerrar sesión')
    }
   
      

  }


  return (
    <div className="h-full w-auto px-1 py-1">
      <div className="flex justify-between gap-2">
        <form onSubmit={handleSearchSubmit} className="w-auto flex items-center justify-between bg-white rounded-full">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-4 w-auto bg-transparent outline-none rounded-full"
            placeholder="Buscar Usuario"
          />
          <button className="btn btn-circle bg-sky-800 hover:bg-gray-950">
            <LuSearch />
          </button>

        </form>
        <img
          onClick={() => navigate(`/profile/${authUser?._id}`)}
          src={authUser?.profileepic}
          alt="Profile"
          className="self-center h-12 w-12 hover:scale-110 cursor-pointer rounded-full"
        />
      </div>
      <div className="divider px-3"></div>
      {searchUser?.length > 0 ? (
        <>
          <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar">
            <div className="w-auto">
              {searchUser.map((user, index) => (
                <div key={user._id}>
                  <div onClick={() => handleUserClick(user)} className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user?._id ? 'bg-sky-500' : ''}`}>
                  <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                    <div className="w-12 rounded-full">
                      <img src={user.profileepic} alt="user.img" />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <p className="font-bold text-gray-950">{user.username}</p>
                  </div>
                  </div>
                  <div className="divider divide-solid px-3 h-[1px] border border-gray-950 " />
 
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto px-1 py-1 flex">
            <button onClick={handleSearchBack} className="bg-white px-2 rounded-full py-1 self-center">
            <IoArrowBackSharp size={25}/>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar">
          <div className="w-auto">
            {chatUser.length === 0 ? (
              <>
                <div className="font-bold items-center flex flex-col textxl text-yellow-300">
                  <h1>No hablaste con nadie estas solo</h1>
                  <h1>Busca el nombre de un usuario para chatear</h1>
                </div>
              </>
            ) : (
              <>
                {chatUser.map((user, index) => (
                  <div key={user._id}>
                    <div onClick={() => handleUserClick(user)} className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user?._id ? 'bg-sky-500' : ''}`}>
                      <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                        <div className="w-12 rounded-full">
                          <img src={user.profileepic} alt="user.img" />
                        </div>
                      </div>

                      <div className="flex flex-col flex-1">
                        <p className="font-bold text-gray-950">{user.username}</p>
                      </div>
                      <div >
                              {
                               newMessageUsers.reciverId === authUser._id && newMessageUsers.senderId === user._id ?
                               <div className="rounded full bg-green-700 text-sm text-white px-[4px]">+1</div>: ''

                              }
                      </div>
                    </div>
                    <div className="divider divide-solid px-3 h-[1px] border border-gray-950" />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>


        <div className="mt-auto px-1 py-1 flex gap-2">
          <button onClick={handleLogout} className=" hover:bg-red-600 cursorp hover:text-white rounded-lg">
             <RiLogoutCircleLine size={25} />
          </button>
          <p className="text-sm py-1">Cerrar Sesión</p>
        </div>
        </>
      )} 


    </div>
  );
};

export default Sidebar;
