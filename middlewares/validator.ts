import { Request, Response } from 'express'
import { db } from '@/database/connect'

export const validator = async (req: Request, res: Response) => {
  const { stud_id } = req.body
  console.log(stud_id)
  try {
    const student = await db.query(
      `SELECT * FROM student WHERE student_id = "${stud_id}"`,
    )

    if (!student) {
      return res.status(400).json({ message: 'Student not found!' })
    }

    res.cookie('student_id', student.rows[0].student_id, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    res.status(200).json({ message: 'QR Validated successfuly' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
