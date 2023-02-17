import React from 'react';
import { shallow } from 'enzyme';
import Report_raw from './report_raw';

describe('Report_raw', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Report_raw />);
    expect(wrapper).toMatchSnapshot();
  });
});
