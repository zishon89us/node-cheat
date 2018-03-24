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
*   Using too many callbacks gives rise to callback hell and to avoid this, the promises library is used.
*   Versioning is a great technique to maintain an application over time.
*   Semantic versioning specifications have become the core part of Node.js development. It is also known as semver. The NPM provides packages that stimulate semver practices.
*   In computer programming, cohesion refers to the degree to which the elements inside a module belong together.
*   The destructuring assignment syntax is a JavaScript expression that makes it possible to extract data from arrays or objects into distinct variables.
*   Node.js 8.0.0 has been delayed and will ship on or around May 30th.
*   Immediately invoked function expressions(IIFEs).
*   How to check if redis is working and its version:
> redis-cli ping
> redis-server --version
*   How to list env variables in linux
> printenv
> printenv | grep LOGNAME
*   Use Node for I/O intensive apps not for CPU Intensive apps
*   Node.js is neither language nor framework, it is simply run time environment
*   Data Parallelism: Same code is executed several times in parallel through instances on different elements of same datset 
*   Task Parallelism: Different code is executed in parallel
*   Try Object.entries
> Object.entries({first: 'John', last: 'Doe'}); // [['first', 'John'], ['last', 'Doe']]
*   Technically speaking, #Linux is the name of the operating system's #kernel, nothing more.
*   With Array.prototype.includes everything is easy and simple. It’s a replacement for indexOf which developers used to check for presence of a value in an array.
*   SWF (pronounced "Swiff") was originally an acronym for "Shockwave Flash" since the SWF format was designed for Shockwave Player.
*   Possible types of testing: 
>- **Unit Testing**
>- **Functional Testing**
>- **Integration Testing**
>- **End-to-end Testing**
>- **Screen-shot Testing**
>- **Regression Testing**
>- **Mutation Testing**
>- **Formal Verification (e.g., TLA+)**
>- **Acceptance Testing**
>- **A/B Testing**
>- **Accessibility Testing**
>- **Smoke Testing**
>- **Snapshot Testing**
>- **Drunk User Testing**
>- **Accessibility Testing (fits many of above ?)**
>- **Failure Injection Testing (for distributed systems ?)**
>- **Component Testing**
>- **Split Testing**
>- **Multi-variant Testing**
>- **Visual Testing**
>- **Distributed testing - that is, pushing to prod without tests and waiting for the feedback from users.**
*   Free programming books https://github.com/EbookFoundation/free-programming-books
*   AWS: A regions is a geographical area, every region consists of 2 or more availability zones (data centers). 
*   AWS: An availability zone is simply a data center. 
*   AWS: Edge locations are endpoints for AWS which are used for caching content, typically this consists of CloudFront, Amazon's Content Delivery Network (CDN).
*   AWS: Edge locations are to cache static content for fast delivery to users by near by data centers. 
*   Sentry is open source error tracking tool that can be used to what issue occurred and how without getting any input from user.
*   According to Stack Overflow 2018 survey mongodb is the most wanted database, the world’s largest developer survey with over 100,000 respondents.
*   BrowserStack is a cloud-based cross-browser testing tool that enables developers to test their websites across various browsers on different operating systems and mobile devices, without requiring users to install virtual machines, devices or emulators.
*   Idea behind async-await is to write asynchronous code that flows like synchronous.
*   Functional programming is a programming paradigm, a coding style or a mindset you can say.
*   Functional programming is easier to debug and maintain in terms of code.
*   The lodash/fp module promotes a more functional programming (FP) friendly style by exporting an instance of lodash with its methods wrapped to produce immutable auto-curried iteratee-first data-last methods.
*   OWASP means Open Web Application Security Project
>-  Data Segregation by tenant i.e. data should be kept separately or should be modeled such a way that each tenant has data privacy while accessed
>-  Users must have roles to prevent un-authorized data access or modification
