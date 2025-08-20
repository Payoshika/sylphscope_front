import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Alert from '../../src/components/basicComponents/Alert';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(() => cleanup());

describe('Alert component', () => {
  it('renders the message and default info type', () => {
    render(<Alert message="Hello world" />);
    const msg = screen.getByText('Hello world');
    expect(msg).toBeTruthy();
    const root = msg.parentElement as HTMLElement | null;
    expect(root).toBeTruthy();
    expect(root).toHaveClass('alert');
    expect(root).toHaveClass('alert--info');
  });

  it('renders title when provided', () => {
    render(<Alert title="Heads up" message="Look here" />);
    const title = screen.getByText('Heads up');
    const msg = screen.getByText('Look here');
    expect(title).toBeTruthy();
    expect(msg).toBeTruthy();
  });

  it('applies the correct modifier class for type', () => {
    render(<Alert message="Saved" type="success" />);
    const msg = screen.getByText('Saved');
    const root = msg.parentElement as HTMLElement | null;
    expect(root).toBeTruthy();
    expect(root).toHaveClass('alert--success');
  });
});
