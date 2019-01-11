import jsc from 'jsverify';
import { Vector3, Cuboid } from './geometry';
import { sum } from './collections';

const arbitraryVector3 = jsc.tuple([jsc.integer, jsc.integer, jsc.integer])
    .smap(
        ([x, y, z]) => new Vector3(x, y, z),
        vector => [vector.x, vector.y, vector.z]
    );

const arbitraryCuboid = jsc.suchthat(
    jsc.tuple([arbitraryVector3, arbitraryVector3]),
    ([min, max]) => min.x <= max.x && min.y <= max.y && min.z <= max.z,
).smap(
    ([min, max]) => new Cuboid(min, max),
    cuboid => [cuboid.min, cuboid.max]
)

test('split cubes have same bounding box as original cube', () => jsc.assertForall(arbitraryCuboid, cuboid => {
    const splits = cuboid.split();
    
    const boundingBox = Cuboid.bounding(splits.flatMap(split => [split.min, split.max]));

    expect(boundingBox.equals(cuboid)).toBe(true);

    return true;
}));

test('volume of split cubes equals volume of original cube', () => jsc.assertForall(arbitraryCuboid, cuboid => {
    const splits = cuboid.split();

    expect(sum(splits.map(split => split.volume))).toBe(cuboid.volume);

    return true;
}));