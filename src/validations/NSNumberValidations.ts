import Joi from "joi"
import {
    NSNumber,
} from "../NSNumber"
import {
    NumberSystem,
} from "../NumberSystem"


export const constructorSchema = {
    main: Joi.object({
        ns: Joi.any(),
        number: Joi.any()
            .default(0),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        ns: Joi.object()
            .instance(NumberSystem),
        number: [
            Joi.number()
                .min(0)
                .integer()
                .prefs({ convert: false }),
            Joi.string()
                .pattern(/^\d+$/, 'number string'),
            Joi.object()
                .instance(NSNumber),
        ]
    })
}


export const toSystemSchema = {
    main: Joi.object({
        ns: Joi.any(),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        ns: Joi.object()
            .instance(NumberSystem),
    })
}