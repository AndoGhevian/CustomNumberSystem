import Joi from "joi";

import * as defaultsSchema from "./defaultsSchema";

import {
    DecimalDigsGeneratorMode
} from "../commonTypes";
import {
    NSNumber
} from "../NSNumber";


export const constructorSchema = {
    defaultSetter: defaultsSchema.validateDefaults,
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
    defaultSetter: defaultsSchema.validateDefaults,
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
    defaultSetter: defaultsSchema.validateDefaults,
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

export const toStringSchema = {
    defaultSetter: defaultsSchema.validateDefaults,
    niche: Joi.object({
        nsNumber: Joi.object()
            .instance(NSNumber)
            .required(),
    })
}

export const addToDecimalDigsArrSchema = {
    defaultSetter: defaultsSchema.validateDefaults,
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
    defaultSetter: defaultsSchema.decimalDigsGeneratorDefaults,
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
    defaultSetter: defaultsSchema.incrementDecimalDigsArrDefaults,
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