import React from 'react';
import { shallow } from 'enzyme';
import Route_design from './route_design';

describe('Route_design', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Route_design />);
    expect(wrapper).toMatchSnapshot();
  });
});
