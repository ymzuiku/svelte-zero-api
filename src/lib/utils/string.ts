const invalidCharacters = ['[', '/', '\\', ']', '-', ':', '.', '+', '(', ')', ' ']
/** Replaces `[` `/` `\` `]` `-` `:` `.` with `_` */
export const toValidVariable = (name = '') =>
	name.replaceAll(new RegExp(invalidCharacters.map(m => '\\' + m).join('|'), 'g'), '_')

/** When importing files: We don't add `.ts` in the import-statement */
export const pathToImportPath = (path = '') =>
	path
		.slice(0, -3) // C:\some-path\upload.json.ts → C:\some-path\upload.json
		.replace(/\\/g, '/') // C:\some-path\upload.json.ts → C:/some-path/upload.json