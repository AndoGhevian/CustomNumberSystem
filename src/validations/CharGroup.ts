import Joi from "joi";


export const CharGroupSchema = {
    niche: Joi.object({
        chars: Joi.string()
            .min(2),
    }),
}