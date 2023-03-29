import React from 'react';
import { shallow } from 'enzyme';
import Route_design2 from './route_design2';

describe('Route_design2', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Route_design2 />);
    expect(wrapper).toMatchSnapshot();
  });
});
