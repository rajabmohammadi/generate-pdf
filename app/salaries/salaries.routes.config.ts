import express from 'express';
import { CommonRoutesConfig } from '../../utils/common.routes.config';
import salariesControllers from './salaries.controllers';
import bodyValidationMiddleware from './body.validation.middleware';
import { body } from "express-validator";
export class SalariesRoutes extends CommonRoutesConfig {
   constructor(app: express.Application) {
      super(app, 'SalariesRoutes');
   }
   configureRoutes(): express.Application {
      this.app.route('/salary-receipt')
         .post(
            body('employeeInfo').isObject(),
            body('analyticalInfo').isArray(),
            body('salaryInfo').isObject(),
            bodyValidationMiddleware.verifyBodyFieldsErrors,
            salariesControllers.generatePDF
         )
      return this.app;
   }
}