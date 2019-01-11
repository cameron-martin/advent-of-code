import jsc from 'jsverify';
import { cartesianProduct, product } from "./collections";

it('takes cartesian product', () => {
    expect(cartesianProduct([1, 2, 3], ['foo', 'bar'], [4, 5, 6])).toMatchSnapshot();
});

it('has correct length', () => jsc.assertForall(jsc.array(jsc.array(jsc.number)), args => {
    expect(cartesianProduct(...args).length).toBe(product(args.map(arg => arg.length)));
    
    return true;
}));
