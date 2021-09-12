import Reporter from "./Reporter"

const beautify = require("js-beautify").js

export default abstract class Validator {
	public static not_type = `Expected value to be of type: %type%`
	public static not_value = `Expected value to be: %value%`
	public schema = ""

	public abstract validate(data: any, reporter: Reporter): boolean

	/**
	 * A rough gauge of what the schema looks like
	 * Formatting is similar to that of a TypeScript interface
	 *
	 * @return string String of the formatted schema
	 */
	public formatSchema(): string {
		return beautify(this.schema, { indent_size: 4 })
	}

	public replaceText(text: string, object: { [property: string]: any }): string {
		for (const [key, value] of Object.entries(object)) {
			text = text.replaceAll(`%${key}%`, value)
		}

		return text
	}

}