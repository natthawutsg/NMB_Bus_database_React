import React from 'react';
import { shallow } from 'enzyme';
import Black_list from './black_list';

describe('Black_list', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Black_list />);
    expect(wrapper).toMatchSnapshot();
  });
});
