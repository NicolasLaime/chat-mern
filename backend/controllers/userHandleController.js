import Conversation from "../models/conversationModel.js";
import User from "../models/userModels.js";


export const getUserBySearch = async(req,res) => {
    try {
        
        const search = req.body.search || '';
        const currentUserId = req.user._conditions._id;
        const user = await User.find({
            $and:[
                {
                    $or:[

                        {username:{$regex:'.*'+search+'.*', $options: 'i'}},
                        {fullname:{$regex:'.*'+search+'.*', $options: 'i'}}


                    ]
                },{
                    _id:{$ne:currentUserId}
                }
            ]
        }).select('-password').select('email')


        res.status(200).send(user)


        
    } catch (error) {
        res.status(500).send({success:false, message: error})
        console.log(error);
    }
}



export const currentChatters = async (req, res) => {
    try {
        const currentUserId = req.user._conditions._id;
        
        // Encuentra conversaciones en las que participa el usuario actual
        const currentTChatters = await Conversation.find({
            participats: currentUserId
        }).sort({
            updatedAt: -1
        });

        // Si no hay conversaciones, devuelve un arreglo vacío
        if (!currentTChatters || currentTChatters.length === 0) {
            return res.status(200).send([]);
        }

        // Encuentra los IDs de los otros participantes en cada conversación
        const participatsIDS = currentTChatters.reduce((ids, conversation) => {
            const otherParticipants = conversation.participats.filter(id => id !== currentUserId);
            return [...ids, ...otherParticipants];
        }, []);

        // Filtra los IDs para excluir al usuario actual
        const otherParticipantsIDS = participatsIDS.filter(id => id.toString() !== currentUserId.toString());

        // Busca a los otros participantes en la base de datos y excluye sus contraseñas y correos electrónicos
        const users = await User.find({ _id: { $in: otherParticipantsIDS } })
            .select('-password -email');

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ success: false, message: error });
        console.log(error);
    }
};
