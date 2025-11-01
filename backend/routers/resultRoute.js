import express from 'express'
import { authMeddleware } from '../middleware/auth.js'
import { createResult, listResult } from '../controller/resultController.js'

const resulRouter=express.Router()
resulRouter.post('/',authMeddleware,createResult)
resulRouter.get('/',authMeddleware,listResult)

export default resulRouter