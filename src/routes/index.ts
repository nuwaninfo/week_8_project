import { Request, Response, Router } from "express"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { validateToken } from "../middleware/validateToken"

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
}
let users: Array<TUser> = []

router.post("/api/user/register", async (req: Request, res: Response) => {
  const email: string = req.body.email
  const password: string = req.body.password

  try {
    const isUserExists: boolean | null = users.some(
      (user) => user.email === email
    )

    if (isUserExists) {
      return res.status(403).json({ username: "User already exists" })
    }

    const salt: string = bcrypt.genSaltSync(10)
    const hash: string = bcrypt.hashSync(password, salt)

    const newUser: TUser = { email: email, password: hash }

    users.push(newUser)

    return res.status(200).json(newUser)
  } catch (error: any) {
    console.error(`Error during registration: ${error}`)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/api/user/list", (req: Request, res: Response) => {
  res.json(users)
})

router.post("/api/user/login", async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email
    const password: string = req.body.password

    const user: TUser | undefined = users.find((user) => user.email === email)

    if (!user) {
      return res.status(401).json({ message: "Login failed" })
    }

    if (bcrypt.compareSync(password, user.password)) {
      const jwtPayload: JwtPayload = {
        email: user.email,
      }
      const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {
        expiresIn: "10m",
      })

      return res.status(200).json({ success: true, token })
    }
    return res.status(401).json({ message: "Login failed" })
  } catch (error: any) {
    console.error(`Error during user login: ${error}`)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get(
  "/api/private",
  validateToken,
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
