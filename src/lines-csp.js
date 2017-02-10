import fs from 'fs';

import {ChannelWithErrors, filter} from './csp_tools';

function readFile(fileName) {
    const channel = new ChannelWithErrors();
    const readStream = fs.createReadStream(fileName,
        { encoding: 'utf8', bufferSize: 1024 });
    readStream.on('data', buffer => {
        const str = buffer.toString('utf8');
        channel.put(str);
    });
    readStream.on('error', err => {
        channel.putError(err);
    });
    readStream.on('end', () => {
        // Signal end of output sequence
        channel.close();
    });
    return channel;
}

async function splitLines(input, output) {
    let previous = '';
    while (true) {
        const chunk = await input.takeWithErrors();
        if (chunk === ChannelWithErrors.DONE) {
            break;
        }
        previous += chunk;
        let eolIndex;
        while ((eolIndex = previous.indexOf('\n')) >= 0) {
            const line = previous.slice(0, eolIndex);
            output.put(line);
            previous = previous.slice(eolIndex+1);
        }
    }
    if (previous.length > 0) {
        output.put(previous);
    }
    output.close();
}

async function numberLines(input, output) {
    for (let n=1;; n++) {
        const line = await input.takeWithErrors();
        if (line === ChannelWithErrors.DONE) {
            break;
        }
        output.put(`${n} ${line}`);
    }
    output.close();
}

async function logLines(ch) {
    while (true) {
        const line = await ch.takeWithErrors();
        if (line === ChannelWithErrors.DONE) break;
        console.log(line);
    }
}

async function main() {
    const fileName = process.argv[2];

    const ch = filter(readFile(fileName), splitLines, numberLines);
    await logLines(ch);
}
main();
