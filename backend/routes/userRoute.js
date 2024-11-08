import express, { Router } from 'express'
import isLogin from '../middleware/isLogin.js'
import { currentChatters, getUserBySearch } from '../controllers/userHandleController.js'


const router = Router()

router.get('/search',isLogin ,getUserBySearch)

router.get('/currentchatters',isLogin , currentChatters )




export default router