import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

interface DtoMapping {
  body?: new () => any;
  params?: new () => any;
  query?: new () => any;
}

export function validationMiddleware(dtos: DtoMapping): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const key of Object.keys(dtos) as (keyof DtoMapping)[]) {
      const dtoClass = dtos[key];
      if (dtoClass) {
        
        const dtoObject = plainToInstance(dtoClass, req[key]);
        const errors = await validate(dtoObject, {
          whitelist: true,
          forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
         
          const messages = errors.map(error => ({
            property: error.property,
            constraints: error.constraints,
          }));

          res.status(422).json({
            message: `${key} validation failed`,
            errors: messages,
          });
          return;
        }

        req[key] = dtoObject;
      }
    }

    next();
  };
}
