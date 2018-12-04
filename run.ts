const puzzleId = process.argv[2];

process.on('unhandledRejection', reason => {
    console.error(reason);
    process.exit(1);
})

require(`./days/${puzzleId}/solve`);
