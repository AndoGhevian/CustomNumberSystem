import Joi from "joi"


/**
 * Validates and set defaults for function arguments.
 * @param obj - object with function arguments to validate.
 * @param objSchema - contains as properties _main_ and _niche_ schemas
 * to validate arguments with.
 * - main - schema for providing defaults.
 * - niche - schema to validate arguments more strictly if needed.
 */
export function validateArguments(obj: { [key: string]: any }, objSchema: {
    main: Joi.ObjectSchema,
    niche: Joi.ObjectSchema,
}) {
    let validatedResult: any
    const { error: mainErr, value: mainSucc } = objSchema.main.validate(obj, {
        errors: { stack: true }
    })
    if (mainErr) throw mainErr
    validatedResult = mainSucc

    if (mainSucc.validate) {
        delete mainSucc.validate
        const { error: nicheErr, value: nicheSucc } = objSchema.niche.unknown().validate(validatedResult, {
            errors: { stack: true }
        })
        if (nicheErr) throw nicheErr
        validatedResult = nicheSucc
    }

    return validatedResult
}