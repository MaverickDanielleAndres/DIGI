import React from 'react';
import { render } from '@testing-library/react-native';
import { ShotCounter } from '@/features/camera/ShotCounter';

describe('ShotCounter', () => {
  it('renders the correct shot count', () => {
    const { getByText } = render(<ShotCounter count={15} maxCount={24} />);
    expect(getByText('15')).toBeTruthy();
    expect(getByText('SHOTS REMAINING')).toBeTruthy();
  });

  it('renders padded single digit numbers correctly', () => {
    const { getByText } = render(<ShotCounter count={5} maxCount={24} />);
    expect(getByText('05')).toBeTruthy();
  });
});
