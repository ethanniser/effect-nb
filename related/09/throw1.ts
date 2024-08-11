export {};

class DivideByZeroError {
  readonly _tag = "DivideByZeroError";
  constructor(readonly a: number, readonly b: number) {}
}

function divide(a: number, b: number): number /* throws DivideByZeroError */ {
  if (b === 0) {
    throw new DivideByZeroError(a, b);
  }
  return a / b;
}

declare const a: number;
declare const b: number;

try {
  const result = divide(a, b);
  console.log(result);
} catch (e: unknown | DivideByZeroError) {
  if (e instanceof DivideByZeroError) {
    console.error(`attempted to divide ${e.a} by ${e.b}`);
  }
  throw e;
}
