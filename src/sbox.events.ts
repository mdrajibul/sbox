import $ from 'jquery';
import { ISboxOptions } from './interfaces';
import { getArrayData, getArrayElements, getJsonData } from './sbox.processor';
import ResetDefault from './sbox.reset';
import { SboxTemplate } from './sbox.template';
import { sbAjax } from './sbox.util';

export class SboxEvents {
  private options: ISboxOptions;
  private template: SboxTemplate;
  private resetDefault: ResetDefault;

  currentValue: any;
  lastFetchDataNo = 0;
  dataObject: any;
  clickEventCounter = 0;
  totalData = 0;
  tempDataStore: any;

  constructor(options: ISboxOptions, template: SboxTemplate) {
    this.options = options;
    this.template = template;
    this.tempDataStore = this.options.dataStore;
    this.resetDefault = new ResetDefault(this.options, this.template, null);
  }

  setPaginationProperty(queryEmpty = undefined) {
    if (this.options.pagination) {
      this.options.dataStore.ajax.data.offset = this.lastFetchDataNo;
      this.options.dataStore.ajax.data.limit = this.options.itemPerPage;
    }
    if (this.options.typeHeader) {
      let inputText = this.template.getInputText();
      this.options.dataStore.ajax.data.q =
        !queryEmpty && this.options.typeHeader && inputText != this.currentValue ? this.template.getInputText() : '';
    }
  }

  clickEventBind(onlyPreparedData = false) {
    let isAjaxCalled = false;

    if (!this.options.dataCache || (this.options.dataCache && !this.dataObject)) {
      if (this.options.dataStore.json || this.options.dataStore.arrayList) {
        this.dataObject = this.options.dataStore.json || this.options.dataStore.arrayList;
        this.totalData = this.options.dataStore.json.length || this.options.dataStore.arrayList.length;
      } else if (this.options.dataStore.ajax && this.options.dataStore.ajax.url) {
        isAjaxCalled = true;
        this.setPaginationProperty(true);
        this.doAjax(true, true, true);
      }
      if (!isAjaxCalled) {
        let displayData = this.options.dataStore.json || this.isNoAjaxFetch
          ? getJsonData(this.dataObject, this.options, this.template, this.lastFetchDataNo, true)
          : getArrayData(this.dataObject, this.options, this.template, this.lastFetchDataNo, true);

        if (displayData.length > 0) {
          this.template.prepareItem(displayData);
        } else {
          this.template.itemContainerEl.html(
            '<div class="w2l-sbox-itemDataContainer"><div class="w2l-sbox-nameCell">No data</div></div>'
          );
        }
      }
    }
    if (!onlyPreparedData) {
      if (this.template.sBoxEl.hasClass('w2l-box-active')) {
        this.template.hidePanel();
      } else {
        this.template.showPanel();
      }
    }
    this.template.focusSBox();
  }

  cellBind(el: JQuery<HTMLElement>) {
    const dataId = el.data('dataId');
    let image: string, color: string;

    const name = $.trim(el.find('.w2l-sbox-nameCell').text());

    if (el.find('.w2l-sbox-imageCell').length > 0) {
      image = el.find('.w2l-sbox-imageCell').html();
    }
    if (el.find('.w2l-sbox-colorCell').length > 0) {
      color = el.find('.w2l-sbox-colorCell').html();
    }
    if (!el.hasClass('w2l-sbox-selected')) {
      if (!this.options.multiSelect) {
        this.template.itemContainerEl.find('.w2l-sbox-selected').removeClass('w2l-sbox-selected');
        el.addClass('w2l-sbox-selected');
        this.template.setInputValue(name, image);
        if (color) {
          this.template.setColorInputValue(name, color);
        }
        this.template.multipleSelectedCell(dataId, '', true, image);
        this.template.hidePanel();
      } else {
        el.addClass('w2l-sbox-selected');
        this.template.multipleSelectedCell(dataId, name, false, image);
        if (this.options.multiSelect && this.options.checkboxSelection) {
          el.find('input[type=checkbox]').attr('checked', 'true');
        }
      }
    } else {
      el.removeClass('w2l-sbox-selected');
      if (this.options.multiSelect && this.options.checkboxSelection) {
        el.find('input[type=checkbox]').removeAttr('checked');
      }
      this.template.selectedItemContainer
        .find("input[value='" + dataId + "']")
        .parent()
        .remove();
    }
    if (this.options.listners.onSelect && typeof this.options.listners.onSelect == 'function') {
      this.options.listners.onSelect(
        el,
        el.data('cellData'),
        this.template.selectedItemContainer.find("input[value='" + dataId + "']")
      );
    }
  }

