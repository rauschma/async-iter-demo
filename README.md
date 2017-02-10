# Asynchronous iteration demo

More information on asynchronous iteration: http://www.2ality.com/2016/10/asynchronous-iteration.html

## Demo

Trying out the `lines` command line tool:

* Version using async iteration:

    ```text
    npm run b src/lines.js src/lines.js
    ```

* Version using CSP:

    ```text
    npm run b src/lines-csp.js src/lines.js
    ```

## Tests

Running the tests:

```text
npm t test/async_iter_tools_test.js
```
