import * as dateFns from 'date-fns';


export const formatStringToDate = (stringInput: string | undefined, formatInput = 'yyyyMMdd', failOverDate?: Date) => {
  if (stringInput == null) {
    return new Date();
  }
  const date = dateFns.parse(stringInput, formatInput, new Date());
  return dateFns.isValid(date) ? dateFns.parse(stringInput, formatInput, new Date()) : failOverDate ?? null;
};

export const formatDateToString = (date: Date | null | undefined, formatOutput = 'yyyyMMdd') => {
  if (date == null) {
    return null;
  }

  return dateFns.format(date, formatOutput);
};

declare global {
  var formatDateToString: (date: Date | null | undefined, formatOutput?: string) => string | null
}

globalThis.formatDateToString = formatDateToString