  bindKeyEvent() {
    this.template.sBoxEl.on('keydown', (e) => {
      const el = this.template.itemContainerEl;
      const key = e.key;
      const lastHover = el.find('.w2l-sbox-hover:last');
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter') {
        if (key === 'ArrowDown') {
          const nextEl = lastHover.removeClass('w2l-sbox-hover').next();
          if (lastHover.length > 0 && nextEl.length > 0) {
            nextEl.addClass('w2l-sbox-hover');
          } else {
            el.find('.w2l-sbox-cell:first').addClass('w2l-sbox-hover');
          }
        } else if (key === 'ArrowUp') {
          const prevEl = lastHover.removeClass('w2l-sbox-hover').prev();
          if (prevEl.length > 0) {
            prevEl.addClass('w2l-sbox-hover');
          } else {
            el.find('.w2l-sbox-cell:last').addClass('w2l-sbox-hover');
          }
        } else if (key === 'Enter') {
          let currentCellEl: JQuery<HTMLElement>;
          if (this.options.multiSelect && this.options.checkboxSelection) {
            const selectedEl = el.find('.w2l-sbox-hover:last');
            const dataId = selectedEl ? selectedEl.data('dataId') : '';
            if (selectedEl.hasClass('w2l-sbox-selected')) {
              selectedEl.removeClass('w2l-sbox-selected');
              if (this.options.multiSelect && this.options.checkboxSelection) {
                selectedEl.find('input[type=checkbox]').removeAttr('checked');
              }
              this.template.selectedItemContainer
                .find("input[value='" + dataId + "']")
                .parent()
                .remove();
            } else {
              selectedEl.addClass('w2l-sbox-selected');
              selectedEl.find('input[type=checkbox]').attr('checked', 'true');
              const name = selectedEl.find('.w2l-sbox-nameCell').text();
              const imageCell = selectedEl.find('.w2l-sbox-imageCell');
              let image: string;
              if (imageCell.length > 0) {
                image = imageCell.html();
              }
              this.template.multipleSelectedCell(dataId, name, false, image);
            }
            currentCellEl = selectedEl;
          } else {
            currentCellEl = el.find('.w2l-sbox-hover:last');
            this.currentValue = $.trim(currentCellEl.find('.w2l-sbox-nameCell').text());
            this.template.inputEl.empty().text(this.currentValue);
            this.template.selectedItemContainer
              .empty()
              .append(this.template.getHiddenInput(currentCellEl.data('dataId')))
              .hide();
            el.slideUp(200);
          }
          if (this.options.listners.onSelect && typeof this.options.listners.onSelect == 'function') {
            const currentDataId = currentCellEl.data('dataId');
            this.options.listners.onSelect(
              currentCellEl,
              currentCellEl.data('cellData'),
              this.template.selectedItemContainer.find("input[value='" + currentDataId + "']")
            );
          }
        }
        e.preventDefault();
      }
    });
  }

  dataFetch() {
    const selector = this.template.getSelector();
    if (this.options.typeHeader) {
      let data: any;
      let ajaxKeyAccess = true;
      const startKeyup = false;
      this.template.inputEl.on('keyup.sbox', (e) => {
        const el = $(this);
        const key = e.key;

        if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Enter') {

          if (this.options.dataStore.json || this.options.dataStore.arrayList || this.isNoAjaxFetch) {
            const data = this.options.dataStore.json || this.isNoAjaxFetch
              ? getJsonData(this.dataObject, this.options, this.template)
              : getArrayData(this.dataObject, this.options, this.template);
            if (ajaxKeyAccess) {
              ajaxKeyAccess = false;
              setTimeout(() => {
                if (this.options.listners.onSearch && typeof this.options.listners.onSearch == 'function') {
                  this.options.listners.onSearch(this.template.getInputText(), data, this.template.inputEl);
                }
                if (data.length > 0) {
                  this.template.prepareItem(data);
                  this.template.itemContainerEl.slideDown(200);
                } else {
                  this.template.itemContainerEl.slideUp(200);
                }
                ajaxKeyAccess = true;
              }, 200);
            }
          } else if (!this.isNoAjaxFetch) {
            this.lastFetchDataNo = 0;
            if (ajaxKeyAccess) {
              ajaxKeyAccess = false;
              setTimeout(() => {
                this.setPaginationProperty();
                this.doAjax(true, false);
                ajaxKeyAccess = true;
              }, 800);
            }
          }
        }
        if (this.options.inputMode) {
          const inpEl = selector.find('input[type=hidden]');
          inpEl.val($.trim(el.text()));
        }
      });
    }

    this.template.selectorEl.on(this.options.expandEvent, (e) => {
      if ($(e.target).parents('.w2l-sbox-comboPanel').length > 0 || $(e.target).hasClass('w2l-sbox-comboPanel')) {
        if (this.clickEventCounter < 1) {
          this.clickEventBind();
        } else {
          this.clickEventCounter = 0;
        }
      }
    });
    if (this.options.collapseEvent && $.inArray(this.options.expandEvent, ['mouseover', 'hover']) > -1) {
      $(document).on(this.options.collapseEvent, (e) => {
        if ($(e.target).parents('.w2l-sbox').length < 1) {
          this.template.hidePanel();
        }
      });
    }
  }

  submitBtnEvent() {
    this.template.doneBtn.on('click.sbox', () => {
      this.template.itemContainerEl.slideUp(200);
      this.template.sBoxEl.removeClass('w2l-box-active');
      if (this.options.listners.onSubmit && typeof this.options.listners.onSubmit == 'function') {
        this.options.listners.onSubmit(this.template.doneBtn, this.template.getSelectedId());
      }
    });
  }

  resetBtnEvent() {
    this.template.resetBtn.on('click.sbox', () => {
      this.resetDataStore();
      this.resetDefault.set(true);
      //itemContainerEl.slideUp(200);
      this.clickEventBind(true);
      //selectorEl.trigger(this.options.expandEvent);
    });
  }

  reloadBtnEvent() {
    this.template.reloadBtn.on('click.sbox', () => {
      this.setPaginationProperty();
      this.doAjax(true);
    });
  }

  nextBtnEvent() {
    this.template.nextBtn.on('click.sbox', () => {
      this.lastFetchDataNo += this.options.itemPerPage;
      this.rePopulateData();
    });
  }

  prevBtnEvent() {
    this.template.prevBtn.on('click.sbox', () => {
      this.lastFetchDataNo -= this.options.itemPerPage;
      this.rePopulateData();
    });
  }

  doAjax(isPage: boolean, keyEvent = undefined, isLoading = false) {
    sbAjax(
      this.options,
      () => {
        if (isLoading) {
          this.template.prepareItem('loading');
        }
        this.template.prepareLoaderContainer();
        this.template.itemContainerEl.find('.w2l-sbox-itemDataContainer').append(this.template.loaderEl);
      },
      () => {
        if (this.template.loaderEl) {
          this.template.loaderEl.remove();
        }
      }
    ).then((res: any) => {
      if (res) {
        this.dataObject = res.data;
        this.totalData = Number(res.total);
        if (isPage) {
          if (keyEvent) {
            if (this.options.listners.onSearch && typeof this.options.listners.onSearch == 'function') {
              this.options.listners.onSearch(
                this.options.dataStore.ajax.data.q,
                this.dataObject,
                this.template.inputEl
              );
            }
            if (this.dataObject.length > 0) {
              this.rePopulateData();
            }
            this.template.showPanel(isLoading);
          } else {
            this.rePopulateData();
            this.template.itemContainerEl.slideDown(50, () => {
              this.clickEventCounter = 0;
            });
          }
        } else {
          this.dataFetch();
        }
        this.template.focusSBox();
      }
    });
  }

  resetDataStore() {
    if (this.tempDataStore) {
      this.options.dataStore = this.tempDataStore;
    }
  }

  private rePopulateData() {

    if (this.options.dataStore.json || this.options.dataStore.arrayList || this.isNoAjaxFetch) {
      let data = getArrayElements(this.dataObject, this.lastFetchDataNo, this.options.itemPerPage);
      if (data && data.length > 0) {
        this.template.prepareItem(data);
      }
      this.template.focusSBox();
    } else if (!this.isNoAjaxFetch) {
      this.setPaginationProperty();
      this.doAjax(true);
    }
  }

  private get isNoAjaxFetch() {
    return this.options.dataStore.ajax.url && this.dataObject && (this.dataObject.length === this.totalData || this.totalData === 0)
  }
}
