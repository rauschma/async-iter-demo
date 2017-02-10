Trying out the `lines` command line tool:

* Version using async iteration:

    ```text
    npm run b src/lines.js src/lines.js
    ```

* Version using CSP:

    ```text
    npm run b src/lines-csp.js src/lines.js
    ```

Running the tests:

```text
npm t test/async_iter_tools_test.js
```
