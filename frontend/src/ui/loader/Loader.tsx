'use client';

import './loader.css';

interface Props {
  style?: React.CSSProperties;
}

export const Loader = ({ style }: Props) => {
  return (
    <div className='loader_wrapper'>
      <div className='loader' style={style} />
    </div>
  );
};
