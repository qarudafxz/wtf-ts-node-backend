import { Request, Response, NextFunction } from 'express'

export const validateChangePass = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { stage, student_id } = req.body

  try {
    console.log(stage, student_id)
    if (!(stage === '3' && student_id)) {
      console.log('No parameters acquired')
      return res.status(400).json({ message: 'No parameters acquired' })
    }

    next()
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
