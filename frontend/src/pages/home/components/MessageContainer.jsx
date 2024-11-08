import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext"
import useConversation from "../../../zustand/useConversation"
import { BsChatSquareText } from "react-icons/bs";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../../context/socketContext";
import notificacion from '../../../assets/notificacion.mp3'


const MessageContainer = ({ onBackUser }) => {


  const { messages, selectedConversation, setSelectedConversation, setMessage } = useConversation()
  const {socket} = useSocketContext()
  const { authUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendData, setSendData] = useState('')
  const lastMessageRef = useRef()


  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      const sound = new Audio(notificacion)
      sound.play()
      setMessage([...messages, newMessage])
    })

    return () => socket?.off('newMessage');
  },[socket, setMessage, messages])


  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100);
  }, [messages])





  useEffect(() => {
    const getMessages = async () => {
      setLoading(true)
      try {
        const get = await axios.get(`/api/message/${selectedConversation?._id}`)
        const data = get.data
        if (data.success === false) {
          setLoading(false)
          console.log(data.message)
        }
        setLoading(false)
        setMessage(data)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    if (selectedConversation?._id) getMessages()
  }, [selectedConversation?._id, setMessage])


  const handleMessage = (e) => {
    setSendData(e.target.value)
  }


  const handleSubmit = async (e) => {
    e.preventDefault();  
    if (sending) return; 

    setSending(true);
    try {
      const res = await axios.post(`/api/message/send/${selectedConversation?._id}`, { message: sendData });
      const data = await res.data;
      if (data.success === false) {
        setSending(false);
        console.log(data.message);
        return;
      }
      setSending(false);
      setMessage([...messages, data]);
      setSendData('')
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };






  return (
    <>
      <div className="sm:min-w-[400px] md:min-w-[200px] lg:min-w-[700px] md:max-w-[px]  h-[99%] flex flex-col py-2">

        {selectedConversation === null ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2">
              <p className="text-2xl">Bienvenido {authUser.username}✔</p>
              <p className="text-lg">Selecciona un chat para empezar hablar!</p>
              <BsChatSquareText className="text-4xl text-center" />
            </div>
          </div>
        ) : (<>

          <div className="flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-15  ">
            <div className="flex gap-2 md:justify-between items-center w-full">
              <div className="md:hidden ml-1 self-center">
                <button onClick={() => onBackUser(true)} className="bg-white rounded-full">
                  <IoArrowBackSharp size={25} />
                </button>
              </div>
              <div className="flex justify-between mr-2 gap-2">
                <div className="self-center">
                  <img className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer" src={selectedConversation?.profileepic} alt="fotoperfil" />
                </div>
                <span className="text-gray-950 self-center text-sm md:text-xl font-bold">{selectedConversation?.username}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto mt-10 ">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-tranparent">
                <div className="loading loading-spinner">

                </div>
              </div>
            )}
            {!loading && messages?.length === 0 && (
              <p className="text-center text-white items-center">Escribe un mensaje para iniciar una conversacion</p>
            )}
            {!loading &&
              messages.length > 0 &&
              messages.map((message) => (
                <div className="text-white" key={message._id} ref={lastMessageRef} >
                  <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
                    <div className="chat-image avatar"></div>
                    <div className={`chat-bubble ${message.senderId === authUser._id ? 'bg-blue-400' : ''}`}>
                      {message?.message}
                    </div>
                    <div className="chat-footer text-[10px] opacity-80 text-white">
                      {new Date(message?.createdAt).toLocaleDateString('en-ES')}
                      {" "}
                      {new Date(message?.createdAt).toLocaleTimeString('en-ES', { hour: 'numeric', minute: 'numeric' })}

                    </div>
                  </div>

                </div>
              ))}
          </div>

        </>)}



        <form onSubmit={handleSubmit} className="rounded-full text-black flex items-center w-full mt-4">
          <div className="flex items-center w-full bg-white rounded-full shadow-md">
            <input
              value={sendData}
              onChange={handleMessage}
              required
              id="message"
              type="text"
              className="flex-1 px-4 py-2 rounded-full text-black focus:outline-none"
              placeholder="Escribe un mensaje..."
            />
            <button type="submit" className="flex items-center justify-center w-12 h-12 bg-sky-700 rounded-full mx-2">
              {sending ? (
                <div className="loading loading-spinner"></div>
              ) : (
                <IoSend size={25} className="text-white" />
              )}
            </button>
          </div>
        </form>

      </div>

    </>
  )
}

export default MessageContainer