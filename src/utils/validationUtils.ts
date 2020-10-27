import Joi, { options } from "joi"


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
        delete mainSucc.validate
        const { error: nicheErr, value: nicheSucc } = objSchema.niche.unknown().validate(validatedResult, {
            errors: { stack: true },
            context
        })
        if (nicheErr) throw nicheErr
        validatedResult = nicheSucc
    }

    return validatedResult
}