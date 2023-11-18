import { Request, Response } from 'express'
import { db } from '@/database/connect'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import CryptoJS from 'crypto-js'

export const register = async (req: Request, res: Response) => {
  const {
    student_id,
    password,
    first_name,
    middle_name,
    last_name,
    email,
    program,
    year,
    balance,
    role,
  } = req.body

  try {
    const student = await db.query(
      `SELECT * FROM admins WHERE admin_id = "${student_id}"`,
    )

    console.log(student)
    if (student) {
      return res.status(400).json({ message: 'Student already exists!' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newStudent = await db.query(
      `INSERT INTO admins (admin_id, password, first_name, middle_name, last_name, email, program, year, balance, role)
   VALUES ('${student_id}', '${hashedPassword}','${first_name}', '${middle_name}', '${last_name}', '${email}', '${program}', '${year}', '${balance}', '${role}')`,
    )

    console.log(newStudent)

    res.status(200).json({ message: 'Student registered successfuly' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      student_id,
      email,
      password,
      position,
      is_checked,
    } = req.body

    if (
      !first_name ||
      !last_name ||
      !student_id ||
      !email ||
      !password ||
      !position
    ) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    if (!email.endsWith('@carsu.edu.ph')) {
      return res.status(400).json({ message: 'Please use your school email!' })
    }

    const isSuper = is_checked ? 'super' : 'admin'

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newStudentAdmin = await db.query(
      'INSERT INTO admins (admin_id, first_name, last_name, email, password, position, role, is_verified, college_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING admin_id, email',
      [
        student_id,
        first_name,
        last_name,
        email,
        hashedPassword,
        position,
        isSuper,
        false,
        1,
      ],
    )

    //check if the registered account is for super admin or admin only
    await db.query(
      'INSERT INTO permissions(can_add, can_delete, can_update, admin_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [
        true,
        is_checked ? true : false,
        is_checked ? true : false,
        newStudentAdmin.rows[0].admin_id,
      ],
    )

    const sessionToken = v4()

    res.status(200).json({
      message: 'Student Admin registered successfully',
      token: sessionToken,
      admin: newStudentAdmin.rows[0],
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Student admin already exists' })
  }
}

export const verificationQuestions = async (req: Request, res: Response) => {
  const { student_id, questions } = req.body

  //encrypt questions using cryptojs

  const cypherQuestions = CryptoJS.AES.encrypt(
    questions,
    'sekretong malupet pwede pabulong',
  ).toString()

  try {
    await db.query(
      'INSERT INTO questions (admin_id, question) VALUES ($1, $2) RETURNING *',
      [student_id, cypherQuestions],
    )

    res
      .status(200)
      .json({ message: 'Verification questions saved successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
