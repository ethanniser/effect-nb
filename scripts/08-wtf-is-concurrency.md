---
transition: none
controls: false
progress: false
---
## WTF is Concurrency

notes:
Concurrency is everywhere in modern programming, but what even is it, and how do different programming languages and libraries take varying approaches in their implementations of concurrency?

---

![[Pasted image 20240713180051.png]]

notes:
The core idea of concurrency is be able to write programs can that can handle more than one task at a time. This mainly comes from the asynchronous nature of much of today's application level programming. 

---

![[Pasted image 20240714193301.png]]

notes:
IO operations such as making a network request when calling an api take significant (ms compared to μs) amount of time. It would be a waste for our programs to just sit there and do nothing while they wait.

---

![[Pasted image 20240714193325.png]]

notes:
If instead, we could do other things during that time we could use the most of our available resources. We can start to create a model where multiple different tasks overlap each other, being paused and resumed when there is "work" to do. 

---

(do as a separate clip)

notes:

A good metaphor here is cooking a meal where you're preparing rice, cooking chicken, and baking a cake. Each of these tasks requires periods of active work followed by waiting times. For instance, while the rice simmers, the chicken needs marinating, and the cake must cool after baking before it can be frosted.

Concurrency in this scenario is akin to being a solo chef in a kitchen, you manage all three tasks by yourself. You start the rice, and while it cooks, you marinate the chicken. As the chicken marinates, you mix and bake the cake. This way, you efficiently use the waiting times of one task to progress with others, continuously rotating through the tasks as each requires attention or enters a waiting period. 

Now is a good time to contrast this with parallelism. Parallelism is the strategy of running multiple tasks not by interweaving them, but by truly doing multiple things at the same time. The metaphor version of this looks like having three clones of yourself, each dedicated to one of the tasks. One clone cooks the rice, another handles the chicken, and the third bakes the cake. 

While this might sound more efficient, it introduces complexity, especially if the clones need to coordinate or share resources like oven space or utensils. The interdependency and communication between clones can lead to conflicts or delays that wouldn’t occur if just one person were orchestrating all tasks. The same thing happens when programming, when we share memory across parallel execution contexts we run into a whole new category of issues that make programming extremely hard to reason about. 

---

```go
func foo(p *int) {
	*p = 1
	fmt.Printf("%d", *p)
}
```

Can you be **sure** this will always print "1"?

notes:
We often take things for granted, such as the value of a variable not changing unless we change it, or that a program will run the same way every time we execute it.

---
<style>
code {
	line-height: 25px;
	font-size: 20px;
}
</style>


```go
func foo(p *int) {
	*p = 1
	fmt.Printf("%d", *p) 
	// in theory this could print 2 (or 3, or ...)
}

func main() {
	x := 0
	go func() {
		for {
			x++
		}
	}()
	foo(&x)
}
```

What about now?

notes:
However, in a parallel environment, these assumptions can be violated due to race conditions, where two or more threads attempt to read and write to the same memory location simultaneously. This can lead to unpredictable behavior and bugs that are notoriously difficult to track down and fix. Furthermore, issues like deadlocks, where two or more threads become indefinitely stuck waiting for each other, add to the complexity. 

---

```rust
fn foo(p: Arc<Mutex<i32>>) {
    let mut num = p.lock().unwrap();
    *num = 1;
    println!("{}", *num);
}
```

Ok now we can be sure

notes:
As a result, while parallelism can offer significant performance improvements, it requires careful design and management to avoid these pitfalls.

Languages like Rust bring in big heavy duty machinery and complex type systems to address these issues, which are necessary if you do in fact need parallelism. This is required if you are writing very low level performance critical code. 

---

![[Pasted image 20240714193301.png]]

notes:
But the fact is, for most developers writing business applications, where most of the time spent is waiting for IO you just don't need parallelism, you need concurrency. 

---

![[Pasted image 20240714193427.png]]

notes:
With modern serverless computing you have parallelism at the level of the request or container, you don't need it baked into your programming language, 

---

![[Pasted image 20240713213524.png|700]]

notes:
and if you do you will pay for it.

---

How does it actually work?

notes:
Let's explore some different approaches to concurrency. 

---
<grid drop="left">
Hardware Threads:
 - Managed by the kernel
 - Expensive to create
 - Requires MBs of memory
 <div style="visibility:hidden">hidden</div>
</grid>

<grid drop="right">
Software (green) threads
 - Managed by code (often the language runtime)
 - Cheap to create
 - KBs of memory
</grid>

notes:
Most concurrency implementations share the concept of a 'thread' or execution context. Unlike true hardware level threads which run in parallel on different cpu cores, these "green threads" as they are often called exist in the runtime of the language it's self, and they differ however in that they are not guaranteed to be running truly in parallel with other threads.

