import React from 'react';
import { shallow } from 'enzyme';
import Driver_license from './driver_license';

describe('Driver_license', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Driver_license />);
    expect(wrapper).toMatchSnapshot();
  });
});
