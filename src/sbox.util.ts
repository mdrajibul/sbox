import $ from 'jquery';
import { ISboxOptions, SearchMethod } from './interfaces';

export const Browser = {
  mozilla: /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase()),
  webkit: /webkit/.test(navigator.userAgent.toLowerCase()),
  opera: /opera/.test(navigator.userAgent.toLowerCase()),
  msie: /msie/.test(navigator.userAgent.toLowerCase()),
  version: Number(navigator.appVersion),
};

export const sbAjax = (
  options: ISboxOptions,
  beforeLoad = undefined,
  completeCallback = undefined
) => {
  return new Promise((resolve, reject) =>
    $.ajax({
      url: options.dataStore.ajax.url,
      data: options.dataStore.ajax.data,
      dataType: options.dataStore.ajax.dataType,
      type: options.dataStore.ajax.type,
      cache: options.dataStore.ajax.cache,
      success: (res) => {
        if (options.dataStore.ajax.success && typeof options.dataStore.ajax.success == 'function') {
          options.dataStore.ajax.success(res);
        }
        resolve(res);
      },
      error: (err) => {
        if (options.dataStore.ajax.error && typeof options.dataStore.ajax.error == 'function') {
          options.dataStore.ajax.error(err);
        }
        reject(err);
      },
      beforeSend: function () {
        if (beforeLoad) {
          beforeLoad();
        }
        if (options.dataStore.ajax.beforeSend && typeof options.dataStore.ajax.beforeSend == 'function') {
          options.dataStore.ajax.beforeSend();
        }
      },
      complete: function () {
        if (completeCallback) {
          completeCallback();
        }
        if (options.dataStore.ajax.complete && typeof options.dataStore.ajax.complete == 'function') {
          options.dataStore.ajax.complete();
        }
      },
    })
  );
};

export const hasSearchString = (
  options: ISboxOptions,
  mainString: string | null,
  searchString: string | null
): boolean => {
  if (!mainString || !searchString) {
    return false;
  }
  mainString = mainString.toString().trim();
  searchString = searchString.toString().trim();
  const strLength = mainString.length;
  const searchStrLength = searchString.length;
  if (options.searchMethod === SearchMethod.StartWith) {
    return mainString.substring(0, searchStrLength) == searchString;
  } else if (options.searchMethod === SearchMethod.EndWith) {
    return mainString.substring(strLength - searchStrLength, strLength) == searchString;
  } else {
    return mainString.indexOf(searchString) > -1;
  }
};

export const getObjects = (
  options: ISboxOptions,
  obj: any,
  key: string,
  val: any,
  isArray = false,
  recursive = false,
  searchType = false
) => {
  if (val) {
    val = val.toString().toLowerCase();
  }
  let objects = [];
  let nameVal = undefined;
  if (isArray && recursive && obj.length == 2) {
    nameVal = searchType ? obj[0].toString().toLowerCase() : obj[1].toString().toLowerCase();
    if ((val && (searchType ? nameVal == val : hasSearchString(options, nameVal, val))) || !val) {
      objects.push({ id: obj[0], name: obj[1] });
    }
  } else {
    for (const i in obj) {
      if (isArray) {
        key = i;
      }
      if (!obj.hasOwnProperty(i)) continue;
      nameVal = obj[key] ? obj[key].toString().toLowerCase() : '';
      if (typeof obj[i] === 'object') {
        objects = objects.concat(getObjects(options, obj[i], key, val, isArray, true, searchType));
      } else if ((val && (searchType ? nameVal == val : hasSearchString(options, nameVal, val))) || !val) {
        if (!isArray && i == key) {
          objects.push(obj);
        } else if (isArray) {
          objects.push(obj[key]);
        }
      }
    }
  }
  return objects;
};


export const populateSboxOptions = (selector: JQuery<HTMLElement>, options: ISboxOptions) => {
  let selectConfig = undefined;
  let replacePanel: JQuery<HTMLElement>;
  if (selector.is('select')) {
    selectConfig = {};
    const optionData = [];

    if (selector.attr('class')) {
      selectConfig.cls = selector.attr('class');
    }
    if (selector.attr('validation')) {
      selectConfig.validation = selector.attr('validation');
    }
    if (selector.attr('style')) {
      selectConfig.style = selector.attr('style');
    }
    if (selector.attr('id')) {
      selectConfig.id = selector.attr('id');
    }
    if (selector.attr('name')) {
      selectConfig.name = selector.attr('name');
    }
    if (selector.attr('multiple')) {
      selectConfig.multiSelect = true;
      selectConfig.pagination = true;
    }
    if (selector.attr('placeholder')) {
      selectConfig.emptyText = selector.attr('placeholder');
    }
    let selectedValue: any = selector.attr('multiple') ? [] : '';
    selector.find('option').each(function () {
      const currentOption = $(this);
      const optionNameValue = $.trim(currentOption.html());
      let optionIdValue = $.trim(currentOption.attr('value'));
      if (typeof optionIdValue == 'undefined') {
        optionIdValue = optionNameValue;
      }
      const currentValue = { id: optionIdValue, name: optionNameValue };
      if (currentOption.is(':selected')) {
        if (selector.attr('multiple') && Array.isArray(selectedValue)) {
          selectedValue.push(currentValue);
        } else {
          selectedValue = currentValue;
        }
      }
      optionData.push(currentValue);
    });

    if (selectedValue != '' || selectedValue.length > 0) {
      selectConfig.value = selectedValue;
    } else {
      let dataValue: any = selector.attr('data-value');
      if (dataValue) {
        dataValue = $.trim(dataValue);
        if (selector.attr('multiple')) {
          dataValue = dataValue.split(':::');
        }
      }
      selectConfig.value = dataValue ? dataValue : undefined;
    }
    if (selector.attr('multiple') && selectedValue.length < 1) {
      let dataIds = selector.attr('data-id');
      if (dataIds) {
        dataIds = $.trim(dataIds);
        dataIds = JSON.parse(dataIds);
        selectConfig.value = dataIds ? dataIds : undefined;
      }
    }
    if (optionData.length > 0) {
      selectConfig.dataStore = {
        json: optionData,
      };
    }
    if (selectConfig) {
      $.extend(selectConfig, options);
    }
    replacePanel = $('<div/>');
    if (selectConfig.id) {
      replacePanel.attr('id', selectConfig.id);
      selectConfig.id = '';
    }
    if (selectConfig.cls) {
      replacePanel.attr('class', selectConfig.cls);
      selectConfig.cls = '';
    }
    if (selectConfig.style) {
      replacePanel.attr('style', selectConfig.style);
    }
    selector.replaceWith(replacePanel);
  }
  if (!selectConfig) {
    selectConfig = options;
  }
  if (typeof selectConfig === 'object') {
    selectConfig.selector = replacePanel || selector;
  }
  return selectConfig;
}
