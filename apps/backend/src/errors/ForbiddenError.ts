import CustomError from "./CustomError";
import type ErrorCode from "./types";

class ForbiddenError extends CustomError<ErrorCode> {
  constructor(message = "Forbidden") {
    super({ message, statusCode: 403, code: "ERR_FORBIDDEN" });
  }
}

export default ForbiddenError;
