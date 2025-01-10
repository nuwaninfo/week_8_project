import { Result, ValidationError, validationResult } from "express-validator"

const errorCreator = (errors: ValidationError[]): Record<string, string> => {
  const errorMsg: Record<string, string> = {}

  for (const e of errors) {
    console.log(e)
    // Check if the error has a `param` property and it's a string
    if ("path" in e && typeof e.path === "string") {
      if (errorMsg[e.path] !== undefined) {
        const msg = `${errorMsg[e.path]}, ${e.msg}`
        console.log(msg)
        errorMsg[e.path] = msg
      } else {
        errorMsg[e.path] = e.msg
      }
    }
  }

  return errorMsg
}

export { errorCreator }
