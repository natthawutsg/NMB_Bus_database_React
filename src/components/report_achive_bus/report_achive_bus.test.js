import React from 'react';
import { shallow } from 'enzyme';
import Report_achive_bus from './report_achive_bus';

describe('Report_achive_bus', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Report_achive_bus />);
    expect(wrapper).toMatchSnapshot();
  });
});
