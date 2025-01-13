import { Request, Response, Router } from "express"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { validateToken, CustomRequest } from "../middleware/validateToken"
import { IUser, User } from "../models/User"
import { ITopic, Topic } from "../models/Topic"
import {
  Result,
  ValidationError,
  validationResult,
  matchedData,
} from "express-validator"
import {
  loginValdations,
  registerValdations,
  topicValidations,
} from "../validators/inputValidation"

import { errorCreator } from "../validators/error-creator"
import moment from "moment"
import { Query } from "mongoose"

const router: Router = Router()

router.get("/hello", (req: Request, res: Response) => {
  res.json({ msg: "Hello world!" })
})

router.get("/echo/:id", (req: Request, res: Response) => {
  res.json(req.params)
})

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

router.get(
  "/api/topics",

  async (req: CustomRequest, res: Response) => {
    try {
      /*if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
      }*/

      // Get the username from the request object
      //const username: string = req.user.username

      const topics: ITopic[] | null = await Topic.find()

      if (!topics) {
        return res.status(404).json({ message: "No topics found" })
      }

      return res.status(200).json(topics)
    } catch (error: any) {
      console.error(`Error while fetching a file: ${error}`)
      return res.status(500).json({ message: "Internal server error" })
    }
  }
)

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

// Implement add topic route handler
router.post(
  "/api/topic",
  [validateToken, ...topicValidations],
  async (req: CustomRequest, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) {
      const errMsgArr: Record<string, string> = errorCreator(errors.array())

      return res.status(400).json({ errors: errMsgArr })
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const title: string = req.body.title
      const content: string = req.body.content
      const username: string = req.user.username
      const createdAt: Date = new Date()

      const topic = new Topic({
        title: title,
        content: content,
        username: username,
        createdAt: createdAt,
      })
      await topic.save()
      return res.status(200).json(topic)
    } catch (error: any) {
      console.error(`Error during saving data: ${error}`)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }
)

router.delete(
  "/api/topic/:id",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Access denied" })
      }

      if (!req.user.isAdmin) {
        return res.status(403).json("Access denied")
      } else {
        const deletedTopic = await Topic.deleteOne({
          _id: req.params.id,
        })
        if (deletedTopic.deletedCount === 1) {
          res.status(200).json({ message: "Topic deleted successfully." })
        } else {
          res.status(200).json({ message: "Topic already deleted." })
        }
      }
    } catch (err) {
      console.error("Error deleting topic:", err)
    }
  }
)

export default router
