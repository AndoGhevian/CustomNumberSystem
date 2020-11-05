import Joi from "joi";

export const SystemDigitsConfigSchema = Joi.object({
    base: Joi.number()
        .min(2)
        .integer()
        .max(Joi.ref('maxBase'))
        .required(),
    maxBase: Joi.number()
        .min(2)
        .integer()
        .required(),
    digGen: Joi.function()
        .required(),
    dinamicArity: Joi.any(),
}).unknown().required()