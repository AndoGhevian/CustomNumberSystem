import Joi from "joi";
import { DecimalDigsGeneratorMode } from "../commonTypes";
import {
    NSNumber
} from "../NSNumber";
import { constructDefaultsSchema } from "../utils";


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
            .required()
    })
}

export const decimalToDecimalDigArrSchema = {
    main: Joi.object({
        decimal: Joi.any(),
        base: Joi.any(),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        decimal: Joi.alternatives()
            .try(
                Joi.number()
                    .min(0)
                    .integer()
                    .prefs({ convert: false }),
                Joi.string()
                    .pattern(/^\d+$/, 'number string')
            )
            .required(),
        base: Joi.number()
            .min(2)
            .integer()
            .required(),
    })
}

export const decimalDigArrToDecimalSchema = {
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
            )
            .required(),
        base: Joi.number()
            .min(2)
            .integer()
            .required(),
    })
}

export const opSchema = {
    main: Joi.object({
        nsNumber1: Joi.any(),
        nsNumber2: Joi.any(),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        nsNumber1: Joi.object()
            .instance(NSNumber)
            .required(),
        nsNumber2: Joi.object()
            .instance(NSNumber)
            .required(),
    })
}

export const toStringSchema = {
    main: Joi.object({
        nsNumber: Joi.any(),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        nsNumber: Joi.object()
            .instance(NSNumber)
            .required(),
    })
}

export const addToDecimalDigsArrSchema = {
    main: Joi.object({
        decimalDigsArr: Joi.any(),
        number: Joi.any(),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        decimalDigsArr: Joi.array()
            .min(1)
            .items(
                Joi.number()
                    .min(0)
                    .integer()
                    .less(Joi.ref('$base'))
            )
            .required(),
        number: Joi.number()
            .min(0)
            .integer()
            .required(),
    })
}

export const decimalDigsGeneratorSchema = {
    main: constructDefaultsSchema({
        optional: {
            endDecimalDigsArr: null,
            accumulator: 1,
            options: {
                mode: 'classic'
            },
        },
        validate: false
    }),
    niche: Joi.object({
        startDecimalDigsArr: Joi.array()
            .min(1)
            .items(
                Joi.number()
                    .min(0)
                    .integer()
                    .less(Joi.ref('$base'))
            )
            .required(),
        optional: Joi.object({
            endDecimalDigsArr: Joi.alternatives()
                .try(
                    Joi.valid(null),
                    Joi.array()
                        .min(1)
                        .items(
                            Joi.number()
                                .min(0)
                                .integer()
                                .less(Joi.ref('$base'))
                        ),
                ),
            accumulator: Joi.number()
                .min(0)
                .integer(),
            options: Joi.object({
                mode: Joi.string().valid(...DecimalDigsGeneratorMode)
            }),
        }),
    }),
}

export const incrementDecimalDigsArrSchema = {
    main: Joi.object({
        decimalDigsArr: Joi.any(),
        positionFromRight: Joi.any()
            .default(0),
        validate: Joi.any()
            .default(false)
    }),
    niche: Joi.object({
        decimalDigsArr: Joi.array()
            .min(1)
            .items(
                Joi.number()
                    .min(0)
                    .integer()
                    .less(Joi.ref('$base'))
            )
            .required(),
        positionFromRight: Joi.number()
            .min(0)
            .integer()
            .required(),
    })
}