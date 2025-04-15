export const formatDate = (dateString: string, showTime: boolean = false): string => {
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  const year = date.getUTCFullYear();

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: '2-digit',
    ...(year !== currentYear && { year: 'numeric' }),
  };

  let formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

  if (showTime) {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    };
    const formattedTime = new Intl.DateTimeFormat('en-GB', timeOptions).format(date);
    formattedDate += ` at ${formattedTime}`;
  }

  return formattedDate;
};
