export {};
class Success<A> {
  readonly _tag = "Success";
  constructor(readonly value: A) {}
}

class Failure<E> {
  readonly _tag = "Failure";
  constructor(readonly error: E) {}
}

type Result<A, E> = Success<A> | Failure<E>;

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
