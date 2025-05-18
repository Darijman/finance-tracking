export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'var(--foreground-color)',
          padding: 10,
          border: 'none',
          borderRadius: '10px',
          color: 'var(--primary-text-color)',
        }}
      >
        <p style={{ margin: 0 }}>{label}</p>
        <p style={{ margin: 0, color: '#8884d8' }}>{`Total Spent: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};
