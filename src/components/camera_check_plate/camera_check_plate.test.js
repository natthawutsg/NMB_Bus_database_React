import React from 'react';
import { shallow } from 'enzyme';
import Camera_check_plate from './camera_check_plate';

describe('Camera_check_plate', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Camera_check_plate />);
    expect(wrapper).toMatchSnapshot();
  });
});
