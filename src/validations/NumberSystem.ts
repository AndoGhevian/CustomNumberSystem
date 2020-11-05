import Joi from "joi";
import * as defaultsSchema from "./defaultsSchema";
import { OptimizaionMode } from "../commonTypes";

import { NSNumber } from "../NSNumber";
import { SystemDigitsConfigSchema } from "./SystemDigitsConfig";


export const NumberSystemSchema = {
    defaultSetter: defaultsSchema.NumberSystemDefaults,
    niche: Joi.object({
        digits: Joi.alternatives()
            .try(
                Joi.array()
                    .min(2)
                    .items(
                        Joi.string()
                            .min(1)
                    )
                    .unique(),
                SystemDigitsConfigSchema,
            )
            .required(),
        optimization: Joi.string()
            .valid(...OptimizaionMode)
    })
}

export const decimalToDecDigitsArrSchema = {
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

export const decDigitsArrToDecimalSchema = {
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

export const countDigitsStaticSchema = {
    niche: Joi.object({
        base: Joi.number()
            .min(2)
            .integer()
            .required(),
        nsNumber: Joi.object()
            .instance(NSNumber)
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

export const nsNumberManualGeneratorSchema = {
    defaultSetter: defaultsSchema.nsNumberManualGeneratorDefaults,
    niche: Joi.object({
        startNsNumber: Joi.object()
            .instance(NSNumber)
            .required(),
        accumulator: Joi.function()
            .required(),
        optional: Joi.object({
            excludeStart: Joi.boolean(),
            onNegativeNull: Joi.boolean(),
        }),
    }),
}

export const nsNumberGeneratorSchema = {
    defaultSetter: defaultsSchema.nsNumberGeneratorDefaults,
    niche: Joi.object({
        startNsNumber: Joi.object()
            .instance(NSNumber)
            .required(),
        optional: Joi.object({
            endNsNumber: Joi.object()
                .instance(NSNumber),
            accumulator: Joi.number()
                .integer()
                .invalid(0),
            excludeStart: Joi.boolean(),
            excludeEnd: Joi.boolean(),
        }),
    }),
}

export const NumberSchema = {
    defaultSetter: defaultsSchema.NSNumberDefaults,
    niche: Joi.object({
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

export const minMaxInRankSchema = {
    niche: Joi.object({
        rank: Joi.number()
            .min(1)
            .integer()
            .required()
    })
}