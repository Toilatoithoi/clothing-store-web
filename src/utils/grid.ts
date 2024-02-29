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

export const integerFormatter = (params: ValueFormatterParams) => {
  return formatNumber(params.value, 0, undefined, false, params.value ?? '');
};
