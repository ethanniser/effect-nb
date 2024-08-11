import { Console, Effect } from "effect";

class DivideByZeroError {
  readonly _tag = "DivideByZeroError";
  constructor(readonly a: number, readonly b: number) {}
}

function divide(
  a: number,
  b: number
): Effect.Effect<number, DivideByZeroError> {
  if (b === 0) {
    return Effect.fail(new DivideByZeroError(a, b));
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

const main = Effect.gen(function* () {
  const res1 = yield* divide(10, 2);
  const num = res1 ** 2;

  const res2 = yield* mayFail1(num);
  const res3 = yield* mayFail2(res2, num);

  console.log(`Result: ${res3}`);
});

const _ = main.pipe(
  // expected error- fully typed
  Effect.catchTag("DivideByZeroError", (e) =>
    Effect.succeed(`recovered from a: ${e.a} and b: ${e.b}`)
  ),
  // unexpected error- unknown
  Effect.catchAllDefect((defect) =>
    Console.error("something went wrong!", defect)
  )
);
