import { walk } from '@std/fs'
import dedent_ from 'string-dedent'
import { getMethods } from './implementation.mjs'

const dedent = dedent_ as unknown as typeof dedent_.default

const helpers: [fileName: string, idents: string[]][] = [
	['assert.js', ['assert']],
	['isConstructor.js', ['isConstructor']],
	['sta.js', ['Test262Error']],
	['propertyHelper.js', ['verifyProperty']],
]

async function getCode(testPath: string) {
	return dedent`
	${
		(await Promise.all(helpers.map(async ([fileName, idents]) => [
			await Deno.readTextFile(`./test262/harness/${fileName}`),
			...idents.map((ident) => `globalThis.${ident} = ${ident}`),
		]))).flat().join('\n')
	}
	await import('./polyfill.mjs')
	await import('./${testPath}')
	`
}

for (const Class of [Map, WeakMap]) {
	const { getOrInsert, getOrInsertComputed } = getMethods([Class])
	const staging = [getOrInsertComputed.name]

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
