import React from 'react';
import { shallow } from 'enzyme';
import Black_report from './black_report';

describe('Black_report', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Black_report />);
    expect(wrapper).toMatchSnapshot();
  });
});
