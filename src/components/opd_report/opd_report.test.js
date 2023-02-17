import React from 'react';
import { shallow } from 'enzyme';
import Opd_report from './opd_report';

describe('Opd_report', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Opd_report />);
    expect(wrapper).toMatchSnapshot();
  });
});
