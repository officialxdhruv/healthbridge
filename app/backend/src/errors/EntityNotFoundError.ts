import CustomError from "@/errors/CustomError";
import type ErrorCode from "@/errors/types";

class EntityNotFoundError extends CustomError<ErrorCode> {
  constructor(message = "Entity not found") {
    super({ message, statusCode: 404, code: "ERR_NOT_FOUND" });
  }
}

export default EntityNotFoundError;
