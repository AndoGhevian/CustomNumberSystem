import Joi, { options } from "joi"
import dotProp from 'dot-prop'

/**
 * Validates and set defaults for function arguments.
 * @param obj - object with function arguments to validate.
 * @param objSchema - contains as properties _main_ and _niche_ schemas
 * to validate arguments with.
 * - main - schema for providing defaults.
 * - niche - schema to validate arguments more strictly if needed.
 * @param context - optional context to pass to validate function. See **_Joi_** context.
 */
export function validateArguments(obj: { [key: string]: any }, objSchema: {
    main: Joi.ObjectSchema,
    niche: Joi.ObjectSchema,
}, context?: any) {
    let validatedResult: any
    const { error: mainErr, value: mainSucc } = objSchema.main.validate(obj, {
        errors: { stack: true },
        context
    })
    if (mainErr) throw mainErr
    validatedResult = mainSucc

    if (mainSucc.validate) {
        const { error: nicheErr, value: nicheSucc } = objSchema.niche.unknown().validate(validatedResult, {
            errors: { stack: true },
            context
        })
        if (nicheErr) throw nicheErr
        validatedResult = nicheSucc
    }

    return validatedResult
}


interface DefaulsSchema {
    [key: string]: any | Joi.Schema | DefaulsSchema
}

export function constructDefaultsSchema(defaultsSchema: DefaulsSchema) {
    const schema: { [key: string]: Joi.Schema } = {}
    for (let key in defaultsSchema) {
        if (Joi.isSchema(defaultsSchema[key])) {
            schema[key] = defaultsSchema[key]
        } else if (defaultsSchema[key] !== null
            && typeof defaultsSchema[key] === 'object'
            && defaultsSchema[key].__proto__ === Object.prototype) {
            schema[key] = Joi.alternatives()
                .conditional(
                    Joi.object(),
                    {
                        then: constructDefaultsSchema(defaultsSchema[key]),
                        otherwise: Joi.any()
                    }
                )
        } else {
            schema[key] = Joi.any().default(defaultsSchema[key])
        }
    }

    return Joi.object(schema)
        .unknown()
        .default()
}