---

![[Pasted image 20240713215615.png]]

notes:
Though in some languages such as go or erlang, they still might run in parallel. But then aren't we back to exactly the same position as before? 

---

![[Pasted image 20240713220548.png]]

notes:
The difference is message passing, where memory is never shared between threads, instead messages are sent from one thread to another. This avoids shared memory all together, and thus eliminates the issues associated with shared memory in parallelism. 

---

todo

notes:
Back to cooking, in this model we create 3 isolated clones, who their own set of cookie utensils and write down notes they give to us every so often about the progress of their dish.

---

```elixir
counter = Counter.start(0)
send(counter, :inc)
value = send(counter, {:get, self()})
```

You can't "share" memory, only send it around

notes:
In Erlang, every thread, or "process," has its own private memory, and the only way to communicate between processes is through message passing.

---

```go
func foo(p *int) {
	*p = 1
	fmt.Printf("%d", *p)
}

func main() {
	x := 0
	go func() {
		for {
			x++
		}
	}()
	foo(&x)
}
```

Example from earlier

notes:
Go, while allowing shared memory (and all of the footguns that come with it), 

---
```go
func main() {
	ch := make(chan int)
	go func() {
		ch <- 42
	}()
	go func() {
		n := <-ch
		fmt.Println(n)
	}()
	for {}
}
```

notes:
it strongly encourages the use of channels for communication between goroutines (its version of green threads).

---

Message passing is pretty cool, \
but requires some different thinking

notes:
This model is actually a very responsible approach but it does require a slightly different way of programming as well as leaving some performance on the table due to the need to copy memory everywhere. It would be nice if our clones didn't have to write so many notes.

---

todo

notes:
If instead, we kept everything on a single thread, we would be limited by only doing one thing at a time (only ever stirring one pot at a time), but assuming that we don't need to be stirring constantly, we are able to complete the entire meal ourselves.

---

![[Pasted image 20240713222909.png]]

notes:
This is the model of JavaScript's concurrency model and it has a lot of benefits. Code only ever runs on one main thread, along the way enqueuing work to be done at a later point. When the stack empties and there is no more work to do, the runtime picks the next task off the queue and starts again. This sequential model of concurrency has been extremely successful for writing highly asynchronous web applications, and it is one of the reasons javascript is so successful as a language.

---

Good, but far from perfect


notes:
However, most concurrency implementations today still suffer from a variety of flaws 

---

![[Pasted image 20240713223205.png]]

