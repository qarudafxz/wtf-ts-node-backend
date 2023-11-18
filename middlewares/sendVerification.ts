import { Request, Response } from 'express'
import nodemailer from 'nodemailer'

export const sendVerification = async (req: Request, res: Response) => {
  const { email } = req.headers
  const pin = createPin()
  console.log(email)

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'franfra10j@gmail.com',
        pass: 'pnzdzfijogrukzlc',
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: '',
          to: email,
          subject: 'What the Fee	Verification Code',
          text: `Your verification code is ${pin}`,
        },
        (err, info) => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            console.log('Email sent successfully')

            resolve(info)
          }
        },
      )
    })

    res.status(200).json({ message: 'Email sent successfully', code: pin })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const createPin = (): string => {
  const pin: number[] = []

  for (let i = 0; i < 4; i++) {
    pin.push(Math.floor(Math.random() * 10))
  }

  return pin.join('')
}
