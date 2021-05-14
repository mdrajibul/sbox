import { ISboxOptions } from './interfaces';
import { SboxTemplate } from './sbox.template';
import { getObjects } from './sbox.util';

export const getJsonData = (dataObject: any, options: ISboxOptions, template: SboxTemplate, lastFetchDataNo = 0, isClick = false) => {
  const selectedValue = template.getSelectedId();
  const searchValue = isClick && selectedValue.length > 0 && selectedValue[0] != '' ? '' : template.getInputText();
  let data = getObjects(options, dataObject, 'name', searchValue);
  if (options.pagination) {
    data = getArrayElements(data, lastFetchDataNo, options.itemPerPage);
  }
  return data;
};

export const getArrayData = (dataObject: any, options: ISboxOptions, template: SboxTemplate, lastFetchDataNo = 0, isClick = false) => {
  let selectedValue = template.getSelectedId();
  let searchValue = isClick && selectedValue.length > 0 && selectedValue[0] != '' ? '' : template.getInputText();
  let data = getObjects(options, dataObject, '', searchValue, true);
  if (options.pagination) {
    data = getArrayElements(data, lastFetchDataNo, options.itemPerPage);
  }
  return data;
};

export const getArrayElements = (arrayObject: Array<any>, index: number, total: number) => {
  if (arrayObject.length < 1) {
    return [];
  }
  const newObject = [];
  for (let i = index; i < index + total; i++) {
    if (arrayObject[i]) {
      newObject.push(arrayObject[i]);
    }
  }
  return newObject;
};
