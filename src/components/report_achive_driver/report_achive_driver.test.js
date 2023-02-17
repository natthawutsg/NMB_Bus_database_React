import React from 'react';
import { shallow } from 'enzyme';
import Report_achive_driver from './report_achive_driver';

describe('Report_achive_driver', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Report_achive_driver />);
    expect(wrapper).toMatchSnapshot();
  });
});
