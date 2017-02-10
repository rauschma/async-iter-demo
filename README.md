# Asynchronous iteration demo

More information on asynchronous iteration: http://www.2ality.com/2016/10/asynchronous-iteration.html


## Installation

```text
cd async-iter-demo/
npm install
```

## Demo

Trying out the `lines` command line tool:

* Version based on async iteration:

    ```text
    npm run b src/lines.js src/lines.js
    ```

* Version based on CSP:

    ```text
    npm run b src/lines-csp.js src/lines.js
    ```

## Tests

Running the tests:

```text
npm t test/async_iter_tools_test.js
```
