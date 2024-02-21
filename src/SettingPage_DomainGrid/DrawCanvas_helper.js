import { useState, useEffect } from 'react';

export function checker_DRAWDATA(obj1) {
  if (!obj1) return false;

  const requiredFields = {
    bitmap: (data) => data && Array.isArray(data),
    setting: (data) => {
      if (!data) return false;
      const settingFields = ['fieldX', 'fieldY', 'split', 'freq'];
      return settingFields.every(field => typeof data[field] === 'number');
    },
    feedPoint: (data) => data && Array.isArray(data) && data.length > 0 && data.every(Item => {
      return Number.isInteger(Item.x) &&
        Number.isInteger(Item.y) &&
        Number.isInteger(Item.phase) &&
        typeof Item.color === 'string' &&
        /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/.test(Item.color);
    }),
    medium: (data) => data && Array.isArray(data) && data.length >= 2 && data.every(mediumItem => {
      const mediumFields = ['DielectricConstant', 'DielectricLoss', 'MagneticConstant', 'MagneticLoss'];
      return mediumFields.every(field => typeof mediumItem[field] === 'number');
    }),
    clearBitmap: (data) => typeof data === 'boolean',
  }
  return Object.keys(requiredFields).every(key =>
    requiredFields[key](obj1[key])
  );
}
export function checker_NOCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  if (!check_FEEDPOINT_NOCHANGE(obj1.feedPoint, obj2.feedPoint)) return false;
  if (!check_SETTING_NOCHANGE(obj1.setting, obj2.setting)) return false;
  if (!check_MEDIUM_NOCHANGE(obj1.medium, obj2.medium)) return false;
  if (obj1.clearBitmap !== obj2.clearBitmap) return false;
  return true;
}

export function compare_ONLYFREQCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const { medium: medium1, feedPoint: feedPoint1, setting: setting1 } = obj1;
  const { medium: medium2, feedPoint: feedPoint2, setting: setting2 } = obj2;

  if (!check_MEDIUM_NOCHANGE(medium1, medium2) || !check_FEEDPOINT_NOCHANGE(feedPoint1, feedPoint2)) return false;
  const samesettingFields = ['fieldX', 'fieldY', 'split'];
  if (!fieldsMatch(setting1, setting2, samesettingFields)) return false;
  return setting1.freq !== setting2.freq;
}
export function compare_ONLYMEDIUMCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const { medium: medium1, feedPoint: feedPoint1, setting: setting1 } = obj1;
  const { medium: medium2, feedPoint: feedPoint2, setting: setting2 } = obj2;

  if (!check_SETTING_NOCHANGE(setting1, setting2) || !check_FEEDPOINT_NOCHANGE(feedPoint1, feedPoint2)) return false;
  if (!check_MEDIUM_NOCHANGE(medium1, medium2)) return true;

  return false;
}
export function compare_ONLYDOMAINGRIDCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  if (!check_FEEDPOINT_NOCHANGE(obj1.feedPoint, obj2.feedPoint) || !check_MEDIUM_NOCHANGE(obj1.medium, obj2.medium)) return false;

  return !check_DOMAINGRID_NOCHANGE(obj1.setting, obj2.setting);
}

export function compare_ONLYFEEDPOINTCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const { medium: medium1, feedPoint: feedPoint1, setting: setting1 } = obj1;
  const { medium: medium2, feedPoint: feedPoint2, setting: setting2 } = obj2;

  if (!check_SETTING_NOCHANGE(setting1, setting2) || !check_MEDIUM_NOCHANGE(medium1, medium2)) return false;
  const feedPointFields = ['x', 'y', 'color', 'phase'];
  if (feedPoint1.length !== feedPoint2.length) return true;
  for (let i = 0; i < feedPoint1.length; i++) {
    if (!fieldsMatch(feedPoint1[i], feedPoint2[i], feedPointFields)) return true;
  }
  return false;
}

