import React from 'react';
import { shallow } from 'enzyme';
import Report_route_plate from './report_route_plate';

describe('Report_route_plate', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Report_route_plate />);
    expect(wrapper).toMatchSnapshot();
  });
});
