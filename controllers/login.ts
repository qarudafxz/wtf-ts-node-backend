import { Request, Response } from 'express'
import { db } from '@/database/connect'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

type Payload = {
  session: string
  student_id: string
  email: string
  first_name: string
  last_name: string
  college_id?: string
  position: string
  role: string
  iat: number
}

export const verifyStudentId = async (req: Request, res: Response) => {
  const { stud_id } = req.body

  try {
    const student = await db.query(
      `SELECT * FROM admins WHERE admin_id = '${stud_id}'`,
    )

    if (student.rows.length === 0) {
      return res.status(400).json({ message: 'Admin not found!' })
    }

    const payload: Payload = {
      session: uuid(),
      student_id: student.rows[0].admin_id,
      email: student.rows[0].email,
      college_id: student.rows[0].college_id,
      first_name: student.rows[0].first_name,
      last_name: student.rows[0].last_name,
      position: student.rows[0].position,
      role: student.rows[0].role,
      iat: new Date().getTime(),
    }

    if (!student.rows[0].is_verified) {
      return res.status(400).json({
        message: 'Admin not verified. Please verify your email first',
        email: student.rows[0].email,
        student_id: student.rows[0].admin_id,
        session: uuid(),
      })
    }

    res.status(200).json({
      student: student.rows[0],
      message: 'Student ID found. Moving to the next process...',
      payload,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const enterPassword = async (req: Request, res: Response) => {
  const { student_id, password } = req.body

  try {
    const admin = await db.query(
      `SELECT * FROM admins WHERE admin_id = '${student_id}'`,
    )

    if (admin.rows.length === 0) {
      return res.status(400).json({ message: 'Student not found!' })
    }

    const match = await bcrypt.compare(password, admin.rows[0].password)

    if (!match) {
      return res.status(400).json({ message: 'Incorrect password!' })
    }

    const payload: Payload = {
      session: uuid(),
      student_id,
      email: '',
      first_name: '',
      last_name: '',
      position: '',
      role: '',
      iat: new Date().getTime(),
    }

    //create a token using bcrypt.sign
    const token = jwt.sign(payload, 'super-secret', { expiresIn: '1h' })

    return res.status(200).json({
      message: 'Login successful!',
      token,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
