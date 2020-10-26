import Joi from "joi";
import {
    NSNumber
} from "../NSNumber";


export const constructorSchema = {
    main: Joi.object({
        digits: Joi.any(),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        digits: Joi.array()
            .min(2)
            .items(
                Joi.string()
                    .min(1)
            )
            .unique()
    })
}

export const decimalToDigDecimalArraySchema = {
    main: Joi.object({
        decimal: Joi.any(),
        base: Joi.any(),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        decimal: [
            Joi.number()
                .min(0)
                .integer()
                .prefs({ convert: false }),
            Joi.string()
                .pattern(/^\d+$/, 'number string')
        ],
        base: Joi.number()
            .min(2)
            .integer()
    })
}

export const digDecimalArrayToDecimalSchema = {
    main: Joi.object({
        digArray: Joi.any(),
        base: Joi.any(),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        digArray: Joi.array()
            .min(1)
            .items(
                Joi.number()
                    .min(0)
                    .integer()
                    .less(Joi.ref('...base'))
            ),
        base: Joi.number()
            .min(2)
            .integer()
    })
}

export const addSchema = {
    main: Joi.object({
        nsNumber1: Joi.any(),
        nsNumber2: Joi.any(),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        nsNumber1: Joi.object()
            .instance(NSNumber),
        nsNumber2: Joi.object()
            .instance(NSNumber),
    })
}

export const subtractSchema = {
    main: Joi.object({
        nsNumber1: Joi.any(),
        nsNumber2: Joi.any(),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        nsNumber1: Joi.object()
            .instance(NSNumber),
        nsNumber2: Joi.object()
            .instance(NSNumber),
    })
}

export const remainderSchema = {
    main: Joi.object({
        nsNumber1: Joi.any(),
        nsNumber2: Joi.any(),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        nsNumber1: Joi.object()
            .instance(NSNumber),
        nsNumber2: Joi.object()
            .instance(NSNumber),
    })
}

export const multiplySchema = {
    main: Joi.object({
        nsNumber1: Joi.any(),
        nsNumber2: Joi.any(),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        nsNumber1: Joi.object()
            .instance(NSNumber),
        nsNumber2: Joi.object()
            .instance(NSNumber),
    })
}