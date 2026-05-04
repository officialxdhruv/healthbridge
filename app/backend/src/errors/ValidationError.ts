import CustomError from "./CustomError";
import ErrorCode from "./types";

class ValidationError extends CustomError<ErrorCode> {
  constructor(message = "Validation failed") {
    super({ message, statusCode: 400, code: "ERR_VALIDATION" });
  }
}

export default ValidationError;
