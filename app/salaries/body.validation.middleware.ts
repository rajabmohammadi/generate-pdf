import express from "express";
import { validationResult } from "express-validator";

class BodyValidationMiddleware {
   verifyBodyFieldsErrors(req: express.Request, res: express.Response, next: express.NextFunction) {
      const result = validationResult(req);
      if (!result.isEmpty()) {
         res.send({ errors: result.array() });
      } else next();
   }
}

export default new BodyValidationMiddleware();
