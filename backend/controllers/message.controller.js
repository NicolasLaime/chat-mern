import Conversation from '../models/conversationModel.js'
import Message from '../models/messageSchema.js'
import { getReciverSocketId, io } from '../socket/socket.js';

// enviar mensaje
export const sendMessage = async(req,res) => {
    try {
        const {message} = req.body;
        const {id:reciverId} = req.params;
        const senderId = req.user._conditions._id;
         

        let chats = await Conversation.findOne({
            participats:{ $all: [senderId,reciverId] }

        });
        if(!chats){
            chats = await Conversation.create({
                participats:[senderId, reciverId],
            })
        }
        const newMessages = new Message({
            senderId,
            reciverId,
            message,
            conversationId: chats._id
        })
        if(newMessages){
            chats.messages.push(newMessages._id)
        }
        
        await Promise.all([chats.save(), newMessages.save()])
        // SOCKET
        const reciverSocketId = getReciverSocketId(reciverId);
        if(reciverSocketId){
            io.to(reciverSocketId).emit('newMessage', newMessages)
        }
        
        res.status(200).send(newMessages)


    } catch (error) {
       res.status(500).send({success:false, message: error})
        console.log(error);
     
        
    }




}


// Recibir mensaje

export const getMessages = async(req, res) => {
    
    try {
        
        const {id:reciverId} = req.params;
        const senderId = req.user._conditions._id;

        const chats = await Conversation.findOne({
            participats:  {$all:[senderId,reciverId]}
        }).populate('messages')
        
        if(!chats) return res.status(200).send([])
        const message = chats.messages;
        res.status(200).send(message)



    } catch (error) {
        res.status(500).send({success:false, message: error})
        console.log(error);
    }
    

}


