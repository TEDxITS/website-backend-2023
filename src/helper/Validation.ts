import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const uuidSchema = Joi.string().guid({
    version: [
        'uuidv4',
    ]
}).message("Id format invalid");

export const createBookingSchema = Joi.array().items(
    Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        ticketId: uuidSchema.required()
    })
)

export const uploadPaymentSchema = Joi.object({
    bookingId: uuidSchema.required(),
    paymentProof: Joi.string().required()
})

export const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required()
})
