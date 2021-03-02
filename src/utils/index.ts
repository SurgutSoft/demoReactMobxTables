export const getDate = (date: number): string => {
  const cellDate = new Date(date), today = new Date();

  if (cellDate.getTime() - today.getTime() <= 0) {
    return 0 + ' days left';
  } else {
    const diffTime = Math.abs(today.getTime() - cellDate.getTime());
    return Math.ceil(diffTime / (1000 * 3600 * 24)) + ' days left';
  }
}

export const currencyFormat = (currency: string) => {
  return currencyIcon[currency];
}

const currencyIcon: { [key: string]: string } = {
  USD: '$', EUR: '€', GBP: '£', AUD: '$', CAD: '$'
};

export const formatAmount = (value: number, currency: string) => {
  return currencyIcon[currency] + value.toLocaleString(undefined, {minimumFractionDigits: 2});
};

export const gradeDisplay = (minGrade?: number, maxGrade?: number) => {
  let gradeDisplay = minGrade + ' - ' + maxGrade;
  if (minGrade === -1) {
    gradeDisplay = `PreK - ${maxGrade}`;
  }
  if (minGrade === 12) {
    gradeDisplay = '12+';
  }
  if (minGrade === -3 && maxGrade === 12) {
    gradeDisplay = 'Any';
  }

  return gradeDisplay;
}