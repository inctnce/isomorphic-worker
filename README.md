# isomorphic-worker
Simple library for worker creation independently from your environment (node or browser)

## Installation

```bash
$ npm install unified-worker
```

## Usage
Important concept is that the imported functions from another module won’t work within the function you want to call in another thread. 
That’s why you should add these external functions to your function’s context. Simple example:
```typescript
import someFunc from “./someFunc”;
import anotherFunc from “./anotherFunc”;

// won’t work properly: someFunc and anotherFunc are undefined 
function myFunc() {
  // …
  someFunc();
  // …
  anotherFunc()
}

worker(myFunc, null);

// will work as expected
function myFunc2() {
  // …
  this.someFunc();
  // …
  this.anotherFunc()
}

worker(myFunc, { someFunc, anotherFunc });
```
