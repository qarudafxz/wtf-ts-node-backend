import { Request, Response } from 'express'
import { db } from '@/database/connect'

export const verify = async (req: Request, res: Response) => {
  const { student_id, code, your_code } = req.body

  try {
    if (code !== your_code) {
      return res.status(400).json({ message: 'Invalid code' })
    }

    //update is_verified to true
    const admin = await db.query(
      `UPDATE admins SET is_verified = true WHERE admin_id = '${student_id}'`,
    )

    res.status(200).json({ message: 'Verification successful', admin })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
