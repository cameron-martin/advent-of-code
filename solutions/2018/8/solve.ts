import { getInput } from "../../../lib/user-input";
import { puzzle } from "../../../lib/puzzle";
import { sum } from "../../../lib/collections";

export default puzzle(async () => {
    const input = (await getInput(__dirname)).trim();

    const { tree, rest } = parse(tokenize(input));
    if(rest.length !== 0) throw new Error();

    return {
        part1: sumMetadata(tree),
        part2: computeTreeValue(tree),
    }
});

function sumMetadata(tree: Tree): number {
    return sum(tree.metadata) + sum(tree.children.map(sumMetadata));
}

function computeTreeValue(tree: Tree): number {
    if(tree.children.length === 0) {
        return sum(tree.metadata);
    } else {
        return sum(tree.metadata.map(n => {
            const i = n - 1;
            if(tree.children[i]) {
                return computeTreeValue(tree.children[i]);
            } else {
                return 0;
            }
        }));
    }
}

function tokenize(input: string) {
    return input.split(" ").map(x => Number.parseInt(x));
}

interface ParseResult {
    tree: Tree;
    rest: number[];
}

function parse(tokens: number[]): ParseResult {
    let [childCount, metadataCount, ...rest] = tokens;

    const children = [];
    for(let i = 0; i < childCount; i++) {
        const parseResult = parse(rest);
        children.push(parseResult.tree);
        rest = parseResult.rest;
    }

    const metadata = rest.slice(0, metadataCount);
    rest = rest.slice(metadataCount);

    const tree = {
        metadata,
        children,
    };

    return {tree, rest};
}

interface Tree {
    metadata: number[];
    children: Tree[];
}
