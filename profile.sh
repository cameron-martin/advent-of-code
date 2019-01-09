node --prof ./node_modules/.bin/jest --runTestsByPath test.ts
node --prof-process isolate-*.log > prof.log
rm -f isolate-*.log