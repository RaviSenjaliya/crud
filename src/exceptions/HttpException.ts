class HttpException {
  constructor(
    public message: string,
    public statusCode: number,
    public stack: string,
    public type: string
  ) {}
}

export default HttpException;
