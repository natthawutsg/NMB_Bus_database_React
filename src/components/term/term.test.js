import React from 'react';
import { shallow } from 'enzyme';
import Term from './term';

describe('Term', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Term />);
    expect(wrapper).toMatchSnapshot();
  });
});
