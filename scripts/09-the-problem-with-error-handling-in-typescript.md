typescript has empowered our code in so many ways
but its typesafety has limits, and these are most obvious when it comes to error handling
its not really typescripts fault through, exceptions are just a part of javascript- any code can throw a value of any type at literally any time

exceptions have their merits- they remove the need to handle errors by default and usually immediately crash the entire program, which is actually great if your writing small scripts

but as we all know we arent using javascript to just write small scripts anymore, we are writing enormous and complex applcations- where having strong error handling patterns really starts to matter

well then, you say, we have typed return statements, just add typed throws statements- easy peasy

well... its not that easy. The typescript team has rejected such a proposal repeatedly, but why!?


It comes down to the difference between expected and unexpected errors

Expected errors are of course, expected
we create them purposefully as part of our logic, and handle them intentionally where required
this all means that we know what types they could possibly be, because we created them

for example if we have a division function that could throw a division error we could imagine it looking something like this:
```ts
function divide(a: number, b: number): number throws DivideByZeroError {
	if (b === 0) {
		throw new DivideByZeroError({ a, b })
	}
	return a / b
}
```

and using it looks like this:
```ts
try {
	const result = divide(a, b)
	console.log(result)
} catch (e: unknown) {
	console.error(`attempted to divide ${e.a} by ${e.b}`)
}
```

but we are already getting an error here, why is that?

because `e` isnt of type `DivideByZeroError` its of type `unknown`
and you know we can work around that like this right:

```ts
try {
	const result = divide(a, b)
	console.log(result)
} catch (e: unknown) {
	if (e instanceof DivideByZeroError) {
		console.error(`attempted to divide ${e.a} by ${e.b}`)
	}
	throw e
}
```

but your probably saying "well ethan of course its unknown, the throws declaration feature isnt real"

but youd actually be wrong- even if the throws delcarations was a feature `e` is still of type `unknown`

but how is that possible? remember when I said there are two kinds of errors? the second one, the unexpected errors is the problem

unexpected errors are just that, unexpected- they could happen at any time for any reason and usually result in the end of our program

that sounds exactly like exceptions right? its because it is
but that doesnt mean that they are the same thing, many other languages without exceptions still have ways to "handle" unexpected errors, go/rust have a 'panic' for this

the difference is that they dont *also* handle expected errors that way- they have seperate patterns for that *(cough go std cough)*
...but javascript does and thats the key issue here

anytime we catch, we could be catching an unexpected error whose type is always unknown
so even if the throws declaration feature exists we only go from `unknown` to `unknown | DivideByZeroError`

```ts
try {
	const result = divide(a, b)
	console.log(result)
} catch (e: unknown | DivideByZeroError) {
	if (e instanceof DivideByZeroError) {
		console.error(`attempted to divide ${e.a} by ${e.b}`)
	}
	throw e
}
```

but notice how even if thats the case our code doesnt actually change at all
because the union of `unknown` and some type is still just `unknown`

think about it, unknown is the union of all possible types- it could be a number or a string, or a object- litterally anything

so by saying "hey this unknown could also be a DivideByZeroError" we have actually gained zero additional type level information

we have gained some information through, what errors we might what to check for- but think about it, theres really no reason this couldnt be a jsdoc comment that provides the same information

```ts
/**
 @throws {DivideByZeroError}
*/
function divide(a: number, b: number): number {
	if (b === 0) {
		throw new DivideByZeroError({ a, b })
	}
	return a / b
}
```

but we can do better- clearly
lets leave exceptions for unexpected errors as they actually serve that purpose quite well
where do we put the expected errors then? the only other place we can, as part of the return type

lets look a what a basic implementation of this could look like, well define a success type and a failure type- and a result type which is just a union of the two

```ts
class Success<A> {
  readonly _tag = "Success";
  constructor(readonly value: A) {}
}

class Failure<A> {
  readonly _tag = "Failure";
  constructor(readonly error: E) {}
}

type Result<A, E> = Success<A> | Failure<E>;
```

now our divide function looks like this:
```ts
class DivideByZeroError {
  readonly _tag = "DivideByZeroError";
}

function divide(a: number, b: number): Result<number, DivideByZeroError> {
  if (b === 0) {
    return new Failure(new DivideByZeroError());
  } else {
    return new Success(a / b);
  }
}
```

and using it looks like this:
```ts
function main() {
  const result = divide(10, 0);
  if (result instanceof Failure) {
    console.error(`attempted to divide ${result.error.a} by ${result.error.b}`);
    return;
  }

  console.log(`Result: ${result.value}`);
}
```

even with just this basic implementation we have achieved explict typesafe errors
lets look at a slightly longer example with multiple functions that might error where we only pass the errors up instead of handling them

