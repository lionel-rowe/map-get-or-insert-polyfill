import { walk } from '@std/fs'
import { getFns } from './implementation.mjs'

const { getOrInsert, getOrInsertComputed } = getFns([])
const staging = [getOrInsertComputed.name]

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

for (const Class of [Map, WeakMap]) {
	for (const fn of [getOrInsert, getOrInsertComputed]) {
		Deno.test(`${Class.name}.${fn.name}`, async (t) => {
			const path = staging.includes(fn.name)
				? `./test262/test/staging/upsert/${Class.name}/${fn.name}`
				: `./test262/test/built-ins/${Class.name}/prototype/${fn.name}`

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
