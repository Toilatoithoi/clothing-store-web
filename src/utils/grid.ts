import { ValueFormatterParams } from 'ag-grid-community';
import { formatDateToString } from './datetime';
import { formatNumber } from '.';

export const timeFormatterFromTimestamp = (params: ValueFormatterParams) => {
  if (params.value) {
    const time = formatDateToString(new Date(params.value), 'HH:mm:ss dd/MM/yyyy');
    if (time) {
      return time;
    }
  }
  return params.value;
}

// format tiền
export const integerFormatter = (params: ValueFormatterParams) => {
  return formatNumber(params.value, 0, undefined, false, params.value ?? '');
};

export const integerFormatterVND = (params: any) => {
  // Format the value as an integer
  let formattedValue = Number(params.value).toLocaleString('en-US');

  // Add 'vnd' suffix to the formatted value
  formattedValue += ' VND';

  // Return the formatted value
  return formattedValue;
};
