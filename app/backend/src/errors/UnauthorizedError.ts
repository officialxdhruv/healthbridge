import CustomError from "./CustomError";
import ErrorCode from "./types";

class UnauthorizedError extends CustomError<ErrorCode> {
  constructor(message = "Unauthorized") {
    super({ message, statusCode: 401, code: "ERR_AUTH" });
  }
}
export default UnauthorizedError;
