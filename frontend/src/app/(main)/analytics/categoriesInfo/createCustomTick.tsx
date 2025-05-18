'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { CategoryInfo, CustomTickProps } from './interfaces';

interface Props extends CustomTickProps {
  categoriesInfo: CategoryInfo[];
}

export const CreateCustomTick = ({ x, y, payload, categoriesInfo }: Props) => {
  const { resolvedTheme } = useTheme();

  const category = categoriesInfo.find((c) => c.category.name === payload.value);
  const imagePath = category?.category.image
    ? `http://localhost:9000/uploads/${category.category.image}`
    : 'http://localhost:9000/uploads/questionMark-icon.svg';

  return (
    <g transform={`translate(${x},${y + 10})`}>
      <image href={imagePath} width={30} height={30} x={-15} y={0} style={{ filter: resolvedTheme === 'dark' ? 'invert(1)' : 'invert(0)' }} />
      <text x={0} y={45} textAnchor='middle' fill='#666' fontSize={12}>
        {payload.value}
      </text>
    </g>
  );
};
