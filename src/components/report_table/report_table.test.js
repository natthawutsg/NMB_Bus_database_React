import React from 'react';
import { shallow } from 'enzyme';
import Report_table from './report_table';

describe('Report_table', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Report_table />);
    expect(wrapper).toMatchSnapshot();
  });
});
