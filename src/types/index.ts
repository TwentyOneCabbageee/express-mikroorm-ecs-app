export interface UserDTO {
    id: number;
    name: string;
    email: string;
}

export interface MikroOrmInitError {
  message: string;
  stack?: string;
}
