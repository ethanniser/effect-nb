<script lang="ts">
	import { Presentation, Slide, Media, Code, Step } from '@components'
	import Layout from '@shared/layout.svelte'
	import effectLogo from '@attachments/effect-logo.png'
	import pipeMermaid from '@attachments/pipe-mermaid.png'
	import snorlax from '@attachments/143-Snorlax.webp'
</script>

<Presentation>
	<Slide animate>
		<Layout>
			<h1 class="font-bold text-8xl">Effect for Beginners</h1>
			<img src={effectLogo} alt="logo" class="h-48 w-48" />
			<h3>A guide through Effect's core concepts</h3>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="font-bold text-5xl">Sponsored By:</h1>
			<h3 class="text-3xl">The Effect Team</h3>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lines={false}>
				{`
					npm install effect
					yarn add effect
					pnpm add effect
				`}
			</Code>
			<br />
			<Code lang="ts">
				{`
					import { Effect } from "effect"
				`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>The Effect type</h1>
			<Code lang="ts">
				{`
					type Effect<Requirements, Error, Value> = (
						requirements: Requirements
					) => Error | Value;
				`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>The unit Effect</h1>
			<Code lang="ts">
				{`
					type Unit = Effect<never, never, void>;

					// can think of being like
					const unit = () => {}
				`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>A simple Effect</h1>
			<Code lang="ts">
				{`
					type Simple = Effect<never, Error, number>;
				`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Creating Effects</h1>
			<Code lang="ts" lines="|1-2|4-5">
				{`
					// type: Effect<never, never, number>
					const success = Effect.succeed(42);

					// type: Effect<never, Error, never>
					const failure = Effect.fail(new Error());
				`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Effects compose together</h1>
			<Code lang="ts" lines="|2|3|5|1">
				{`
					function divide(x: number, y: number): Effect.Effect<never, Error, number> {
						if (y === 0) {
							return Effect.fail(new Error("divide by zero"));
						}
						return Effect.succeed(x / y);
					}
			  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Delaying Computations</h1>
			<Code lang="ts">
				{`
					const log = Effect.succeed(console.log("dont do this"));
			  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Synchronous computations</h1>
			<Code lang="ts" lines="|3|4|1">
				{`
					// type: Effect<never, never, number>
					const program = Effect.sync(() => {
						console.log("Hello, World!") // side effect
						return 42 // return value
					})
			  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Synchronous computations that could throw</h1>
			<Code lang="ts" lines="|3|4|1">
				{`
					// type: Effect<never, Error, any>
					const program = Effect.try({
						try: () => JSON.parse(""),
						catch: (_caughtError) => new Error("JSON.parse threw an error"),
					});
			  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Asynchronous computations</h1>
			<Code lang="ts" lines="|1">
				{`
					// type: Effect<never, never, number>
					const promise = Effect.promise(() => Promise.resolve(42));
			    `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Asynchronous computations that could reject</h1>
			<Code lang="ts">
				{`
					// type: Effect<never, Error, Response>
					const response = Effect.tryPromise({
						try: () => fetch("..."),
						catch: (_caughtError) => new Error("fetch rejected"),
					});
			  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Running Effects</h1>
			<Code lang="ts">
				{`
					// type: Effect<never, never, number>
					const program = Effect.sync(() => {
						console.log("Hello, World!")
						return 1
					});
					// Console: <blank>
			  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Running synchronous Effects</h1>
			<Code lang="ts" lines="8-13">
				{`
					// type: Effect<never, never, number>
					const program = Effect.sync(() => {
						console.log("Hello, World!")
						return 1
					});
					// Console: <blank>
					
					// type: number
					const result = Effect.runSync(program);
					// Console: Hello, World!
					
					console.log(result);
					// Console: 1
			  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Running asynchronous Effects</h1>
			<Code lang="ts" lines="6-10">
				{`
					// type: Effect<never, never, number>
					const program = Effect.promise(() => 
						Promise.resolve(42)
					);

					// type: Promise<number>
					const result = Effect.runPromise(program);
					
					result.then(console.log);
					// Console: 1
			  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Effects are composable... so compose them</h1>
			<Code lang="ts" lines="6-10">
				{`
					Effect.succeed(Effect.runSync(myEffect))
					// Please don't do this
			  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Chaining transformations with pipe</h1>
			<Code lang="ts" lines="6-10">
				{`
					const result = pipe(input, func1, func2, ..., funcN)
			  `}
			</Code>
			<img src={pipeMermaid} alt="logo" class="h-14" />
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="1-3|5-6|8">
				{`
					const increment = (x: number) => x + 1
					const double = (x: number) => x * 2
					const subtractTen = (x: number) => x - 10
					
					const result = pipe(5, increment, double, subtractTen)
					// identical to subtractTen(double(increment(5)))
					
					console.log(result) // Output: 2
			  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>The pipe method</h1>
			<Code lang="ts">
				{`
				pipe(effect, func1, func2, ...)
				effect.pipe(func1, func2, ...)
				// These are identical
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Transforming the value of an effect with map</h1>
			<Code lang="ts" lines="|5|1|">
				{`
				// type: Effect<never, never, string>
				const mappedEffect = pipe(
				  Effect.succeed(1),
				  // "x" type: number
				  Effect.map((x) => String(x))
				)
				 
				console.log(Effect.runSync(mappedEffect)) // Output: "1"
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Mapped effect</h1>
			<Code lang="ts" lines="|2|4">
				{`
				const mappedEffect = pipe(
				  Effect.succeed({ x: 5, y: 0 }),
				  Effect.map(({x, y}) =>
						y === 0 ? Effect.fail(new Error("divide by zero")) : Effect.succeed(x/y)
				  )
				)
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>This isn't right</h1>
			<Code lang="ts" lines="7-11">
				{`
				const mappedEffect = pipe(
				  Effect.succeed({ x: 5, y: 0 }),
				  Effect.map(({x, y}) =>
						y === 0 ? Effect.fail(new Error("divide by zero")) : Effect.succeed(x/y)
				  )
				)
				typeof mappedEffect = Effect<
					never, 
					never, 
					Effect<never, Error, number>
				>;
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>We want to the Effects to merge</h1>
			<Code lang="ts">
				{`
				type WhatWeWant = Effect<never, Error, number>;
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Effectful transformations with flatMap</h1>
			<Code lang="ts" lines="4-6|1">
				{`
				// type: Effect<never, Error, number>
				const flatMappedEffect = pipe(
				  Effect.succeed({ x: 5, y: 0 }),
				  Effect.flatMap(({x, y}) =>
						y === 0 ? Effect.fail(new Error("divide by zero")) : Effect.succeed(x/y)
				  )
				)
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="|1-2|4-8|10-11">
				{`
				// type: Effect<never, never, number>
				const getRandomNumber = Effect.sync(() => Math.random() * 10);

				// returns: Effect<never, Error, number>
				const checkIfAtLeastFive = (x: number) =>
				  x > 5 ? 
						Effect.succeed(x) : 
						Effect.fail(new Error("number is less than 5"));

				// returns: Effect<never, never, void>
				const logNumber = (x: number) => Effect.log(x.toString());
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="2-3">
				{`
				const program = pipe(
				  getRandomNumber,
				  // Effect<never, never, number>
				)
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Normal Typescript</h1>
			<Code lang="ts" lines="6-10">
				{`
					// Normal Typescript
					const getRandomNumber = Math.random() * 10;
					getRandomNumber // 6.687255774479639
					getRandomNumber // 6.687255774479639
					getRandomNumber // 6.687255774479639
		    `}
			</Code>
			<h1>Effect</h1>
			<Code lang="ts" lines="6-10">
				{`
					// type: Effect<never, never, number>
					const getRandomNumber = Effect.sync(() => Math.random() * 10);
					Effect.runSync(getRandomNumber) // 5.302813847147179
					Effect.runSync(getRandomNumber) // 6.935519254857123
					Effect.runSync(getRandomNumber) // 3.2272729578006554 
				`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="4-5">
				{`
				const program = pipe(
				  getRandomNumber,
				  // Effect<never, never, number>
				  Effect.map((x) => x * 2),
				  // Effect<never, never, number>
				)
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="6-7">
				{`
				const program = pipe(
				  getRandomNumber,
				  // Effect<never, never, number>
				  Effect.map((x) => x * 2),
				  // Effect<never, never, number>
				  Effect.flatMap((x) => checkIfAtLeastFive(x)),
				  // Effect<never, Error, number>
				)
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="8-9">
				{`
				const program = pipe(
				  getRandomNumber,
				  // Effect<never, never, number>
				  Effect.map((x) => x * 2),
				  // Effect<never, never, number>
				  Effect.flatMap((x) => checkIfAtLeastFive(x)),
				  // Effect<never, Error, number>
				  Effect.flatMap((x) => logNumber(x))
				  // Effect<never, Error, void>
				);
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>The value was consumed by logNumber</h1>
			<Code lang="ts">
				{`
				pipe(
					Effect.succeed(5),
					Effect.flatMap((x) => logNumber(x)),
					Effect.map((x) => x + 1)
					// ^ ERROR: 
					// '+' cannot be applied to types 'void' and 'number'.
				)
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Execute side effects with tap</h1>
			<Code lang="ts" lines="3-5">
				{`
				const program = pipe(
					Effect.succeed(5),
					Effect.tap((x) => logNumber(x)),
					// x is still available!
					Effect.map((x) => x + 1)
				)

				Effect.runSync(program); // 6
				// console: 5
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Consuming multiple Effects with all</h1>
			<Code lang="ts" lines="4-5|">
				{`
				const foo = Effect.succeed(42)
				const bar = Effect.succeed("Hello")
				
				// type: Effect<never, never, [number, string]>
				const combinedEffect = Effect.all([foo, bar])
				
				console.log(Effect.runSync(combinedEffect))
				// console: [42, "Hello"]
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				const foo = Effect.succeed(42)
				const bar = Effect.succeed("Hello")
				
				// type: Effect<never, never, { foo: number, bar: string }>
				const combinedEffect = Effect.all({ foo, bar })
				
				console.log(Effect.runSync(combinedEffect))
				// console: { foo: 43, bar: "Hello" }
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>A real program!</h1>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="text-6xl">Find the heaviest Pokemon!</h1>
			<img src={snorlax} alt="Snorlax" class="h-48" />
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="text-6xl">Find the heaviest Pokemon!</h1>
			<div class="flex flex-row gap-x-16">
				<img src={snorlax} alt="Snorlax" class="h-48" />
				<div class="text-left space-y-5">
					<li>Generate random numbers</li>
					<Step><li>Get Pokemon data from API</li></Step>
					<Step><li>Validate returned JSON</li></Step>
					<Step><li>Find the heaviest Pokemon</li></Step>
				</div>
			</div>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="|1">
				{`
					// type: Effect<never, Error, any>
					const getPokemon = (id: number) =>
						Effect.tryPromise({
								try: () => fetch(\`https://pokeapi.co/api/v2/pokemon/\${id}\`)
									.then((res) => res.json()),
								catch: (e) => new Error("error fetching pokemon: \${e.message}")
						}),
		  	`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>@effect/schema</h1>
			<Code lang="ts" lines="|3-6|8-9">
				{`
					import * as Schema from "@effect/schema/Schema";

					const pokemonSchema = Schema.struct({
						name: Schema.string,
						weight: Schema.number,
					});

					type Pokemon = Schema.To<typeof pokemonSchema>;
					const parsePokemon = Schema.parse(pokemonSchema);
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>validation!</h1>
			<Code lang="ts" lines="9|1">
				{`
				// returns: Effect<never, Error | ParseError, Pokemon>
				const getPokemon = (id: number) =>
				  pipe(
				    Effect.tryPromise({
					    try: () => fetch(\`https://pokeapi.co/api/v2/pokemon/\${id}\`)
								.then((res) => res.json()),
							catch: (e) => new Error("error fetching pokemon: \${e.message}")
				    }),
				    Effect.flatMap((x) => parsePokemon(x))
				  );
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="|4">
				{`
				// type: Effect<never, never, number>[]
				const getRandomNumberArray = 
					Array.from({ length: 10 }, () =>
					    Effect.sync(() => Math.floor(Math.random() * 100) + 1)
					)
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="1">
				{`
					// type: Effect<never, never, number>[]
					const getRandomNumberArray = 
						Array.from({ length: 10 }, () =>
								Effect.sync(() => Math.floor(Math.random() * 100) + 1)
						)
				`}
			</Code>
			<Code lang="ts" lines="1-2">
				{`			
					// type: Effect<never, never, number[]>
					const getRandomNumberArray = Effect.all(
						Array.from({ length: 10 }, () =>
								Effect.sync(() => Math.floor(Math.random() * 100) + 1)
						)
					)
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="3|4|1">
				{`
				// type: Effect<never, Error, Pokemon[]>
				const program = pipe(
					getRandomNumberArray,
					Effect.flatMap((arr) => Effect.all(arr.map(getPokemon)))
				)
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="7">
				{`
				// type: Effect<never, Error, Pokemon[]>
				const program = pipe(
					getRandomNumberArray,
					Effect.flatMap((arr) => Effect.all(arr.map(getPokemon)))
				)

				Effect.runPromise(program).then(console.log)
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lines={false} data-id="new">
				{`
				[
				  { name: 'nidorino', weight: 195 },
				  { name: 'zubat', weight: 75 },
				  { name: 'mankey', weight: 280 },
				  { name: 'ekans', weight: 69 },
				  { name: 'magnemite', weight: 60 },
				  { name: 'dodrio', weight: 852 },
				  { name: 'dodrio', weight: 852 },
				  { name: 'nidorina', weight: 200 },
				  { name: 'tentacruel', weight: 550 },
				  { name: 'charmander', weight: 85 }
				]
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="1-2|7-9">
				{`
				const formatPokemon = (pokemon: Pokemon) =>
				  \`\${pokemon.name} weighs \${pokemon.weight} hectograms\`;

				const program = pipe(
				  getRandomNumberArray,
				  Effect.flatMap((arr) => Effect.all(arr.map(getPokemon)))
				  Effect.tap((pokemons) =>
				    Effect.log("\\n" + pokemons.map(formatPokemon).join("\\n"))
				  ),
				);
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines={false}>
				{`
				const calculateHeaviestPokemon = (pokemons: Pokemon[]) =>
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="3-7|5|1">
				{`
				// return type: Effect<never, Error, number>
				const calculateHeaviestPokemon = (pokemons: Pokemon[]) =>
				  Effect.reduce(pokemons, 0, (highest, pokemon) =>
						pokemon.weight === highest
							? Effect.fail(new Error("two pokemon have the same weight!"))
							: Effect.succeed(pokemon.weight > highest ? pokemon.weight : highest)
				  );
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				const program = pipe(
				  getRandomNumberArray,
				  Effect.flatMap((arr) => Effect.all(arr.map(getPokemon))),
				  Effect.tap((pokemons) =>
						Effect.log("\\n" + pokemons.map(formatPokemon).join("\\n"))
				  ),
				  // Effect<never, Error, Pokemon[]>
				);
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="8-13">
				{`
				const program = pipe(
				  getRandomNumberArray,
				  Effect.flatMap((arr) => Effect.all(arr.map(getPokemon))),
				  Effect.tap((pokemons) =>
						Effect.log("\\n" + pokemons.map(formatPokemon).join("\\n"))
				  ),
				  // Effect<never, Error, Pokemon[]>
				  Effect.flatMap((pokemons) => calculateHeaviestPokemon(pokemons)),
				  // Effect<never, Error, number>
				  Effect.flatMap((heaviest) =>
						Effect.log(\`The heaviest pokemon weighs \${heaviest} hectograms!\`)
				  )
				  // Effect<never, Error, void>
				);
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="8-13">
				{`
				// type: Effect<never, Error, void>
				const program = pipe(
					// ...
				);
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code>
				{`
				timestamp=2023-... level=INFO fiber=#0 message="
				hypno weighs 756 hectograms
				raichu weighs 300 hectograms
				krabby weighs 65 hectograms
				charmander weighs 85 hectograms
				farfetchd weighs 150 hectograms
				slowpoke weighs 360 hectograms
				tentacruel weighs 550 hectograms
				golbat weighs 550 hectograms
				paras weighs 54 hectograms
				zubat weighs 75 hectograms"
				timestamp=2023-... level=INFO fiber=#0
				message="The heaviest pokemon weighs 756 hectograms!"
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="font-bold text-8xl">Generators</h1>
			<h3>async/await for Effect</h3>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="|4|1,6|3|">
				{`
				declare const imAnEffect: Effect<never, Error, number>;

				// type: Effect<never, Error, string>
				const program = Effect.gen(function* (_) {
					// type: number
					const valueOfEffect = yield* _(imAnEffect);
					return String(valueOfEffect);
				})
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Before:</h1>
			<Code lang="ts">
				{`
				const program = pipe(
				  getRandomNumber,
				  // Effect<never, never, number>
				  Effect.map((x) => x * 2),
				  // Effect<never, never, number>
				  Effect.flatMap((x) => checkIfAtLeastFive(x)),
				  // Effect<never, Error, number>
				  Effect.flatMap((x) => logNumber(x))
				  // Effect<never, Error, void>
				);
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>After:</h1>
			<Code lang="ts" lines="|5|4">
				{`
				// type: Effect<never, Error, void>
				const after = Effect.gen(function* (_) {
					const x = yield* _(getRandomNumber);
					const y = x * 2;
					const z = yield* _(checkIfAtLeastFive(y));
					yield* _(logNumber(z));
				});
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Generators are Optional</h1>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="|4-11|13">
				{`
				// type: Effect<never, Error, Pokemon>
				const getPokemon = (id: number) =>
				  Effect.gen(function* (_) {
						const res = yield* _(
							Effect.tryPromise({
								try: () =>
									fetch(\`https://pokeapi.co/api/v2/pokemon/\${id}\`).then((res) =>
									res.json()
									),
								catch: () => new Error("error fetching pokemon"),
							})
						);
						return yield* _(parsePokemon(res));
				  });
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				// type: Effect<never, Error, void>
				const program = Effect.gen(function* (_) {
				  const arr = yield* _(getRandomNumberArray);
				  const pokemons = yield* _(Effect.all(arr.map(getPokemon)));
				  yield* _(Effect.log("\\n" + pokemons.map(formatPokemon).join("\\n")));
				  
				  const heaviest = yield* _(calculateHeaviestPokemon(pokemons));
				  yield* _(
						Effect.log(\`The heaviest pokemon weighs \${heaviest} hectograms!\`)
					);
				});
		  `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="font-bold text-8xl">Error Handling</h1>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
					type Effect<Requirements, Error, Value> = (
						requirements: Requirements
					) => Error | Value;
		    `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
					Effect.fail(new Error("two pokemon have the same weight!"))
		    `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="|2,6">
				{`
					type DivideByZeroError = {
						readonly _tag: "DivideByZeroError"
					}

					type HttpError = {
						readonly _tag: "HttpError",
						readonly statusCode: number;
					}
		    `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
					class DivideByZeroError {
						readonly _tag = "DivideByZeroError"
					}

					class HttpError {
						readonly _tag = "HttpError"
						constructor(readonly statusCode: number) {}
					}

					Effect.fail(new DivideByZeroError());
					Effect.fail(new HttpError(404));
		    `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Catching Errors</h1>
			<Code lang="ts" lines="1,3">
				{`
					declare const mayError: Effect.Effect<
						never,
						DivideByZeroError | HttpError,
						string
					>;
		    `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Catching All Errors</h1>
			<Code lang="ts" lines="3-5|1">
				{`
					// type: Effect<never, never, string>
					const caughtAll = mayError.pipe(
						// "error" type: DivideByZeroError | HttpError
						Effect.catchAll((error) =>
							Effect.succeed(\`Recovering from any Error (\${error._tag})\`)
						)
					);
		    `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Catching Specific Errors</h1>
			<Code lang="ts">
				{`
					// type: Effect<never, DivideByZeroError, string>
					const caughtTag = mayError.pipe(
						// "e" type: HttpError
						Effect.catchTag("HttpError", (httpError) =>
							Effect.succeed(
								\`recovering from httpError with status: \${httpError.statusCode}\`
							)
						)
					);
		    `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Catching multiple Specific Errors</h1>
			<Code lang="ts">
				{`
					// type: Effect<never, never, string>
					const caughtTags = mayError.pipe(
						Effect.catchTags({
							HttpError: (httpError) =>
								Effect.succeed(
									\`recovering from httpError with status: \${httpError.statusCode}\`
								),
							DivideByZeroError: () =>
								Effect.succeed("recovering from divideByZeroError"),
						})
					);
		    `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Short Circuiting</h1>
			<Code lang="ts" lines="|2|3,12-15">
				{`
					const operation1 = Effect.sync(() => console.log("operation1"))
					const operation2 = Effect.fail(new Error("Something went wrong!"))
					const operation3 = Effect.sync(() => console.log("operation3"))

					Effect.runSync(
						operation1.pipe(
							Effect.flatMap(() => operation2),
							Effect.flatMap(() => operation3) 
							// This ^^ computation won't be executed because the previous one fails
						)
					)
					/* console:
					operation1
					<UNCAUGHT ERROR>...
					*/
		    `}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="font-bold text-7xl">Pokemon Error Handling!</h1>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="3-9">
				{`
				// returns: Effect<never, Error, Pokemon>
				const getPokemon = (id: number) =>
					pipe(
						Effect.tryPromise({
							try: () =>
								fetch(\`https://pokeapi.co/api/v2/pokemon/\${id}\`).then((res) =>
									res.json()
								),
							catch: () => new Error("error fetching pokemon"),
						}),
						Effect.flatMap(parsePokemon)
					);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				class FetchError {
					readonly _tag = "FetchError";
				}

				class JSONError {
					readonly _tag = "JSONError";
				}
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="3-9">
				{`
				const getPokemon = (id: number) =>
					pipe(
						Effect.tryPromise({
							try: () =>
								fetch(\`https://pokeapi.co/api/v2/pokemon/\${id}\`).then((res) =>
									res.json()
								),
							catch: () => new Error("error fetching pokemon"),
						}),
						Effect.flatMap(parsePokemon)
					);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="3-7">
				{`
				const getPokemon = (id: number) =>
					pipe(
						Effect.tryPromise({
							try: () => fetch(\`https://pokeapi.co/api/v2/pokemon/\${id}\`),
							catch: () => new FetchError(),
						}),
						// Effect<never, FetchError, Response>
						Effect.flatMap(parsePokemon)
					);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="8-14">
				{`
				const getPokemon = (id: number) =>
					pipe(
						Effect.tryPromise({
							try: () => fetch(\`https://pokeapi.co/api/v2/pokemon/\${id}\`),
							catch: () => new FetchError(),
						}),
						// Effect<never, FetchError, Response>
						Effect.flatMap((response) =>
							Effect.tryPromise({
								try: () => response.json(),
								catch: () => new JSONError(),
							})
						),
						// Effect<never, FetchError | JSONError, any>
						Effect.flatMap(parsePokemon)
					);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="1">
				{`
				// returns: Effect<never, FetchError | JSONError | ParseError, Pokemon>
				const getPokemon = (id: number) =>
					pipe(
						Effect.tryPromise({
							try: () => fetch(\`https://pokeapi.co/api/v2/pokemon/\${id}\`),
							catch: () => new FetchError(),
						}),
						Effect.flatMap((response) =>
							Effect.tryPromise({
								try: () => response.json(),
								catch: () => new JSONError(),
							})
						),
						Effect.flatMap((x) => parsePokemon(x))
					);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				class SameWeightError {
					readonly _tag = "SameWeightError";
					constructor(readonly weight: number) {}
				}
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="6,10">
				{`
				class SameWeightError {
					readonly _tag = "SameWeightError";
					constructor(readonly weight: number) {}
				}

				// type: Effect<never, SameWeightError, number>
				const calculateHeaviestPokemon = (pokemons: Pokemon[]) =>
					Effect.reduce(pokemons, 0, (highest, pokemon) =>
						pokemon.weight === highest
							? Effect.fail(new SameWeightError(pokemon.weight))
							: Effect.succeed(pokemon.weight > highest ? pokemon.weight : highest)
					);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="1">
				{`
				// Effect<never, SameWeightError | ParseError | FetchError | JSONError, void>
				const program = pipe(
					Effect.all(getRandomNumberArray(10).map(getPokemon)),
					Effect.tap((pokemons) =>
						Effect.sync(
							() => console.log(pokemons.map(formatPokemon).join("\\n"), "\\n")
						)
					),
					Effect.flatMap(calculateHeaviestPokemon),
					Effect.map((heaviest) =>
						console.log(\`The heaviest pokemon weighs \${heaviest} hectograms!\`)
					)
				);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="1,8-10">
				{`
				// Effect<never, ParseError | FetchError | JSONError, void>
				const program = pipe(
					Effect.all(getRandomNumberArray(10).map(getPokemon)),
					Effect.tap((pokemons) =>
						Effect.sync(() => console.log(pokemons.map(formatPokemon).join("\\n"), "\\n"))
					),
					Effect.flatMap(calculateHeaviestPokemon),
					Effect.catchTag("SameWeightError", (e) =>
						Effect.log(\`Two pokemon have the same weight: \${e.weight}\`)
					),
					Effect.map((heaviest) =>
						console.log(\`The heaviest pokemon weighs \${heaviest} hectograms!\`)
					)
				);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="1">
				{`
				// Effect<never, FetchError | JSONError | ParseError, Pokemon>
				const getPokemon = (id: number) =>
					pipe(
						Effect.tryPromise({
							try: () => fetch(\`https://pokeapi.co/api/v2/pokemon/\${id}\`),
							catch: () => new FetchError(),
						}),
						Effect.flatMap((response) =>
							Effect.tryPromise({
								try: () => response.json(),
								catch: () => new JSONError(),
							})
						),
						Effect.flatMap((x) => parsePokemon(x))
					);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="1,15">
				{`
				// Effect<never, never, Pokemon>
				const getPokemon = (id: number) =>
					pipe(
						Effect.tryPromise({
							try: () => fetch(\`https://pokeapi.co/api/v2/pokemon/\${id}\`),
							catch: () => new FetchError(),
						}),
						Effect.flatMap((response) =>
							Effect.tryPromise({
								try: () => response.json(),
								catch: () => new JSONError(),
							})
						),
						Effect.flatMap(parsePokemon),
						Effect.catchAll(() => Effect.succeed({ name: "default", weight: 0 }))
					);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="1">
				{`
				// Effect<never, never, void>
				const program = pipe(
					// ...
				);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Error Handling in Generators</h1>
			<Code lang="ts" lines="1,7-9">
				{`
				// Effect<never, FetchError | JSONError | ParseError, Pokemon>
				const getPokemon = (id: number) =>
					Effect.gen(function* (_) {
						const response = yield* _(...);
						const json = yield* _(...);
						return yield* _(parsePokemon(json));
					})
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Error Handling in Generators</h1>
			<Code lang="ts" lines="1,7-9">
				{`
				// Effect<never, never, Pokemon>
				const getPokemon = (id: number) =>
					Effect.gen(function* (_) {
						const response = yield* _(...);
						const json = yield* _(...);
						return yield* _(parsePokemon(json));
					}).pipe(
						Effect.catchAll(() => Effect.succeed({ name: "default", weight: 0 }))
					);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="1">
				{`
				// type: Effect<never, SameWeightError, void>
				const program = Effect.gen(function* (_) {
					// ...
					const heaviest = yield* _(calculateHeaviestPokemon(pokemons));
  				yield* _(
						Effect.log(\`The heaviest pokemon weighs \${heaviest} hectograms!\`)
					);
				})
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="1,8-12">
				{`
				// type: Effect<never, never, void>
				const program = Effect.gen(function* (_) {
					// ...
					const heaviest = yield* _(calculateHeaviestPokemon(pokemons));
  				yield* _(
						Effect.log(\`The heaviest pokemon weighs \${heaviest} hectograms!\`)
					);
				}).pipe(
					Effect.catchTag("SameWeightError", (e) =>
						Effect.log(\`Two pokemon have the same weight: \${e.weight}\`)
					)
				);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="5-8">
				{`
				// type: Effect<never, never, void>
				const program = Effect.gen(function* (_) {
					// ...

					// type: Either<SameWeightError, Pokemon>
					const heaviestResult = yield* _(
						Effect.either(calculateHeaviestPokemon(pokemons))
					);
				})
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" offset="10" lines="|4-10|11-16">
				{`
				const heaviestResult = yield* _(
					Effect.either(calculateHeaviestPokemon(pokemons))
				);

				if (Either.isLeft(heaviestResult)) {
					yield* _(
						Effect.log(
							\`Two pokemon have the same weight: \${heaviestResult.left.weight}\`
						)
					);
				} else {
					yield* _(
						Effect.log(
							\`The heaviest pokemon weighs \${heaviestResult.right} hectograms!\`
						)
					);
				}
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="2">
				{`
				Effect.tryPromise({
					try: () => fetch(\`https://pokeapi.co/api/v2/pokemon/\${id}\`),
					catch: () => new FetchError(),
				}),
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				const getPokemon = (id: number, client: PokemonClient) =>
					pipe(
						client.pokemon.getById(id),
						// ...
					)
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="font-bold text-8xl">Adding Requirements</h1>
			<h3>(dependency injection)</h3>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="|2|3">
				{`
				interface Random {
					readonly _tag: "Random"
					readonly next: Effect.Effect<never, never, number>
				}
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				import { Effect, Context } from "effect"
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="8">
				{`
				import { Effect, Context } from "effect"

				interface Random {
					readonly _tag: "Random"
					readonly next: Effect.Effect<never, never, number>
				}

				const Random = Context.Tag<Random>("@app/Random")
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="3-4|1">
				{`
				// type: Effect<Random, never, void>
				const program = pipe(
					Random,
					Effect.flatMap((random) => random.next),
					Effect.flatMap(
						(randomNumber) => Effect.log(\`random number: \${randomNumber}\`)
					)
				)
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				// type: Effect<Random, never, void>
				const program = pipe(
					Random,
					// ...
				)

				Effect.runSync(program)
				// ERROR! Type 'Random' is not assignable to type 'never'
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="3-6|1,9">
				{`
				// type: Effect<never, never, number>
				const runnable = program.pipe(
					Effect.provideService(
						Random,
						Random.of({ _tag: "Random", next: Effect.sync(() => Math.random()) })
					)
				);

				Effect.runSync(runnable);
				// console: random number: 0.8132812328994277
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="|3-4">
				{`
				type PokemonClient = {
					_tag: "PokemonClient";
					getById: (id: number) => 
						Effect.Effect<never, FetchError | JSONError | ParseError, Pokemon>;
				};

				const PokemonClient = Context.Tag<PokemonClient>("@app/PokemonClient");
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="|4-5|6|1">
				{`
				// return type: Effect<PokemonClient, never, Pokemon>
				const getPokemon = (id: number) =>
					pipe(
						PokemonClient,
						Effect.flatMap((client) => client.getById(id)),
						Effect.catchAll(() => Effect.succeed({ name: "default", weight: 0 }))
					);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="1-2,12|3-10">
				{`
				program.pipe(
					Effect.provideService(PokemonClient, {
						getById: (id) =>
							pipe(
								Effect.tryPromise(...),
								Effect.flatMap((response) =>
									Effect.tryPromise(...)
								),
								Effect.flatMap(parsePokemon)
							),
					}),
					Effect.runPromise
				);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="|3|4">
				{`
				const getPokemon = (id: number) =>
					Effect.gen(function* (_) {
						const client = yield* _(PokemonClient);
						return yield* _(client.getById(id));
					}).pipe(
						Effect.catchAll(() => Effect.succeed({ name: "default", weight: 0 }))
					);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="font-bold text-7xl">Logging</h1>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				// type: Effect<never, never, void>
				const program = Effect.log("Application started")

				Effect.runSync(program)
				/*
				Output:
				timestamp=2023-07-05T09:14:53.275Z level=INFO fiber=#0 
				message="Application started"
				*/
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				const logLevels = pipe(
				  Effect.log("info by default"),
				  Effect.flatMap(() => Effect.logDebug("debug")),
				  Effect.flatMap(() => Effect.logInfo("info")),
				  Effect.flatMap(() => Effect.logWarning("warning")),
				  Effect.flatMap(() => Effect.logError("error")),
				  Effect.flatMap(() => Effect.logFatal("fatal"))
				);

				Effect.runSync(logLevels);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				const logLevels = pipe(
				  Effect.log("info by default"),
				  Effect.flatMap(() => Effect.logDebug("debug")),
				  Effect.flatMap(() => Effect.logInfo("info")),
				  Effect.flatMap(() => Effect.logWarning("warning")),
				  Effect.flatMap(() => Effect.logError("error")),
				  Effect.flatMap(() => Effect.logFatal("fatal"))
				);

				Effect.runSync(logLevels);
			`}
			</Code>
			<Code>
				{`
					timestamp=2023-... level=INFO fiber=#1 message="info by default"
					timestamp=2023-... level=INFO fiber=#1 message=info
					timestamp=2023-... level=WARN fiber=#1 message=warning
					timestamp=2023-... level=ERROR fiber=#1 message=error
					timestamp=2023-... level=FATAL fiber=#1 message=fatal
				`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="5">
				{`
				import { Effect, Logger, LoggerLevel, pipe } from "effect";

				const logDebug = pipe(
				  Effect.logDebug("debug"),
				  Logger.withMinimumLogLevel(LoggerLevel.Debug)
				);

				Effect.runSync(logDebug);
			`}
			</Code>
			<Code>
				{`
					timestamp=2023-... level=DEBUG fiber=#2 message=debug
				`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1>Timing Things!</h1>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="3-5">
				{`
				// type: Effect<never, never, void>
				const program = pipe(
				  Effect.sleep("1 seconds"),
				  Effect.flatMap(() => Effect.log("The job is finished!")),
				  Effect.withLogSpan("myspan")
				)

				Effect.runPromise(program)
			`}
			</Code>
			<Code lines="2">
				{`
					timestamp=2023-... level=INFO fiber=#0 
					message="The job is finished!" myspan=1011ms
				`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="4">
				{`
				const program = pipe(
				  // ...
					Effect.catchTag("SameWeightError", (e) =>
						Effect.log(\`Two pokemon have the same weight: \${e.weight}\`)
					),
				  Effect.flatMap((heaviest) =>
						Effect.log(\`The heaviest pokemon weighs \${heaviest} hectograms!\`)
					),
				);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts" lines="4,9-10">
				{`
				const program = pipe(
				  // ...
					Effect.catchTag("SameWeightError", (e) =>
						Effect.logError(\`Two pokemon have the same weight: \${e.weight}\`)
					),
				  Effect.flatMap((heaviest) =>
						Effect.log(\`The heaviest pokemon weighs \${heaviest} hectograms!\`)
					),
					Effect.tap(() => Effect.log("program finished")),
					Effect.withLogSpan("program")
				);
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code>
				{`
				...
				
				timestamp=2023-07-27T03:51:48.296Z level=INFO fiber=#0 
				message="program finished" program=454ms
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				Effect.all(arr.map(getPokemon))
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="ts">
				{`
				Effect.all(arr.map(getPokemon), {
				    concurrency: "unbounded",
				})
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code>
				{`
				timestamp=2023-07-27T03:52:53.068Z level=INFO fiber=#0 
				message="program finished" program=208ms
			`}
			</Code>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="text-6xl font-bold">Effects</h1>
			<div class="text-left space-y-5">
				<Step><li>the description of a program</li></Step>
				<Step><li>may have some requirements</li></Step>
				<Step><li>yields a value or an error when run</li></Step>
			</div>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="text-6xl font-bold">Creating Effects</h1>
			<div class="text-left space-y-5">
				<Step><li>From a value: <i>succeed</i> and <i>fail</i></li></Step>
				<Step><li>From a function (or side effects)</li></Step>
				<Step>
					<div class="ml-20">
						<li>
							<b>Synchronous</b>: <i>sync</i> and <i>try</i> for catching errors
						</li>
					</div>
				</Step>
				<Step>
					<div class="ml-16">
						<li>
							<b>Asynchronous</b>: <i>promise</i> and <i>tryPromise</i> for handling
							rejections
						</li>
					</div>
				</Step>
			</div>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="text-6xl font-bold">Running Effects</h1>
			<div class="text-left space-y-5">
				<Step><li>(for <i>{'Effect<R, E, A>'}</i>)</li></Step>
				<Step><li>Synchronous: <i>runSync</i></li></Step>
				<Step
					><div class="ml-20">
						<li>
							returns <i>A</i> or throws <i>E</i>
						</li>
					</div></Step
				>
				<Step
					><div class="ml-20">
						<li>throws if anything async</li>
					</div></Step
				>
				<Step><li>Asynchronous: <i>runPromise</i></li></Step>
				<Step
					><div class="ml-20">
						<li>
							returns <i>{'Promise<A>'}</i> that may reject with <i>E</i>
						</li>
					</div></Step
				>
			</div>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="text-6xl font-bold">Pipelines</h1>
			<div class="text-left space-y-5">
				<Step><li>Apply successive transformations with <i>pipe</i></li></Step>
				<Step><li>Modify the value with <i>map</i></li></Step>
				<Step
					><li>
						Modify the value or introduce errors with <i>flatMap</i>
					</li></Step
				>
				<Step><li>Use the value but ignore the result with <i>tap</i></li></Step
				>
				<Step
					><li>Combine the value of multiple effects with <i>all</i></li></Step
				>
			</div>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="text-6xl font-bold">Generators</h1>
			<div class="text-left space-y-5">
				<Step><li>alternative syntax similar to async/await</li></Step>
				<Step><li>completely optional</li></Step>
				<Step
					><li>
						<i>{'Effect.gen(function* (_) { yield* _(effect); }'}</i>
					</li></Step
				>
			</div>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="text-6xl font-bold">Error Handling</h1>
			<div class="text-left space-y-5">
				<Step><li>Errors "short circuit" normal execution immediately</li></Step
				>
				<Step
					><li>
						"<i>readonly _tag: string</i>" field to discriminate types
					</li></Step
				>
				<Step><li>Catching errors</li></Step>
				<Step
					><div class="ml-20">
						<li>
							All errors: <i>catchAll</i>
						</li>
					</div></Step
				>
				<Step
					><div class="ml-20">
						<li>Specific error: <i>catchTag</i></li>
					</div></Step
				>
				<Step
					><div class="ml-20">
						<li>Multiple specific errors: <i>catchTags</i></li>
					</div></Step
				>
			</div>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="text-6xl font-bold">Adding Requirements</h1>
			<div class="text-left space-y-5">
				<Step><li>(for <i>{'Effect<R, E, A>'}</i>)</li></Step>
				<Step
					><li>
						<i>{'Context.Tag<T>'}</i> creates a placeholder that we can use in
						our pipelines and adds <i>T</i> to the <i>R</i> field of the Effect
					</li></Step
				>
				<Step
					><li>
						An Effect whose <i>R</i> isn't <i>never</i> cannot be run
					</li></Step
				>
				<Step><li><i>Effect.provideService</i> fills that placeholder</li></Step
				>
				<Step><li>can be done anywhere before the effect is run</li></Step>
			</div>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="text-6xl font-bold">Logging</h1>
			<div class="text-left space-y-5">
				<Step><li><i>Effect.log*</i></li></Step>
				<Step
					><div class="ml-20">
						<li>Debug, Info, Warning, Error, Fatal</li>
					</div></Step
				>
				<Step
					><div class="ml-20">
						<li>The minimum log level can be modified</li>
					</div></Step
				>
				<Step><li><i>Effect.withLogSpan</i> for timing things</li></Step>
			</div>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="text-7xl font-bold">Effect is really big</h1>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<h1 class="text-5xl font-bold">Additional Resources</h1>
			<div class="text-left space-y-5 text-md">
				<Step
					><li>Effect Docs</li>
					<div class="ml-20 text-base">
						<li>
							This video has a lot of overlap with the "Effect Essentials"
							sections
						</li>
					</div></Step
				>
				<Step
					><li>Effect API Reference</li>
					<div class="ml-20 text-base">
						<li>
							The type signatures can look a bit scary, but don't be afraid to
							look something up in here
						</li>
					</div></Step
				>
				<Step
					><li>Effect Discord</li>
					<div class="ml-20 text-base">
						<li>Dedicated beginner channels to help you!</li>
					</div></Step
				>
				<Step
					><li>Github repo containing the code in this video</li>
					<div class="ml-20 text-base">
						<li>Insert link to the Github repository here.</li>
					</div></Step
				>
			</div>
		</Layout>
	</Slide>

	<Slide animate>
		<Layout>
			<Code lang="typescript" lines={false}>
				{`
					  console.log("till next time")
					`}
			</Code>
		</Layout>
	</Slide>
</Presentation>
