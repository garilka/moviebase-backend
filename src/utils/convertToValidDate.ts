import { isValid, parse } from 'date-fns';

export const convertToValidStringDate = (dateString: string): string | null => {
  const dateFormats = ['yyyy-MM-dd', 'yyyy-M-d'];

  for (const format of dateFormats) {
    const parsedDate = parse(dateString, format, new Date());

    if (isValid(parsedDate)) {
      return parsedDate.toISOString();
    }
  }
  return null;
};
