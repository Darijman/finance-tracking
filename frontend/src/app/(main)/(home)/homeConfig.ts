interface Benefit {
  id: number;
  imgSrc: string;
  title: string;
  text: string;
}

export const benefits: Benefit[] = [
  {
    id: 1,
    imgSrc: '/svg/productivity-icon.svg',
    title: 'Productivity',
    text: 'Unlock your full potential. Increase productivity every day.',
  },
  {
    id: 2,
    imgSrc: '/svg/coffee-icon.svg',
    title: 'Focus',
    text: 'Focus more. Stress less. Achieve better.',
  },
  {
    id: 3,
    imgSrc: '/svg/idea-icon.svg',
    title: 'Ideas',
    text: 'Optimize your day. Organize your budget.',
  },
  {
    id: 5,
    imgSrc: '/svg/insights-icon.svg',
    title: 'Insights',
    text: 'Visualize your habits. Make informed decisions.',
  },
  {
    id: 6,
    imgSrc: '/svg/time-icon.svg',
    title: 'Time Saving',
    text: 'Track faster. Plan smarter. Save time daily.',
  },
];
