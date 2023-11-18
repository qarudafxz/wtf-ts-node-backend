import { Request, Response, NextFunction } from 'express'

export const isSessionPresent = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers['session']
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    next()
  } catch (err) {
    console.log(err)

    // What the heck
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
