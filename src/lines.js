import {createReadStream} from 'fs';

import {AsyncQueue,forEachAsync,takeAsync} from './async_iter_tools';

/**
 * Creates an asynchronous ReadStream for the file whose name
 * is `fileName` and feeds it into an AsyncQueue that it returns.
 * 
 * @returns an async iterable 
 * @see ReadStream https://nodejs.org/api/fs.html#fs_class_fs_readstream
 */
function readFile(fileName) {
    const queue = new AsyncQueue();
    const readStream = createReadStream(fileName,
        { encoding: 'utf8', bufferSize: 1024 });
    readStream.on('data', buffer => {
        const str = buffer.toString('utf8');
        queue.enqueue(str);
    });
    readStream.on('error', err => {
        queue.enqueue(err);
        queue.close();
    });
    readStream.on('end', () => {
        // Signal end of output sequence
        queue.close();
    });
    return queue;
}

/**
 * Turns a sequence of text chunks into a sequence of lines
 * (where lines are separated by newlines)
 * 
 * @returns an async iterable 
 */
async function* splitLines(chunksAsync) {
    let previous = '';
    for await (const chunk of chunksAsync) {
        previous += chunk;
        let eolIndex;
        while ((eolIndex = previous.indexOf('\n')) >= 0) {
            const line = previous.slice(0, eolIndex);
            yield line;
            previous = previous.slice(eolIndex+1);
        }
    }
    if (previous.length > 0) {
        yield previous;
    }
}

/**
 * @returns an async iterable
 */
function readLines(fileName) {
    const queue = readFile(fileName);
    return splitLines(queue);
}

(async function () {
    const fileName = process.argv[2];
    for await (const line of readLines(fileName)) {
        console.log('>', line);
    }
})();
