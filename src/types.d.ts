declare namespace Express {
  export interface Request {
    time: number;
    rowBody?: string;
    responseData: any;
    user?: any;
  }
}