notes:
which are best described by [Nathaniel J Smith's 2018 Blog Post titled "`go` statement considered harmful"](https://vorpus.org/blog/notes-on-structured-concurrency-or-go-statement-considered-harmful/) which you should definitely go read (link in description) but I will summarize briefly now.

---

![[Pasted image 20240713223247.png]]

notes:
Something I hope we can all agree on is that `goto` is objectively bad. [Dijkstra famously wrote about this back in 1968](https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf). 

---

![[Pasted image 20240713223406.png]]

notes:
Every other control flow construct follows a basic pattern. We enter at the top, and leave at the bottom. 

---

![[Pasted image 20240713223443.png]]

notes:
Goto throws this out the window 

---

![[Pasted image 20240713223508.png]]

notes:
and leads to code that is essentially impossible to reason about. 

---

![[Pasted image 20240713223543.png]]

notes:
The thing is, when we look at many modern approaches to concurrency, they unfortunately look a lot like ‘goto’. Golang’s ‘go’ and callback based models (like JavaScript) have the same problems.

---
```js
foo()
```


Call function -> get result

notes:
We like to think of functions as black boxes. We call them, they do something maybe even call other functions themselves, but all eventually unwind and return back to where we called them with a value. 

---
```js
const foo = () => {
	setInterval(() => console.log("hey"), 100)
	return "foo"
}
const result = foo();
```

Woah

notes:
Go statements and callbacks blur this distinction. Anytime you call a function it will eventually return with some value, but did it spawn other go routines that are still running in the background, or set up of callbacks that might run in the future? Impossible to determine without reading the source code. Just like with ‘goto’, we have lost a linear control flow graph.

---

```ts
const foo = (file) => {
	// but file will have already been closed!
	setInterval(() => console.log(file.contents), 0)
	
	return file.contents
}
const file = open()
const result = foo()
file.close()
```

notes:
This has serious implications for our code. Resource management becomes extremely difficult as there is no determinant way to say whether or not any asynchronous tasks still have access to a resource before closing it.

---

![[Pasted image 20240713224318.png]]

notes:
If you've ever seen an uncaught promise rejection you know that go statements / callback also break error handling. 

---

```js
try {
	mayThrow()
} catch { ... }
// Caller handles errors

setTimeout(() => mayThrow(), 0)
// who is the "caller" here?
```

notes:
Basically all error handling techniques require having a reliable concept of "the current code's caller" to determine who is responsible for handling that error. Callbacks and go statements have no such concept.

---

```js
await Promise.all([
	rejects(),
	wontBeInterrupted(),
	wontBeInterrupted()
])
```

The other promises continue to 'run' even though their results can never be accessed \
\
*(I have an entire video about this)*

notes:
Similarly to error handling is interruption. The whole idea with async is things might take a long time to resolve. We need a way to stop work when we decide its no longer needed. But again, when we spawn callbacks or gorountines in a massive global scope with no handle to them this is very hard to implement. This is mostly an afterthought in the already mentioned languages and patterns, optional by default, and requiring manual setup and control.

---

Can you write perfectly memory \
safe multithreaded C++? Yes. \
\
Is it easy? Absolutely not.

notes:
This situation actually draws a lot of parallels to manually memory management in c or c++. You should be able to avoid any problems by just writing perfect code. But eventually you, or a dependency you use, will forget to free some memory, or free early, or send something across a thread boundary you shouldn't, leading to undefined behavior. Or in js or go, set a computation heavy interval or an infinitely recursive goroutine.

---

![[Pasted image 20240713225358.png]]

notes:
I think the general consensus has settled that Rust’s structured memory management solution is something to pay attention to.

Giving memory an ‘owner’ who represents when it will be freed is a powerful concept. What if we could apply this to concurrency tasks?

---

Concurrency, but with:
 - Linear "black box" threading model
 - First class error handling and interruption

notes:
What we need is a way to accomplish the same things as ‘go’ or callbacks, that is assigning concurrent work to be done asynchronously, but in a way that preserves our ‘black box’ model and linear control flow, and provides first class error handling and interruption through built in primitives.


This is where I want to introduce what I believe is the final piece to the puzzle, 

---

# Structured Concurrency

notes:
structured concurrency. Structured concurrency treats concurrency as a hierarchy of tasks, where tasks have clear parent-child relationships. When a parent task is cancelled or encounters an error, all of its child tasks are automatically cancelled as well.

---

![[calltree.gif]]

notes:
This means when we join a spawned coroutine, we can be certain it has left no trace. Placing a function in a coroutine can return to being a ‘black box’. Whether it spawns 1000 coroutines or zero internally, it doesn’t matter to the caller, because we can be assured they will all be gone when the coroutine finishes. This approach simplifies resource management by ensuring that there are no lingering tasks consuming a resource. 

---
```ts
const parent = () => {
	const child = fork(foo);
	if (cond) {
		const result = join(child);
		// parent acquires any error foo encountered
	}
	// parent ends so
	// child gets interrupted if not joined
}
```

notes:
Structured concurrency also enables interruption and error handling as first-class citizens. Now that all concurrent tasks have a owner, it is clear who is responsible for handling children's errors, or interrupting children when needed.

Let’s explore how structured concurrency can handle various aspects of concurrent programming by looking at some examples. 

---

Tons of languages have structured concurrency implementations!

notes:
Many languages and libraries have implemented structured concurrency mechanics, 

---

![[Pasted image 20240713230716.png]]

notes:
today we'll look at Effect, a typescript library with an advanced structured concurrency model.

---
```ts
type Effect<A, E> ~= () => A | E
```

notes:
What enables Effect's structured concurrency model is the `Effect` type, a value that contains the steps of a program that can either succeed with some A, or fail with some type E. 

---

```ts

const logInterval = (id: string) =>
	pipe(
		Console.log(id), 
		Effect.repeat(Schedule.spaced("500 millis"))
	)

const main = Effect.gen(function* () {
	const fiber1 = yield* Effect.fork(logInterval("1"))
	const fiber2 = yield* Effect.fork(logInterval("2"))

	yield* Effect.sleep("5 seconds")
	yield* Fiber.joinAll([fiber1, fiber2])
})
```

show video of terminal

notes:
Effects are run in a `Fiber`. A fiber executes the steps one by one storing its progress along the way. This way if told to by a external scheduler, it can stop executing the current effect to be resumed later. This is the process by which multiple fibers can be executing effects concurrently. 

---

```ts
const takesLongSync = Effect.sync(() => {
	let i = 0;
	while (i++ < 100_000_000) {}
})
const takesLongAsync = Effect.sleep("100 millis")
```

```ts
const main = Effect.gen(function* () {
	yield* takesLongSync
	yield* takesLongAsync
})
```

Calling both looks the same

notes:
This also enables the famous colored function problem to no longer exist. There is no sync or async Effect, only the Effect. This is possible because of Effect's preemptive scheduling, similar to erlang or go. The difference between a synchronous and a asynchronous function is that the asynchronous function might "yield" at some point. 

---

```ts
const takesLongSync = Effect.sync(() => {
	let i = 0;
	while (i++ < 100_000_000) {}
})
const takesLongAsync = Effect.sleep("100 millis")
```

```ts
const main = Effect.gen(function* () {
	yield* Effect.fork(logInterval("1"))
	yield* takesLongSync
	yield* takesLongAsync
})
```

Maybe now the difference is a bit more clear

notes:
But if this yielding is instead handled externally, it is no longer required for the types/functions to say if they yield or not. This is the same reason languages like go and erlang avoid function coloring, but Effect enables this in javascript where it is also safe to share memory between concurrent tasks- something you can't do in erlang or go.

---

```ts
declare const mayFail: Effect<number, Error>;

const main = Effect.gen(function* () {
	const fiber: Fiber<number, Error> = 
		yield* Effect.fork(mayFail)
	const exit: Exit<number, Error> =
		yield* Fiber.await(fiber)
	Exit.match(exit, {
		onSuccess: (n) => {},
		onFailure: (cause) =>
			Cause.match(cause, {
				onFail: (e) => {},
				onDie: (defect) => {},
				onInterrupt: () => {}
			})
	})
})
```

notes:
The Fiber type is also generic over success and failure types, meaning when we `await` the Fibers completion, we get a back a type called an Exit. An exit can full encode any possible outcome of a program, whether success, expected failure, unexpected failure, interruption, or even a combination of these outcomes if for example two concurrent tasks both fail.

---
```ts
const main = Effect.gen(function* () {
	yield* Effect.fork(spawnsManyChildFibers)
	yield* Effect.fork(spawnsManyChildFibers)
	yield* Effect.fork(spawnsManyChildFibers)
	// main ends so all children are interrupted
})
```

notes:
Fibers keep track of their children, ensuring that no child lives longer than its parent. This automatic supervision provides many additional guarantees about our programs as described earlier.

---
```ts
const main = Effect.gen(function* () {
	const file = yield* openFile("foo.txt")
	const child = yield* Effect.fork(doThing(file))
}).pipe(Effect.scoped)
// scope closes file here
// safe to do so because we know 
// child can't live longer than main
```

notes:
Because interruption is first class, Fibers also ensure that any scoped resources acquired during their execution are guaranteed to be released. As well as providing the ability to define "uninterruptible" regions for critical sections that need to always run together.

---
```ts
const main = Effect.gen(function* () {
	let i = 0
	const logAndIncI = (id: string) => 
		Effect.sync(() => console.log(id, i++))
			.pipe(Effect.forever)
	const fiber1 = yield* Effect.fork(logAndIncI("1"))
	const fiber2 = yield* Effect.fork(logAndIncI("2"))

	yield* Effect.sleep("5 seconds")
	yield* Fiber.joinAll([fiber1, fiber2])
})
```

Look ma, no race conditions

notes:
While you can totally get away with sharing memory due to javascript's strictly single threaded nature (show example of fibers interacting with shared count variable). 

---
```ts
const main = Effect.gen(function* () {
	let q = Queue.unbounded<number>()
	yield* Effect.fork(Effect.forever(Queue.offer("hi")))

	yield* Effect.forever(Queue.take)
})
```

notes:
Effect provides primitives for asynchronous communication between fibers with queues that allow for customizable backpressure behavior, as well as having a semaphore for controlling shared access to a resource.

---

## Customizable Scheduler

notes:
Finally, Effect allows you to customize the Scheduler that controls when Fibers yield and resume. This enables powerful advanced capabilities, such as giving priority to a Fiber responsible for updating the ui in a frontend web app, ensuring that the ui is always responive.

---
```ts
declare const getFoo: (id: string) => Effect<Foo>;

Effect.all([
	getFoo(1),
	getFoo(2),
	getFoo(3)
], { concurrency: "unbounded" })
```

notes:
Working with fibers is a fairly low level use case. You can get all of the benefits of Effect’s structured concurrency without ever having to touch one directly. All functions that run multiple effects have arguments to allow for unbounded, or bounded concurrency and handle spawning and joining, and interrupting the fibers for you, as well as interrupting remaining fibers when one fails.

---

## Concurrency is everywhere

notes:
No matter what language or technology you work with, concurrency is a massive part of modern application development. It allows us to write highly efficient code when dealing with highly asynchronous tasks. I hope you have a better understanding of what concurrency is, different approaches, and how structured concurrency can improve working with concurrency even further. 

If you liked this video, keep out for the next one where I'll build a basic Fiber runtime from scratch so you can see how everything works under the hood.

Thanks for watching and be sure to comment any questions you have, I'd be happy to answer. See you next time.