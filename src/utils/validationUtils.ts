import Joi from "joi"


/**
 * **NOT SAFE METHOD**
 * 
 * Set _Defaults_ and _Validates_ function arguments.
 * @param obj - object with function arguments to validate.
 * @param objSchema - contains as properties _defaultSetter_ and _niche_ schemas
 * to validate arguments with.
 * - defaultSetter - schema for setting defaults.
 * - niche - schema to validate arguments more strictly if needed.
 * @param context - optional context to pass to validate function. See **_Joi_** context.
 */
export function validateArguments(obj: { [key: string]: any }, objSchema: {
    defaultSetter?: Joi.ObjectSchema,
    niche: Joi.ObjectSchema,
}, context?: any) {
    if (!objSchema.defaultSetter) {
        objSchema.defaultSetter = constructDefaultsSchema({})
    }
    
    let validatedResult: any
    const { error: defaultSetterErr, value: defaultSetterSucc } = objSchema.defaultSetter.validate(obj, {
        errors: { stack: true },
        context
    })
    if (defaultSetterErr) throw defaultSetterErr
    validatedResult = defaultSetterSucc

    if (defaultSetterSucc.validate) {
        const { error: nicheErr, value: nicheSucc } = objSchema.niche.unknown().validate(validatedResult, {
            errors: { stack: true },
            context
        })
        if (nicheErr) throw nicheErr
        validatedResult = nicheSucc
    }

    return validatedResult
}


/**
 * Map of Joi Schemas, objects with default propertie values,
 * or default primitive values, to keys, which **MUST** always succeed.
 */
interface DefaulsSchema {
    [key: string]: any | Joi.Schema | DefaulsSchema
}

/**
 * **NOT SAFE METHOD**
 * 
 * Generates Joi object schema to set defaults on appropriate object.
 * Result of this function can be used in _defaultSetter_ of _objSchema_. (See _validateArguments_ above)
 * @param defaultsSchema - See _DefaultsSchema_ description
 */
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