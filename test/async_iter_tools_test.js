/* global suite,test */

import assert from 'assert';

import {AsyncQueue, takeAsync} from '../src/async_iter_tools';

suite('takeAsync')

test('Collect values yielded by an async generator', async function() {
    async function* gen() {
        yield 'a';
        yield 'b';
        yield 'c';
    }
    assert.deepStrictEqual(await takeAsync(gen()), ['a', 'b', 'c']); // everything
    assert.deepStrictEqual(await takeAsync(gen(), 3), ['a', 'b', 'c']);
    assert.deepStrictEqual(await takeAsync(gen(), 2), ['a', 'b']);
    assert.deepStrictEqual(await takeAsync(gen(), 1), ['a']);
    assert.deepStrictEqual(await takeAsync(gen(), 0), []);
});

suite('AsyncQueue');

test('Enqueue before dequeue', async function() {
    const queue = new AsyncQueue();
    queue.enqueue('a');
    queue.enqueue('b');
    queue.close();
    assert.deepStrictEqual(await takeAsync(queue), ['a', 'b']);
});
test('Dequeue before enqueue', async function() {
    const queue = new AsyncQueue();
    const promise = Promise.all([queue.next(), queue.next()]);
    queue.enqueue('a');
    queue.enqueue('b');
    return promise.then(arr => {
        const values = arr.map(x => x.value);
        assert.deepStrictEqual(values, ['a', 'b']);
    });
});
test('Enqueued errors become rejections', function() {
    const queue = new AsyncQueue();
    const theError = new Error();
    queue.enqueue(theError);
    const firstPromise = queue[Symbol.asyncIterator]().next();
    return firstPromise.catch(err => assert.strictEqual(err, theError));
});
test('Enqueued errors and for-await-of', async function() {
    const queue = new AsyncQueue();
    const theError = new Error();
    queue.enqueue(theError);
    try {
        for await (const x of queue) {
            // do nothing
        }
    } catch (err) {
        assert.strictEqual(err, theError);
    }
});
