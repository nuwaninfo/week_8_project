import { Request, Response, Router } from "express"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { validateToken } from "../middleware/validateToken"
import { IUser, User } from "../models/User"
import {
  Result,
  ValidationError,
  validationResult,
  matchedData,
} from "express-validator"
import { loginValdations } from "../validators/inputValidation"
import { registerValdations } from "../validators/inputValidation"
import { errorCreator } from "../validators/error-creator"

const router: Router = Router()

router.get("/hello", (req: Request, res: Response) => {
  res.json({ msg: "Hello world!" })
})

router.get("/echo/:id", (req: Request, res: Response) => {
  res.json(req.params)
})

type TUser = {
  email: string
  password: string
  username: string
  isAdmin: boolean
}
let users: Array<TUser> = []

router.post(
  "/api/user/register",
  registerValdations,
  async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) {
      const errMsgArr: Record<string, string> = errorCreator(errors.array())

      return res.status(400).json({ errors: errMsgArr })
    }

    const email: string = req.body.email
    const password: string = req.body.password
    const username: string = req.body.username
    const isAdmin: boolean = req.body.isAdmin

    try {
      let user: IUser | null = await User.findOne({ email })

      if (user) {
        return res.status(403).json({ username: "User already exists" })
      }

      const salt: string = bcrypt.genSaltSync(10)
      const hash: string = bcrypt.hashSync(password, salt)

      user = new User({
        email: email,
        password: hash,
        username: username,
        isAdmin: isAdmin,
      })

      await user.save()

      return res.status(200).json(user)
    } catch (error: any) {
      console.error(`Error during registration: ${error}`)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }
)

router.get("/api/user/list", (req: Request, res: Response) => {
  res.json(users)
})

router.post(
  "/api/user/login",
  loginValdations,
  async (req: Request, res: Response) => {
    try {
      const errors: Result<ValidationError> = validationResult(req)

      if (!errors.isEmpty()) {
        const errMsgArr: Record<string, string> = errorCreator(errors.array())

        return res.status(400).json({ errors: errMsgArr })
      }

      const email: string = req.body.email
      const password: string = req.body.password

      let user: IUser | null = await User.findOne({ email })

      if (!user) {
        return res.status(404).json({ message: "Login failed" })
      }

      if (bcrypt.compareSync(password, user.password)) {
        const jwtPayload: JwtPayload = {
          _id: user._id,
          username: user.username,
          isAdmin: user.isAdmin,
        }
        const token: string = jwt.sign(
          jwtPayload,
          process.env.SECRET as string,
          {
            expiresIn: "10m",
          }
        )

        return res.status(200).json({ success: true, token })
      }
      return res.status(401).json({ message: "Login failed" })
    } catch (error: any) {
      console.error(`Error during user login: ${error}`)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }
)

router.get(
  "/api/private",
  [validateToken],
  async (req: Request, res: Response) => {
    try {
      return res
        .status(200)
        .json({ message: "This is protected secure route!" })
    } catch (error: any) {
      console.log(`Error while fecthing users ${error}`)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }
)

export default router
