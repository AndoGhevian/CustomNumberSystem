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
        number: [
            Joi.array()
                .items(
                    Joi.any()
                        .default(0)
                ),
            Joi.any()
                .default(0),
        ],
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        ns: Joi.object()
            .instance(NumberSystem)
            .required(),
        number: [
            Joi.number()
                .min(0)
                .integer()
                .prefs({ convert: false }),
            Joi.string()
                .pattern(/^\d+$/, 'number string'),
            Joi.object()
                .instance(NSNumber),
            Joi.array()
                .items(
                    Joi.number()
                        .min(0)
                        .integer()
                        .less(Joi.ref('...ns.base'))
                )
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
            .instance(NumberSystem)
            .required(),
    })
}