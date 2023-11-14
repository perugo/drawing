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
  if (check_MEDIUM_NOCHANGE) return true;
  return false;
}
export function compare_ONLYFEEDPOINTCHANGE(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  const { medium: medium1, feedPoint: feedPoint1, setting: setting1 } = obj1;
  const { medium: medium2, feedPoint: feedPoint2, setting: setting2 } = obj2;

  if (!check_SETTING_NOCHANGE(setting1, setting2) || !check_MEDIUM_NOCHANGE(medium1, medium2)) return false;
  if (!check_FEEDPOINT_NOCHANGE(feedPoint1,feedPoint2)) return true;
  return false;
}
export const compare_RectNOCHANGE = (prevRect, width, height) => {
  return (prevRect.current.width === width && prevRect.current.height === height);
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

export function maker_FEEDPOINT(obj, setFeedPoint, xnum, ynum) {
  const list = [];
  
  list.push({ x: Math.floor(xnum/2), y: Math.floor(3.35*ynum/10), color: 'rgb(255, 0, 0)', phase: 0 });
  setFeedPoint(list);
  return list;
  /*
  obj.forEach(feedP => {
    if ((feedP.x === 0 && feedP.y === 0) || (feedP.x >= xnum || feedP.y >= ynum)) {
      let x = Math.floor(xnum / 2); let y = Math.floor(3.35 * ynum / 10);
      list.push({ x: x, y: y, color: feedP.color, phase: feedP.phase });
    } else {
      list.push({ x: feedP.x, y: feedP.y, color: feedP.color, phase: feedP.phase });
    }
  });
  if (!check_FEEDPOINT_NOCHANGE(obj, list)) {
    setFeedPoint(list);
  }
  */
  return list;
}
export function confirm_FEEDPOINT(obj,setFeedPoint,xnum,ynum){
  if(obj[0].x===0 && obj[0].y===0){
    const list = [];
    list.push({ x: Math.floor(xnum/2), y: Math.floor(3.35*ynum/10), color: 'rgb(255, 0, 0)', phase: 0 });
    setFeedPoint(list);
    return list;
  }
  return obj;
}
export function checker_CLEARBITMAP(obj, obj2) {
  if (!obj || !obj2) return false;
  return obj.clearBitmap;
}
export function maker_BITMAP(obj, setBitmap, xnum, ynum) {
  if (obj.length === 0) {
    const bitmap = Array.from({ length: xnum }).map(() => Array.from({ length: ynum }).fill(0));
    setBitmap(bitmap);
    return bitmap;
  }
  let checker = true;

  if (obj.length !== xnum) checker = false;
  if (!obj.every(subArray => Array.isArray(subArray) && subArray.length === ynum)) checker = false;
  if (!checker) {
    const bitmap = Array.from({ length: xnum }).map(() => Array.from({ length: ynum }).fill(0));
    setBitmap(bitmap);
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

export const useCanvasAndWidthHeight = (layoutWrapperRef, setWidth, setHeight) => {
  const [RECT, setRECT] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const setupDelay = 500;
    const timer = setTimeout(() => {
      if (!layoutWrapperRef.current) return
      const Rect = layoutWrapperRef.current.getBoundingClientRect();
      if (Rect.width === RECT.width && Rect.height === RECT.height) return;
      setRECT(Rect);
      setWidth(Rect.width);
      setHeight(Rect.height);
    }, setupDelay);
    return () => clearTimeout(timer);
  }, [layoutWrapperRef, setWidth, setHeight]);
};
//d