```ts
declare function mayFail1(n: number): Result<string, FooError>;
declare function mayFail2(s: string, n: number): Result<string, BarError>;

function main2(): Result<string, FooError | BarError | DivideByZeroError> {
  const res1 = divide(10, 2);
  if (res1 instanceof Failure) {
    // @ts-expect-error
    return res1;
  }

  const num = res1.value ** 2;

  const res2 = mayFail1(num);
  if (res2 instanceof Failure) {
    return res2;
  }

  const res3 = mayFail2(res2.value, num);
  if (res3 instanceof Failure) {
    return res3;
  }

  console.log(`Result: ${res3.value}`);
  return res3;
}
```

if you've ever seen go, youll realize this code looks extremely similar to go

theres two downsides to this approach
the first is that even though we dont care about the error at all in this function, opting to just pass it up the chain- we still have to explicitly check and return the error, it would be ideal if we could just work on the success value without having to think about the error

the other issue is that although we can manually add a nice return type, the inferred one can be a bit hard to parse

we can solve this by adding some helper functions:
```ts
class Success<A, E> {
  readonly _tag = "Success";
  constructor(readonly value: A) {}

  map<B>(f: (a: A) => B): Result<B, E> {
    return new Success(f(this.value));
  }

  flatMap<B, E2>(f: (a: A) => Result<B, E2>): Result<B, E | E2> {
    return f(this.value);
  }
}

class Failure<A, E> {
  readonly _tag = "Failure";
  constructor(readonly error: E) {}

  map<B>(f: (a: A) => B): Result<B, E> {
    // @ts-expect-error
    return this;
  }

  flatMap<B, E2>(f: (a: A) => Result<B, E2>): Result<B, E | E2> {
    // @ts-expect-error
    return this;
  }
}
```

which gives us a final result like this:
```ts
function main3() {
  return divide(10, 0)
    .map((n) => n ** 2)
    .flatMap((n) => mayFail1(n).flatMap((s) => mayFail2(s, n)))
    .map((res) => {
      console.log(`Result: ${res}`);
      return res;
    });
}
```
this actually solved both of our problems
our type is properly inferred, and we only work with the success value if it exists

but youll notice this actually looks quite a bit like the `.then` promise chains of earlier javascript, nested callback and all

but think about it, these are actually a nearly identical situation,
in both cases we have some wrapper type `Promise<T>` or `Result<T, E>` and we want to go inside and do something with the inner value 

*cough* a monad *cough*

what if just like how we have syntax sugar over Promise.then with async/await which allows up to 'unwrap' a promise inline removing the need for callback

we could have syntax sugar over unwrapping a result type

this is something that many other languages have implemented, take for instance rust or zig
```rust
fn main() -> Result<T, E> {
	let res1 = mayFail1()?;
	let res2 = mayFail2()?;
	return mayFail3(res1, res2);
}
```
```zig
fn main() !void {
	let res1 = try mayFail1();
	let res2 = try mayFail2();
	return mayFail3(res1, res2);
}
```

but the question is... can we do this in javascript? and Im here to tell you yes

```ts
import { Effect } from "effect";

class DivideByZeroError {
  readonly _tag = "DivideByZeroError";
}

function divide(
  a: number,
  b: number
): Effect.Effect<number, DivideByZeroError> {
  if (b === 0) {
    return Effect.fail(new DivideByZeroError());
  } else {
    return Effect.succeed(a / b);
  }
}

class FooError {
  readonly _tag = "FooError";
}
class BarError {
  readonly _tag = "BarError";
}

declare function mayFail1(n: number): Effect.Effect<string, FooError>;
declare function mayFail2(
  s: string,
  n: number
): Effect.Effect<string, BarError>;
```

Ive changed almost nothing here, just that our custom result type is now this imported Effect type, and we are using the imported effect succeed/fail constructors instead of our custom ones

but look at what this enables:
```ts
const main = Effect.gen(function* () {
  const res1 = yield* divide(10, 2);
  const num = res1 ** 2;

  const res2 = yield* mayFail1(num);
  const res3 = yield* mayFail2(res2, num);

  console.log(`Result: ${res3}`);
  return res3;
});
```

its just like async / await, or the rust or zig example
and check out how the return type is fully inferred as the union of all 3 possible errors

how is this possible? well a lot of type wizardry but thats all an internal implementation detail, end users just get to reap the benefits

again, this is all enabled by the fact that expected and unexpected errors exist in different "channels"

for instance, look at the difference between handling an expected vs an unexpected error in Effect:

```ts
main.pipe(
  // expected error- fully typed
  Effect.catchTag("DivideByZeroError", (e) =>
    Effect.succeed(`recovered from a: ${e.a} and b: ${e.b}`)
  ),
  // unexpected error- unknown
  Effect.catchAllDefect((defect) =>
    Console.error("something went wrong!", defect)
  )
);
```

This is from a library called Effect, which has a ton of amazing features not just limited to typesafe compositional error handling


but whether you use effect or not- everyone has to handle errors
I hope you now have a better understanding of the difference between expected and unexpected errors, why typescript will never have a throws statement, and some ways to handle errors as values


if Effect sounds interesting to you, definitely check out my other videos on it (I actually just made a video about its structured concurrency implementation), or my 4 hour workshop on the official effect channel

thanks for watching and I see you in the next one