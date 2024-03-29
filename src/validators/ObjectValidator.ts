import Locator from "../classes/Locator"
import UndefinedValidator from "./UndefinedValidator"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class ObjectValidator<T> extends Validator<T> {
	public static readonly MISSING_PROPERTY = `Object requires this property but is missing`
	public static readonly UNKNOWN_PROPERTY = `Object has unknown property which is defined`
	private readonly rule_object?: { [property: string]: Validator<T> }

	public constructor(rule_object?: { [property: string]: Validator<T> }) {
		super()

		this.rule_object = rule_object
		if (rule_object) {
			if (Object.keys(rule_object).length === 0) {
				this.schema = `{"$type":"object"}`
			} else {
				this.schema = `{"$type":"object","$properties":{`
				for (const rule_key in rule_object) {
					const rule_value = rule_object[rule_key]
					this.schema += `"${rule_key}":${rule_value!.schema},`
				}
				this.schema = this.schema.slice(0, -1)
				this.schema += `}}`
			}
		} else {
			this.schema = `{"$type":"object","$properties":{"$any":{"$type":"any"}}}`
		}
	}

	public validate(data: any, locator: Locator): iValidationResult<T> {
		if (typeof data !== "object" || Array.isArray(data) || data === null) {
			return this.failure(locator, Validator.WRONG_TYPE, this, data)
		}

		if (!this.rule_object) return this.success(data)

		let result = this.success(data)
		for (const [ruleKey, ruleValue] of Object.entries(this.rule_object)) {
			const traversedLocator = locator.traverse(ruleKey)
			const ruleRejectsUndefined = !ruleValue.validate(
				undefined,
				traversedLocator
			).success

			if (!Object.keys(data).includes(ruleKey) && ruleRejectsUndefined) {
				result = {
					success: false,
					errors: [
						...result.errors,
						...this.failure(
							traversedLocator,
							ObjectValidator.MISSING_PROPERTY,
							ruleValue,
							undefined
						).errors
					],
					data: undefined
				}
			}
		}

		for (const [dataKey, dataValue] of Object.entries(data)) {
			const traversedLocator = locator.traverse(dataKey)
			const rule = this.rule_object[dataKey]

			if (!rule) {
				result = {
					success: false,
					errors: [
						...result.errors,
						...this.failure(
							traversedLocator,
							ObjectValidator.UNKNOWN_PROPERTY,
							new UndefinedValidator(),
							dataValue
						).errors
					],
					data: undefined
				}
				continue
			}

			if (!rule.validate(dataValue, traversedLocator).success) {
				result = {
					success: false,
					errors: [
						...result.errors,
						...this.failure(
							traversedLocator,
							Validator.WRONG_TYPE,
							rule,
							dataValue
						).errors
					],
					data: undefined
				}
			}
		}

		return result
	}
}
