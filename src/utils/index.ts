export const isBlank = (str?: string | null): boolean => {
  return str == null || /^\s*$/.test(str);
};

export const uuid = (a?: number): string => {
  if (a != null) {
    return (a ^ ((Math.random() * 16) >> (a / 4))).toString(16);
  } else {
    // eslint-disable-next-line
    //@ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
  }
};

export const formatNumber = (
  value?: number,
  digit?: number,
  offsetRate?: number,
  toFixed?: boolean,
  failoverValue = '0',
  isSkipRound?: boolean,
  floor?: boolean
) => {
  if (value == null || isNaN(value)) {
    return failoverValue;
  }

  let data = value;

  if (offsetRate != null) {
    data = value / offsetRate;
  }

  let tempValueString = data.toString();
  let prefix = '';

  if (tempValueString[0] === '-') {
    prefix = '-';
    tempValueString = tempValueString.substring(1, tempValueString.length);
  }

  try {
    const tempValue = Number(tempValueString);
    let fractionDigit = 0;
    if (digit != null) {
      fractionDigit = digit;
    }
    if (fractionDigit > 0) {
      const mainNum = Number(
        `${Number(tempValue.toString())}e+${fractionDigit}`
      );
      const temp = +`${
        isSkipRound
          ? mainNum
          : floor
          ? Math.floor(mainNum)
          : Math.round(mainNum)
      }e-${fractionDigit}`;
      let fractionString = '';
      let i = '';
      if (toFixed === true) {
        i = temp.toFixed(fractionDigit);
        fractionString = i.substring(i.indexOf('.'), i.length);
        i = i.substring(0, i.indexOf('.'));
      } else {
        i = temp.toString();
        if (temp.toString().indexOf('.') >= 1) {
          fractionString = temp
            .toString()
            .substring(temp.toString().indexOf('.'), temp.toString().length);
          i = temp.toString().substring(0, temp.toString().indexOf('.'));
        }
      }
      return prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + fractionString;
    } else {
      const mainNum = Number(
        `${Number(tempValue.toString())}e+${fractionDigit}`
      );
      const temp = +`${
        isSkipRound
          ? mainNum
          : floor
          ? Math.floor(mainNum)
          : Math.round(mainNum)
      }e-${fractionDigit}`;
      const i = temp.toString();
      return prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  } catch {
    return '';
  }
};
