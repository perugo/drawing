
export const validateInput = (value) => {
  const regexPatterns = /^\d*\.?\d*$/ // Only allow one decimal point
  // Early return if the value doesn't match the allowed characters
  return regexPatterns.test(value);
}
function checker_SETTING(obj1) {
  if (!obj1) return false;
  const settingFields = ['fieldX', 'fieldY', 'split', 'freq'];
  return settingFields.every(field => typeof obj1[field] === 'number');
}
export const isValidKey = (key) => {
  const regexPattern = /[0-9.]/
  return regexPattern.test(key) ||
    ['Backspace', 'ArrowRight', 'ArrowLeft', 'Tab', 'Delete'].includes(key);
};

// A single function to handle keydown events for different input types
export const handleKeyDown = () => (e) => {
  if (!isValidKey(e.key)) {
    e.preventDefault();
  }
};

export const updateStringStates = (setting, setStrField) => {
  const { fieldX, fieldY } = setting;
  setStrField({
    fieldX: fieldX,
    fieldY: fieldY
  });
}
export function isStateComplete(obj1) {
  if (!checker_SETTING(obj1)) return false;
  return true;
}
export function isValidNumber(input) {
  let str = String(input); // Convert the input to a string
  if (!str.length) return false;

  if (/e/i.test(str)) return false; // Scientific notation is invalid

  if (/[^0-9.-]/.test(str)) return false; // Invalid characters detected
  if (str === '' || str === '.') return false;
  if (str === '' || str === '-') return false;

  if ((str.match(/\./g) || []).length > 1) {
    return false; // More than one period
  }
  if (str.startsWith('-')) {
    str = str.substring(1); // Remove leading minus for the remaining checks
  }
  if (str.startsWith('0') && str !== "0" && !str.startsWith('0.')) {
    return false; // Leading zeros are not allowed
  }
  if (str.endsWith('.')) {
    return false; // Trailing period is not allowed
  }

  if (str.startsWith('.')) {
    return false; // Decimal point at the start is not allowed
  }

  const totalSignificantFigures = countSignificantFigures(str);
  if (totalSignificantFigures > 5) {
    return false; // Too many significant figures
  }

  const num = parseFloat(String(input));
  return !isNaN(num) && isFinite(num);
}
function countSignificantFigures(str) {
  let integralPart = '';
  let decimalPart = '';
  let isIntegralZero = false;

  if (str.includes('.')) {
    [integralPart, decimalPart] = str.split('.');
    integralPart = integralPart.replace(/^0+/, ''); // 先頭のゼロを取り除く
    // integralPartが0かどうかをチェック
    isIntegralZero = integralPart.length === 0 || parseInt(integralPart, 10) === 0;

    // 整数部が0の場合のみ、小数部から先頭のゼロを取り除く
    if (isIntegralZero) {
      decimalPart = decimalPart.replace(/^0+/, '');
    }

    decimalPart = decimalPart.replace(/0+$/, ''); // 末尾のゼロを取り除く
  } else {
    integralPart = str.replace(/^0+/, '');
    integralPart = str.replace(/0+$/, '');
  }

  const significantIntegral = integralPart.length === 0 || parseInt(integralPart, 10) === 0 ? 0 : integralPart.length;

  // 小数部分と整数部分の有効数字を合算して返す
  return significantIntegral + decimalPart.length;
}