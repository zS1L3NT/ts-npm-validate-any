import ObjectValidator from "../validators/ObjectValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter is exactly the same as one of the passed numbers here
 * If no parameter passed, checks if next parameter is of type 'number'
 * @param rule_object Rule
 */
export default <T extends Record<string, Validator<any>>>(
	rule_object?: T
): ObjectValidator<{
	[K in keyof T]: T[K] extends Validator<infer U> ? U : undefined
}> => {
	return new ObjectValidator(rule_object)
}
