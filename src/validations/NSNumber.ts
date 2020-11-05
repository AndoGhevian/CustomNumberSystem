import Joi from "joi"
import * as defaultsSchema from "./defaultsSchema"

import { NSNumber } from "../NSNumber"
import { NumberSystem } from "../NumberSystem"


export const NSNumberSchema = {
    defaultSetter: defaultsSchema.NSNumberDefaults,
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

export const getDigitSchema = {
    niche: Joi.object({
        position: Joi.number()
            .integer()
            .required(),
    })
}

export const decDigitsGeneratorSchema = {
    defaultSetter: defaultsSchema.decDigitsGeneratorDefaults,
    niche: Joi.object({
        optional: Joi.object({
            startPosition: Joi.number()
                .min(0)
                .integer(),
            endPosition: Joi.number()
                .min(0)
                .integer(),
            accumulator: Joi.number()
                .integer()
                .invalid(0),
            excludeStartPosition: Joi.boolean(),
            excludeEndPosition: Joi.boolean(),
        }),
    }),
}

export const opSchema = {
    defaultSetter: defaultsSchema.validateDefaults,
    niche: Joi.object({
        nsNumber: Joi.object()
            .instance(NSNumber)
            .required(),
    })
}

export const compareOpSchema = {
    defaultSetter: defaultsSchema.validateDefaults,
    niche: Joi.object({
        nsNumber1: Joi.object()
            .instance(NSNumber)
            .required(),
        nsNumber2: Joi.object()
            .instance(NSNumber)
            .required(),
    })
}