export type IndexedObjectValueTypes =
  | string
  | number
  | bigint
  | boolean
  | object
  | null;

export type IndexedObject = Record<string, IndexedObjectValueTypes>;

export type FieldTypes = string | number | boolean | object;

export interface IResponseBuilderData {
  httpCode: number;
  data: any;
}

export type ResponseError = {
  type: string;
  status: number;
  stack: string;
  message: string;
};

export interface IError extends Partial<Error> {
  response?: {
    data?: {
      errors?: {
        type: string;
        message: string;
        status: number;
      }[];
    };
    status?: number;
  };
  type?: string;
  message?: string;
}
