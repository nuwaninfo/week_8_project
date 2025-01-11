import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

interface CustomRequest extends Request {
  user?: JwtPayload
}

const validateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.header("authorization")?.split(" ")[1]

  if (!token) return res.status(401).json({ message: "Token not found" })

  try {
    const verified: JwtPayload = jwt.verify(
      token,
      process.env.SECRET as string
    ) as JwtPayload

    /*if (!verified.isAdmin) {
      return res.status(403).json({ message: "Access denied." })
    }*/
    req.user = verified

    next()
  } catch (error: any) {
    res.status(401).json({ message: "Access denied" })
  }
}

export { validateToken, CustomRequest }
