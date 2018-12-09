const year = process.argv[2];
const puzzleId = process.argv[3];

process.on('unhandledRejection', reason => {
    console.error(reason);
    process.exit(1);
})

require(`./${year}/${puzzleId}/solve`);
