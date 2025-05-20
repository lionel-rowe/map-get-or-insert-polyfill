import { walk } from '@std/fs'

async function getCode(testPath: string) {
	let code = ''

	for (
		const [fileName, idents] of [
			['assert.js', ['assert']],
			['isConstructor.js', ['isConstructor']],
			['sta.js', ['Test262Error']],
			['propertyHelper.js', ['verifyProperty']],
		] as const
	) {
		code += `${await Deno.readTextFile(`./test262/harness/${fileName}`)}\n${
			idents.map((ident) => `globalThis.${ident} = ${ident}`).join('\n')
		}\n`
	}

	code += `await import('./polyfill.mjs')\n`
	code += `await import('./${testPath}')\n`

	return code
}

for (const className of ['Map', 'WeakMap']) {
	for (const fnName of ['getOrInsert', 'getOrInsertComputed']) {
		Deno.test(`${className}.${fnName}`, async (t) => {
			const path = fnName === 'getOrInsert'
				? `./test262/test/built-ins/${className}/prototype/${fnName}`
				: `./test262/test/staging/upsert/${className}/${fnName}`

			for await (const entry of walk(path)) {
				if (entry.isFile) {
					await t.step(entry.name, async () => {
						const result = await new Deno.Command(Deno.execPath(), {
							args: ['eval', await getCode(entry.path)],
							cwd: Deno.cwd(),
							stderr: 'piped',
						}).spawn().output()

						if (!result.success) throw new Error(new TextDecoder().decode(result.stderr))
					})
				}
			}
		})
	}
}
