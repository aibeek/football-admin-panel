const shortWeekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

export const toIsoDate = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const shiftDate = (value: Date, days: number) => {
  const nextDate = new Date(value);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

export const formatScoreboardDate = (value: Date) => {
  const day = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const weekday = shortWeekdays[value.getDay()];
  return `${day}/${month} ${weekday}`;
};

export const formatDateLabel = (value?: string) => {
  if (!value) {
    return 'Soon';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [, month, day] = value.split('-');
    return `${day}/${month}`;
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(value));
};

export const formatDateTimeLabel = (value?: string) => {
  if (!value) {
    return 'Time pending';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

export const formatKickoffTime = (value?: string) => {
  if (!value) {
    return '--:--';
  }

  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

export const formatMatchWindow = (start?: string, end?: string) => {
  if (!start && !end) {
    return 'Schedule pending';
  }

  const startLabel = formatDateTimeLabel(start);
  const endLabel = end
    ? new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(end))
    : null;

  return endLabel ? `${startLabel} - ${endLabel}` : startLabel;
};

export const formatDateRangeLabel = (start?: string, end?: string) => {
  if (!start && !end) {
    return 'Dates pending';
  }

  const startLabel = formatDateLabel(start);
  const endLabel = end ? formatDateLabel(end) : null;

  return endLabel && endLabel !== startLabel ? `${startLabel} - ${endLabel}` : startLabel;
};

export const formatCurrencyLabel = (value?: number, suffix = 'KZT/hr') => {
  if (value === undefined || value === null) {
    return 'Price on request';
  }

  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)} ${suffix}`;
};
