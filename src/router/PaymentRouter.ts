import { Router } from "express";
import * as PaymentController from "../controller/PaymentController";

const paymentRouter = Router();

paymentRouter.get("/", PaymentController.getAllPayments);
paymentRouter.get("/:id", PaymentController.getPaymentById);

export default paymentRouter;
