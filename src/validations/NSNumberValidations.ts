import Joi from "joi"
import {
    NSNumber,
} from "../NSNumber"
import {
    NumberSystem,
} from "../NumberSystem"
import * as defaultsSchema from "./defaultsSchema"


export const constructorSchema = {
    defaultSetter: defaultsSchema.NSNumberConstructorDefaults,
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
    defaultSetter: defaultsSchema.validateDefaults,
    niche: Joi.object({
        ns: Joi.object()
            .instance(NumberSystem)
            .required(),
    })
}