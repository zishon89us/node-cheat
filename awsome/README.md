# node-cheat | awesome

*   [Node.js](https://nodejs.org/en/about/) is a server-side framework, one of it’s main works is to handle browser requests.
*   Node.js is an asynchronous event driven JavaScript runtime, It is designed to build scalable network applications.
*   Node.js is a JavaScript runtime environment created using Chrome's v8 engine.
*   A [cookie](http://www.webopedia.com/TERM/C/cookie.html) is a message given to a web browser by a web server. The browser stores the message in a text file. The message is then sent back to the server each time the browser requests a page from the server.
*   Cookies are small files which are stored on a user's computer.
*   In JavaScript, functions are regarded as first-class objects. That means you can do all the operations with a function that you can do with regular objects. You can assign functions to a variable, pass these as arguments to methods, declare them as a property of an object, and even return them from functions.
*   An array is a data structure that contains a group of elements. Typically these elements are all of the same data type, such as an integer or string.
*   JavaScript is a quirky, object-oriented, C-like language.
*   Error-first callbacks means first argument of the callback is reserved for an error object. Additional arguments are used to pass data.
*   Callback functions are derived from a programming paradigm known as functional programming.
*   A callback function is also known as a higher-order function.
*   The event emitter pattern allows you to decouple the producers and consumers of events using a standard interface.
*   The main event loop is single-threaded by nature but most of the i/o is run on separate threads, because the i/o APIs in Node.js are asynchronous/non-blocking by design.
*   REPL stands for Read Eval Print Loop and it represents a computer environment like a window console or unix/linux shell.
*   Node.js comes bundled with a REPL environment: 
    *   Read– Reads user’s input, parse the input into JavaScript data-structure and stores in memory.
    *   Eval– Takes and evaluates the data structure
    *   Print– Prints the result
    *   Loop– Loops the above command until user press ctrl-c twice.
*   JavaScript is a single-threaded language, and thus, it creates a single stack.
*   Callback is a chief functional programming technique that provides the flexibility of passing a function as an argument to another function.
*   Once the operation is recognized as asynchronous (which requires web API), the method is called in a different context and the execution of the callstack continues. Hence, the log last is printed before the setTimeout method displays the result. This is why JavaScript code is said to be non-blocking.
*   Once asynchronous operation completes web API stack pushes the code (callback) to the task queue.
*   The task queue contains every step that should be executed next in the  callstack—the order of priority is based on a First In First Out (FIFO) approach.
*   The feature of non-blocking execution stimulates the Node.js usage as a proxy server. A node proxy server can simultaneously handle large amounts of multiple connections and is easily configurable.
*   Rather than the whole app as a single unit, dividing the modules with respect to functionality is a microservice pattern. Microservice pattern is not new.
*   NPM started as a Node package manager with the advent of Node.js.
*   NPM has become a package manager not only for Node.js but for all JavaScript modules.
*   A reusable JavaScript code is said to be a package.
*   To install latest version of npm do:
    > npm install npm@latest -g
*   Nowadays, RxJS is a new concept to handle asynchronous behavior.    
