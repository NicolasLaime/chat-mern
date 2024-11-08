import { useState } from "react";
import MessageContainer from "./components/MessageContainer";
import Sidebar from "./components/Sidebar";

const Home = () => {
  // Estado para el usuario seleccionado y visibilidad de la barra lateral
  const [selectedUser, setSelectedUser] = useState(null);  // Controla qué usuario está seleccionado
  const [isSideBarVisible, setIsSideBarVisible] = useState(true);  // Controla la visibilidad de la barra lateral

  // Función para manejar la selección de un usuario en la barra lateral
  const handleUserSelect = (user) => {
    setSelectedUser(user);  // Establece el usuario seleccionado
    setIsSideBarVisible(false);  // Oculta la barra lateral al seleccionar un usuario
  };

  // Función para mostrar la barra lateral y reiniciar el usuario seleccionado
  const handleShowSideBar = () => {
    setIsSideBarVisible(true);  // Muestra la barra lateral
    setSelectedUser(null);  // Reinicia el usuario seleccionado
  };

  return (
    <div className="flex justify-between min-w-full md:min-w-[500px] md:max-w-[95%] px-2 h-[90%] md:h-full rounded-xl shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      
      {/* Barra lateral (sidebar) */}
      <div className={`w-full py-2 md:flex ${isSideBarVisible ? '' : 'hidden'}`}>
        <Sidebar onSelectUser={handleUserSelect} />
      </div>

      {/* Divisor entre barra lateral y el contenedor de mensajes (en pantallas más grandes) */}
      <div className={`divider divider-horizontal px-3 md:flex ${isSideBarVisible ? '' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}></div>

      {/* Contenedor de mensajes (derecha) */}
      <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} bg-tranparent`}>
        <MessageContainer onBackUser={handleShowSideBar} />
      </div>
    </div>
  );
};

export default Home;
