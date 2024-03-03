/* eslint-disable no-undef */
const { checkImageValidity, compareAPIData } = require('../functions');

/* This is a test case for the `checkImageValidity` function. It tests whether the function correctly
identifies whether an image extension type is valid or not. The `expect` function is used to compare
the output of the `checkImageValidity` function with the expected output. */
test('Tests to see if an image extension type is the correct.', () => {
  expect(checkImageValidity('gdfjdhfgkjdshfgjk.jpeg')).toEqual(true);
  expect(checkImageValidity('thisisnotaurlldfsjgd')).toEqual(false);
  expect(checkImageValidity('thisisthewrongimagetype.tiff')).toEqual(false);
});

/* This is a test case for the `compareAPIData` function. It checks if the function correctly returns
`false` if the input confidence value is less than 0.5 and `true` if it is greater than or equal to
0.5. The `expect` function is used to compare the output of the `compareAPIData` function with the
expected output. */
test('Test to compareAPIData if it is greater then or lower then the confidence threshold of 0.5', () => {
  expect(compareAPIData(0.4)).toBe(false);
  expect(compareAPIData(0.7)).toBe(true);
});
