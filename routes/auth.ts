import express from 'express'
//controllers
import { verifyStudentId, enterPassword } from '@/controllers/login'
import { registerAdmin, verificationQuestions } from '@/controllers/register'
//middlewares
import { isSessionPresent } from '@/middlewares/isSessionPresent'
import { sendVerification } from '@/middlewares/sendVerification'
import { verify } from '@/controllers/verify'
import { getAdmin, getColleges } from '@/controllers/getAdmin'
import { validateChangePass } from '@/middlewares/validateChangePass'
import { changePassword } from '@/controllers/changePassword'

const router = express.Router()

//login
router.post('/verify', verifyStudentId)
router.post('/login', enterPassword)

//register
router.post('/register', registerAdmin)
router.post('/add-questions', isSessionPresent, verificationQuestions)
router.post('/verify-code', isSessionPresent, verify)
router.get('/get-colleges', getColleges)
router.get('/get-code', sendVerification)

//info
router.get('/info', getAdmin)

//change password
router.put('/change-password', validateChangePass, changePassword)

export { router as auth }
