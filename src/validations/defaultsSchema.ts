import Joi from "joi";
import { constructDefaultsSchema } from "../utils";


export const validateDefaults = constructDefaultsSchema({
    validate: false
})

export const nsNumberManualGeneratorDefaults = constructDefaultsSchema({
    optional: {
        excludeStart: false,
        onNegativeNull: true,
    },
    validate: false
})

export const nsNumberGeneratorDefaults = constructDefaultsSchema({
    optional: {
        accumulator: 1,
        excludeStart: false,
        excludeEnd: false
    },
    validate: false
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