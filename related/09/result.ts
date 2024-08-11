export {};
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

type Result<A, E> = Success<A, E> | Failure<A, E>;

class DivideByZeroError {
  readonly _tag = "DivideByZeroError";
  constructor(readonly a: number, readonly b: number) {}
}

function divide(a: number, b: number): Result<number, DivideByZeroError> {
  if (b === 0) {
    return new Failure(new DivideByZeroError(a, b));
  } else {
    return new Success(a / b);
  }
}

function main() {
  const result = divide(10, 0);
  if (result instanceof Failure) {
    console.error(`attempted to divide ${result.error.a} by ${result.error.b}`);
    return;
  }

  console.log(`Result: ${result.value}`);
}

class FooError {
  readonly _tag = "FooError";
}
class BarError {
  readonly _tag = "BarError";
}

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

function main3() {
  return divide(10, 0)
    .map((n) => n ** 2)
    .flatMap((n) => mayFail1(n).flatMap((s) => mayFail2(s, n)))
    .map((res) => {
      console.log(`Result: ${res}`);
      return res;
    });
}
