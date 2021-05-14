import $ from 'jquery';
import { ISboxOptions } from './interfaces';
import { SboxTemplate } from './sbox.template';
import { getObjects } from './sbox.util';

export default class ResetDefault {
  private options: ISboxOptions;
  private template: SboxTemplate;

  private name: any;
  private id: string;
  private image: string;
  private color: string;
  private dataObject: any;
  private totalData: number;

  constructor(options: ISboxOptions, template: SboxTemplate, dataObject: any) {
    this.options = options;
    this.template = template;
    this.dataObject = dataObject;
  }

  getExistName(dataObject: any, id: string) {
    const existObject = getObjects(this.options, dataObject, 'id', id, false, null, true);
    if (existObject && existObject.length) {
      return existObject[0].name;
    }
    return '';
  }

  getData(): { data: any; total: number } {
    return {
      data: this.dataObject,
      total: this.totalData,
    };
  }

  setDefaultAjaxValue(isSingleSelection: boolean) {
    if (!this.dataObject) {
      $.ajax({
        url: this.options.dataStore.ajax.url,
        data: this.options.dataStore.ajax.data,
        dataType: this.options.dataStore.ajax.dataType,
        type: this.options.dataStore.ajax.type,
        cache: this.options.dataStore.ajax.cache,
        success: (res) => {
          if (res) {
            this.dataObject = res.data;
            this.totalData = res.total;
            this.name = this.getExistName(this.dataObject, this.id);
            this.template.multipleSelectedCell(this.id, this.name, isSingleSelection || false, this.image);
            if (isSingleSelection) {
              this.template.setInputValue(this.name, this.image);
              this.template.setColorInputValue(this.name, this.color);
            }
          }
        },
      });
    } else {
      this.template.multipleSelectedCell(this.id, this.name, isSingleSelection || false, this.image);
      if (isSingleSelection) {
        this.template.setInputValue(this.name, this.image);
        this.template.setColorInputValue(this.name, this.color);
      }
    }
  }

  setDefaultValueProps(value: any) {
    if (typeof value == 'object') {
      if (value.id) {
        this.id = value.id;
      }
      if (value.name) {
        this.name = value.name;
      } else if (this.id) {
        if (this.options.dataStore.arrayList) {
          this.name = getObjects(this.options, this.options.dataStore.arrayList, '', value.id, true, null, true);
        } else if (this.options.dataStore.json) {
          this.name = this.getExistName(this.options.dataStore.json, value.id);
        }
      }
      if (this.name && !this.id) {
        this.id = this.name;
      }
      if (value.image) {
        this.image = '<img src="' + value.image + '" title="' + this.name + '" alt="' + this.name + '"/>';
      }
      if (value.color) {
        this.color = '<div style="background-color: ' + value.color + '"></div>';
      }
    } else {
      this.id = value;
      if (this.options.dataStore.arrayList) {
        this.name = getObjects(this.options, this.options.dataStore.arrayList, '', this.id, true, null, true);
      } else if (this.options.dataStore.json) {
        this.name = this.getExistName(this.options.dataStore.json, this.id);
      }
      if (!this.name) {
        this.name = value;
      }
      if (typeof this.name == 'object' && this.name.length > 0) {
        this.name = this.name[0];
        if (this.name.name) {
          this.name = this.name.name;
        }
      }
    }
  }

  set(emptyValue: boolean) {
    if (emptyValue) {
      this.template.inputEl.html(this.template.emptyTextPanel);
      this.template.selectedItemContainer.empty();
    } else {
      if (
        (this.options.value && Array.isArray(this.options.value)) ||
        (this.options.multiSelect && typeof this.options.value === 'object')
      ) {
        for (const key in this.options.value) {
          this.setDefaultValueProps(this.options.value[key]);
          if (this.id && !this.name && this.options.dataStore.ajax.url) {
            this.setDefaultAjaxValue(false);
          } else {
            this.template.multipleSelectedCell(this.id, this.name, false, this.image);
          }
        }
      } else if (this.options.value && !$.isArray(this.options.value)) {
        this.setDefaultValueProps(this.options.value);
        if (this.id && !this.name && this.options.dataStore.ajax.url) {
          this.setDefaultAjaxValue(true);
        } else {
          this.template.multipleSelectedCell(this.id, this.name, true, this.image);
          this.template.setInputValue(this.name, this.image);
          this.template.setColorInputValue(this.name, this.color);
        }
      } else {
        this.template.inputEl.html(this.template.emptyTextPanel);
        this.template.selectedItemContainer.empty().append(this.template.getHiddenInput('')).hide();
      }
    }
  }
}
