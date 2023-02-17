import React from 'react';
import { shallow } from 'enzyme';
import Card_regist from './card_regist';

describe('Card_regist', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<Card_regist />);
    expect(wrapper).toMatchSnapshot();
  });
});
