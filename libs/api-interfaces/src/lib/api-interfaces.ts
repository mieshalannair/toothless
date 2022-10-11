export interface Message {
  message: string;
}

export interface ResponseWithData<T> extends Message {
  data: T ;
}
