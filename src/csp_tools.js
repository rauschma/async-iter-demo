import Channel from 'async-csp';

export class ChannelWithErrors extends Channel {
    takeWithErrors() {
        return this.take()
        .then(result => {
            if (result instanceof Error) {
                // Rejects the returned Promise
                throw result;
            }
            return result; // no change
        });
    }
    putError(err) {
        return this.put(err);
    }
}

export function filter(inputChannel, ...filterFuncs) {
    for (const filterFunc of filterFuncs) {
        const outputChannel = new ChannelWithErrors();
        filterFunc(inputChannel, outputChannel)
        .catch(err => {
            outputChannel.putError(err);
        });
        inputChannel = outputChannel;
    }
    return inputChannel;
}
