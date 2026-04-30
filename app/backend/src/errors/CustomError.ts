class CustomError<C extends string> extends Error {
    statusCode: number;
    code?: C;

    constructor({
        message,
        statusCode,
        code,
    }: {
        message: string;
        statusCode: number;
        code?: C;
    }) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
    }
}

export default CustomError;