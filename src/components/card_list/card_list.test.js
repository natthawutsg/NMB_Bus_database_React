import React from 'react';
import { shallow } from 'enzyme';
import Card_list from './card_list';

describe('Card_list', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Card_list />);
    expect(wrapper).toMatchSnapshot();
  });
});
