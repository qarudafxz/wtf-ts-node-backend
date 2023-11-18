import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { db } from '@/database/connect'

export const changePassword = async (req: Request, res: Response) => {
  const { student_id, password } = req.body

  try {
    if (!student_id || !password) {
      return res.status(400).json({ message: 'Bad Request' })
    }

    const admin = await db.query(`
			SELECT admin_id, password FROM admins WHERE admin_id = '${student_id}'
		`)

    if (!admin.rows.length) {
      return res.status(400).json({ message: 'Invalid student ID' })
    }

    const isTheSamePassword = await bcrypt.compare(
      password,
      admin.rows[0].password,
    )

    console.log(password, admin.rows[0].password)

    if (isTheSamePassword) {
      return res
        .status(400)
        .json({ message: 'New password cannot be the same as the old one' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    await db.query(
      `UPDATE admins SET password = '${hashedPassword}' WHERE admin_id = '${student_id}'`,
    )

    return res.status(200).json({ message: 'Password changed successfully' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