export function check_SETTING_NOCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const settingFields = ['fieldX', 'fieldY', 'split', 'freq'];
  if (fieldsMatch(obj1, obj2, settingFields)) return true;
  return false;
}
export function check_FEEDPOINT_NOCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const feedPointFields = ['x', 'y', 'color', 'phase'];
  if (obj1.length !== obj2.length) return false;
  for (let i = 0; i < obj1.length; i++) {
    if (!fieldsMatch(obj1[i], obj2[i], feedPointFields)) return false;
  }
  return true;
}
export function check_MEDIUM_NOCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const mediumFields = ['DielectricConstant', 'DielectricLoss', 'MagneticConstant', 'MagneticLoss'];
  if (obj1.length !== obj2.length) return false;
  for (let i = 0; i < obj1.length; i++) {
    if (!fieldsMatch(obj1[i], obj2[i], mediumFields)) return false;
  }
  return true;
}
export function check_DOMAINGRID_NOCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const domaingridFields = ['fieldX', 'fieldY', 'split'];
  if (!fieldsMatch(obj1, obj2, domaingridFields)) return false;
  return true;
}
export function maker_FEEDPOINT(obj, xnum, ynum, obj1, obj2) {
  if (!check_DOMAINGRID_NOCHANGE(obj1, obj2)) {
    const list2 = [];
    list2.push({ x: Math.floor(xnum / 2), y: Math.floor(3.35 * ynum / 10), color: 'rgb(255, 0, 0)', phase: 0 });
    return list2;
  } else {
    const list = [];
    obj.forEach(feedP => {
      if ((feedP.x === 0 && feedP.y === 0) || (feedP.x >= xnum || feedP.y >= ynum)) {
        let x = Math.floor(xnum / 2); let y = Math.floor(3.35 * ynum / 10);
        list.push({ x: x, y: y, color: feedP.color, phase: feedP.phase });
      } else {
        list.push({ x: feedP.x, y: feedP.y, color: feedP.color, phase: feedP.phase });
      }
    });
    return list;
  }

}

export function checker_CLEARBITMAP(obj, obj2) {
  if (!obj || !obj2) return false;
  return obj.clearBitmap;
}
export function maker_BITMAP(obj, xnum, ynum) {
  if (obj.length === 0) {
    const bitmap = Array.from({ length: xnum }).map(() => Array.from({ length: ynum }).fill(0));
    return bitmap;
  }
  let checker = true;

  if (obj.length !== xnum) checker = false;
  if (!obj.every(subArray => Array.isArray(subArray) && subArray.length === ynum)) checker = false;
  if (!checker) {
    const bitmap = Array.from({ length: xnum }).map(() => Array.from({ length: ynum }).fill(0));
    return bitmap;
  }

  return obj;
}
export function maker_clearBitmap(setBitmap, xnum, ynum) {
  const bitmap = Array.from({ length: xnum }).map(() => Array.from({ length: ynum }).fill(0));
  setBitmap(bitmap);
  return bitmap;
}
export function fieldsMatch(obj1, obj2, fields) {
  return fields.every(field => obj1[field] === obj2[field]);
}

export const useCanvasAndWidthHeight = (layoutWrapperRef, canvasRefs, ctxRefs, setWidth, setHeight, updateCounter) => {
  const [RECT, setRECT] = useState({ width: -1, height: -1 });
  useEffect(() => {
    if (!layoutWrapperRef.current) return;
    const { canvas1Ref, canvas2Ref, canvas3Ref, canvas4Ref } = canvasRefs;
    const { ctx1Ref, ctx2Ref, ctx3Ref, ctx4Ref } = ctxRefs;
    ctx1Ref.current = canvas1Ref.current.getContext('2d');
    ctx2Ref.current = canvas2Ref.current.getContext('2d');
    ctx3Ref.current = canvas3Ref.current.getContext('2d');
    ctx4Ref.current = canvas4Ref.current.getContext('2d');

    const Rect = layoutWrapperRef.current.getBoundingClientRect();
    if (Rect.width === RECT.width && Rect.height === RECT.height) return;
    setRECT(Rect);
    setWidth(Rect.width);
    setHeight(Rect.height);
    [canvas1Ref, canvas2Ref, canvas3Ref, canvas4Ref].forEach(canvasRef => {
      canvasRef.current.width = Rect.width;
      canvasRef.current.height = Rect.height;
    });

  }, [layoutWrapperRef, canvasRefs, ctxRefs, setWidth, setHeight, updateCounter]);
};

