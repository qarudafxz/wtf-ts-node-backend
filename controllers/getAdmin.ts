import { Request, Response } from 'express'
import { db } from '@/database/connect'
import CryptoJS from 'crypto-js'

export const getAdmin = async (req: Request, res: Response) => {
  const { student_id } = req.headers

  try {
    const admin = await db.query(
      `SELECT first_name FROM admins WHERE admin_id = '${student_id}'`,
    )

    if (admin.rows.length === 0) {
      return res.status(400).json({ message: 'Admin not found!' })
    }

    const questions = await db.query(
      `SELECT question FROM questions WHERE admin_id = '${student_id}'`,
    )

    if (questions.rows.length === 0) {
      return res.status(400).json({ message: 'No questions found!' })
    }

    //unhash the questions using bcrypt
    const unhashedBytes = CryptoJS.AES.decrypt(
      questions.rows[0].question,
      'sekretong malupet pwede pabulong',
    )
    const decypheredQuestions = JSON.parse(
      unhashedBytes.toString(CryptoJS.enc.Utf8),
    )

    res.status(200).json({
      admin: admin.rows[0],
      questions: decypheredQuestions,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getColleges = async (res) => {
  try {
    const colleges = await db.query(`SELECT * FROM colleges`)
    console.log(colleges.rows[0])
    return res.status(200).json({ colleges: colleges.rows })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
