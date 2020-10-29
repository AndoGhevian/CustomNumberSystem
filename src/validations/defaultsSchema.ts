import Joi from "joi";
import { constructDefaultsSchema } from "../utils";


export const validateDefaults = constructDefaultsSchema({
    validate: false
})

export const decimalDigsGeneratorDefaults = constructDefaultsSchema({
    optional: {
        endDecimalDigsArr: null,
        accumulator: 1,
        options: {
            mode: 'bigint'
        },
    },
    validate: false
})

export const incrementDecimalDigsArrDefaults = constructDefaultsSchema({
    positionFromRight: 0,
    validate: false,
})

export const NSNumberDefaults = constructDefaultsSchema({
    number: Joi.alternatives()
        .try(
            Joi.array()
                .items(
                    Joi.any()
                        .default(0)
                ),
            Joi.any()
                .default(0),
        ),
    validate: false,
})