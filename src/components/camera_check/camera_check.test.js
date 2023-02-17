import React from 'react';
import { shallow } from 'enzyme';
import Camera_check from './camera_check';

describe('Camera_check', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Camera_check />);
    expect(wrapper).toMatchSnapshot();
  });
});