export const compare_RectNOCHANGE = (prevRect, width, height) => {
  return (prevRect.current.width === width && prevRect.current.height === height);
}

export function line_triangle(x1, y1, x2, y2, s, ctx1, sentence) {
  const space = 20;
  const tip_space = 3;

  const isVertical = (x1 === x2);

  if (isVertical) {
    x1 += space;
    x2 += space;
    y1 += tip_space;
    y2 -= tip_space;
  } else {
    x1 += tip_space;
    x2 -= tip_space;
    y1 -= space;
    y2 -= space;
  }
  ctx1.strokeStyle = "rgba(0,0,0,0.7)";
  ctx1.lineWidth = 1;
  ctx1.beginPath();
  ctx1.moveTo(x1, y1);
  ctx1.lineTo(x2, y2);
  ctx1.stroke();

  if (sentence != "") {
    drawSentence(x1, y1, x2, y2, sentence, ctx1);
  }

  drawTriangle(x1, y1, s, isVertical ? 0.5 : 0, ctx1);
  drawTriangle(x2, y2, s, isVertical ? 1.5 : 1, ctx1);
}
function drawTriangle(x, y, s, rot, ctx) {
  const vector = 1 / 8;
  ctx.beginPath();
  ctx.moveTo(x, y);
  var cos_x = Math.cos(rot * Math.PI + Math.PI * vector);
  var sin_y = Math.sin(rot * Math.PI + Math.PI * vector);
  ctx.lineTo(x + s * cos_x, y + s * sin_y);
  cos_x = Math.cos(rot * Math.PI - Math.PI * vector);
  sin_y = Math.sin(rot * Math.PI - Math.PI * vector);
  ctx.lineTo(x + s * cos_x, y + s * sin_y);
  ctx.closePath();
  ctx.strokeStyle = "rgba(0,0,0,0.7)"; //枠線の色
  ctx.stroke();
  ctx.fillStyle = "rgba(0,0,0,0.7)";//塗りつぶしの色
  ctx.fill();
}
function drawSentence(x1, y1, x2, y2, sentence, ctx) {
  const isVertical = (x1 === x2);
  const textmargin = 3;

  if (isVertical) {
    ctx.textBaseline = 'left';
    ctx.textAlign = 'left';
    ctx.font = '500 20px "Times New Roman", serif';
    ctx.fillStyle = "rgba(0,0,0,1.0)";
    ctx.fillText(sentence, x1 + textmargin, (y2 - y1) * 0.53);
  } else {
    ctx.textBaseline = 'center';
    ctx.textAlign = 'center';
    ctx.font = '500 20px "Times New Roman", serif';
    ctx.fillStyle = "rgba(0,0,0,1.0)";
    ctx.fillText(sentence, (x2 - x1) / 2, y1 - textmargin);
  }
}

export function sentence(x1, x2, y1, ctx1, str_sentence) {
  ctx1.font = '500 18px times new roman,serif';
  ctx1.fillStyle = "rgba(0,0,0,1.0)";
  ctx1.textBaseline = 'center';
  ctx1.textAlign = 'center';
  ctx1.fillText(str_sentence, (x2 - x1) / 2, y1 + 10);
}

export const getStrLambda = (lambdaValue) => {
  let value; let unit;
  if (lambdaValue > 1) {
    value = lambdaValue;
    unit = 'm';
  } else if (lambdaValue > 0.001) {
    value = lambdaValue * 1e3;
    unit = 'mm';
  } else if (lambdaValue > 1e-6) {
    value = lambdaValue * 1e6;
    unit = 'µm';
  } else {
    value = lambdaValue * 1e-9;
    unit = 'nm';
  }
  value = roundToFourSignificantFigures(value);
  return `${value} ${unit}`;
};
function roundToFourSignificantFigures(num) {
  if (num === 0) {
    return 0; // 0は特別に扱う
  }
  let d = Math.ceil(Math.log10(num < 0 ? -num : num)); // 数の大きさの桁数を求める
  let power = 4 - d; // 4桁の有効数字になるように桁を調整
  let magnitude = Math.pow(10, power);
  let shifted = Math.round(num * magnitude);
  return shifted / magnitude;
}
