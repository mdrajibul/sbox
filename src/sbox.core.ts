import $ from 'jquery';
import { ISboxOptions, SearchMethod, Size } from './interfaces';
import { SboxEvents } from './sbox.events';
import ResetDefault from './sbox.reset';
import { SboxTemplate } from './sbox.template';
import { populateSboxOptions } from './sbox.util';

export class Sbox {
  private template: SboxTemplate;
  private events: SboxEvents;
  private resetDefault: ResetDefault;

  /**
   * Default Values
   * @private
   */
  private options: ISboxOptions = {
    multiSelect: false,
    checkboxSelection: true,
    size: Size.Medium,
    pagination: true,
    selector: null,
    tabindex: 0,
    name: '',
    id: '',
    style: '',
    noSelection: null,
    noSelectionValue: '',
    value: undefined,
    noTitleValue: false,
    showCellTitle: true,
    validation: null,
    typeHeader: true,
    searchMethod: SearchMethod.Contains,
    inputMode: false,
    isListReadonly: false,
    itemPerPage: 20,
    width: null,
    autoWidth: true,
    optionAutoWidth: false,
    height: null,
    nextBtnText: 'Next',
    prevBtnText: 'Previous',
    btnText: 'OK',
    hasResetButton: false,
    resetButtonText: 'Reset',
    hasReloadButton: false,
    reloadButtonText: 'Reload',
    cls: null,
    resizeOnLoad: false,
    showSelectedPanel: true, // if multiSelect true
    toggleHide: false, // item panel hide by toggle
    inputCls: null,
    emptyText: 'Type..',
    dataCache: true,
    expandEvent: 'click.sbox', //click,mouseover
    collapseEvent: 'click.sbox', //mousemove
    dataStore: {
      ajax: {
        url: null,
        data: {},
        dataType: 'json',
        type: 'get',
        cache: false,
        success: undefined,
        error: undefined,
        beforeSend: undefined,
        complete: undefined,
      },
      json: undefined,
      arrayList: undefined,
    },
    listners: {
      onSelect: undefined,
      onSubmit: undefined,
      onRemove: undefined,
      onSearch: undefined
    },
  };

  constructor(settings: ISboxOptions) {
    settings = populateSboxOptions($(settings.selector), settings);

    if (settings) $.extend(true, this.options, settings);

    this.template = new SboxTemplate(this.options);
    this.events = new SboxEvents(this.options, this.template);
    this.template.setEventObject(this.events);
    this.resetDefault = new ResetDefault(this.options, this.template, null);

    this.init();
  }

  init() {
    this.template.prepareHTML();
    this.resetDefault.set(false);

    this.events.dataFetch();

    if (this.options.typeHeader) {
      this.template.inputEl.on('focus.sbox', (e) => {
        const el = $(this);
        if (el.text() == this.options.emptyText) {
          el.empty();
        }
      });
    }

    if (!this.options.isListReadonly) {
      this.events.bindKeyEvent();
    }
    $(document).on('click.w2lSbox', (e) => {
      const targetEl = $(e.target) as any;
      if (
        targetEl.parents('.w2l-sbox-comboPanel').length < 1 &&
        targetEl.parents('.w2l-sbox-itemDataContainer').length < 1 &&
        targetEl.parents('.w2l-sbox-paginationContainer').length < 1
      ) {
        if (
          !this.options.multiSelect &&
          this.template.inputEl.find('.w2l-sbox-colorCell').length < 1 &&
          this.template.getInputText() == ''
        ) {
          this.template.selectedItemContainer.find('input[type=hidden]').val('');
        }
        this.template.hidePanel();
      } else {
        this.template.hideOtherSBOX(targetEl.closest('.w2l-sbox'));
      }
    });

    if (this.options.resizeOnLoad) {
      $(window).on('resize.sbox', () => {
        this.init();
      });
    }
  }

  resetValue(isEmpty: boolean) {
    this.resetDefault.set(isEmpty);
  }

  getValue() {
    const allIds = this.template.getSelectedId();
    return typeof allIds == 'object' ? (allIds.length > 1 ? allIds : allIds[0]) : allIds;
  }

  setValue(value: string, displayValue: string) {
    this.template.selectedItemContainer.find('input[type=hidden]').each((item: any) => {
      item.val(value);
    });
    this.template.inputEl.text(displayValue || value);
  }

  getSelectedName() {
    return this.template.getSelectedName();
  }

  setDataStore(dataStore: any) {
    if (!this.events.tempDataStore) {
      this.events.tempDataStore = this.options.dataStore;
    }
    this.options.dataStore = dataStore;
  }

  getDataStore() {
    return this.options.dataStore;
  }

  resetDataStore() {
    this.events.resetDataStore();
  }

  get params() {
    return {
      id: this.options.id,
      name: this.options.name,
      cls: this.options.cls,
      value: this.options.value,
      inputCls: this.options.inputCls,
    };
  }
}
