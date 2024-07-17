import { useState } from 'react';

const usePrevious = <T>(value: T) => {
  const [state, setState] = useState<{ value: T, prev: T | null }>({
    value,
    prev: null,
  });

  const current = state.value;

  if (value !== current) {
    setState({
      value,
      prev: current,
    });
  }

  return state.prev;
};

export default usePrevious;
