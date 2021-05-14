import $ from 'jquery';
import { ISboxOptions } from './interfaces';
import { SboxEvents } from './sbox.events';

export class SboxTemplate {
  private options: ISboxOptions;
  private events: SboxEvents;

  sBoxEl: JQuery<HTMLElement> | null;
  selectorEl: JQuery<HTMLElement> | null;
  handlerEl: JQuery<HTMLElement> | null;
  inputEl: JQuery<HTMLElement> | null;
  itemContainerEl: JQuery<HTMLElement> | null;
  selectedItemContainer: JQuery<HTMLElement> | null;
  paginationContainer: JQuery<HTMLElement> | null;
  doneBtn: JQuery<HTMLElement> | null;
  resetBtn: JQuery<HTMLElement> | null;
  reloadBtn: JQuery<HTMLElement> | null;
  prevBtn: JQuery<HTMLElement> | null;
  nextBtn: JQuery<HTMLElement> | null;
  loaderEl: JQuery<HTMLElement> | null;
  emptyTextPanel: string;
  clickEventCounter = 0;
  itemClickEventCounter = 0;

  constructor(options: ISboxOptions) {
    this.options = options;
  }

  setEventObject(events: SboxEvents) {
    this.events = events
  }

  getSelector() {
    return $(this.options.selector);
  }

  getSBOxId() {
    return this.options.id || 'w2l-sbox-' + ($('.w2l-sbox').length + 1);
  }

  getSelectedId() {
    const selectedIds = [];
    this.selectedItemContainer.find('input[type=hidden]').each(function (i) {
      let thisValue = $(this).val();
      if (thisValue || thisValue == '') {
        selectedIds.push(thisValue);
      }
    });
    return selectedIds;
  }

  getSelectedName() {
    const selectedName = $.trim(this.inputEl.text());
    return selectedName != this.options.emptyText ? selectedName : '';
  }

  getInputText() {
    const text = $.trim(this.inputEl.text());
    return text == this.options.emptyText ? '' : text;
  }

  prepareLoaderContainer() {
    this.loaderEl = $('<div/>');
    this.loaderEl.addClass('w2l-sbox-loader');
  }

  prepareHTML() {
    if (this.options.emptyText) {
      this.emptyTextPanel = '<span class="placeholder">' + this.options.emptyText + '</span>';
    }
    const selector = this.getSelector();
    selector.empty();
    selector.removeData('sbox');


    const selectorWidth = this.options.width ? this.options.width : `${selector.outerWidth()}px`;
    this.sBoxEl = $('<div/>');
    this.sBoxEl.addClass('w2l-sbox');
    this.sBoxEl.addClass(`w2l-sbox-${this.options.size}`);

    if (this.options.cls) {
      this.sBoxEl.addClass(this.options.cls);
    }
    if (this.options.style) {
      this.sBoxEl.attr('style', this.options.style);
    }
    const containerId = this.getSBOxId();
    this.sBoxEl.attr('id', containerId);
    if (this.options.width) {
      this.sBoxEl.css('width', parseInt(this.options.width, 10));
    }
    this.selectorEl = $('<div/>');
    this.selectorEl.addClass('w2l-sbox-comboPanel');
    this.selectorEl.attr('tabindex', this.options.tabindex);

    this.handlerEl = $('<div/>');
    this.handlerEl.attr('class', 'w2l-sbox-comboPanelHandler w2l-sbox-inb');
    if (this.options.height) {
      this.handlerEl.css('height', parseInt(this.options.height, 10));
    }
    this.inputEl = $('<div/>');
    if (this.options.typeHeader) {
      this.inputEl.attr('contenteditable', 'true');
    }
    if (this.options.height) {
      this.inputEl.css({
        height: parseInt(this.options.height, 10),
        lineHeight: parseInt(this.options.height, 10) - 6 + 'px',
      });
    }
    this.inputEl.attr('class', 'w2l-sbox-input w2l-sbox-inb');
    if (!this.options.autoWidth) {
      this.inputEl.css({ width: selectorWidth });
    }
    this.inputEl.html(this.emptyTextPanel);
    this.inputEl.attr('title', this.options.emptyText);
    this.selectorEl.append(this.inputEl);
    this.selectorEl.append(this.handlerEl);
    this.sBoxEl.append(this.selectorEl);
    this.itemContainerEl = $('<div/>');
    this.itemContainerEl.addClass('w2l-sbox-itemContainer').hide();
    if (this.options.width && !this.options.optionAutoWidth) {
      this.itemContainerEl.css('width', Number(this.options.width) - 2);
    } else if (this.options.width && this.options.optionAutoWidth) {
      this.itemContainerEl.css('minWidth', Number(this.options.width) - 2);
    }
    this.sBoxEl.append(this.itemContainerEl);
    this.selectedItemContainer = $('<div/>');
    this.selectedItemContainer.addClass('w2l-sbox-selectedItemContainer').hide();
    this.sBoxEl.append(this.selectedItemContainer);
    selector.append(this.sBoxEl);
  }

  generateButton(cls: string, btnText: string): JQuery<HTMLElement> {
    const btn = $('<button/>');
    btn.addClass(cls);
    btn.attr('type', 'button');
    btn.html(btnText);
    return btn;
  }

  preparePagination() {
    this.paginationContainer = $('<div/>');
    this.paginationContainer.addClass('w2l-sbox-paginationContainer');
    if (this.options.multiSelect) {
      this.doneBtn = this.generateButton('w2l-sbox-doneBtn', this.options.btnText);
      this.paginationContainer.empty().append(this.doneBtn);
      this.events.submitBtnEvent();
    }
    if (this.options.hasResetButton) {
      this.resetBtn = this.generateButton('w2l-sbox-resetBtn', this.options.resetButtonText);
      this.paginationContainer.append(this.resetBtn);
      this.events.resetBtnEvent();
    }
    if (this.options.hasReloadButton && this.options.dataStore.ajax.url) {
      this.reloadBtn = this.generateButton('w2l-sbox-reloadBtn', this.options.reloadButtonText);
      this.paginationContainer.append(this.reloadBtn);
      this.events.reloadBtnEvent();
    }
    if (this.options.pagination && this.events.totalData > this.options.itemPerPage) {
      this.nextBtn = this.generateButton('w2l-sbox-nextBtn', '');
      this.nextBtn.attr('title', this.options.nextBtnText);
      if (this.events.lastFetchDataNo + this.options.itemPerPage >= this.events.totalData) {
        this.nextBtn.attr('disabled', 'true');
        this.nextBtn.off('click.sbox');
      } else {
        this.events.nextBtnEvent();
      }
      this.prevBtn = this.generateButton('w2l-sbox-prevBtn', '');
      this.prevBtn.attr('title', this.options.prevBtnText);
      if (this.events.lastFetchDataNo < 1) {
        this.prevBtn.attr('disabled', 'true');
        this.prevBtn.off('click.sbox');
      } else {
        this.events.prevBtnEvent();
      }
      this.paginationContainer.append(this.prevBtn).append(this.nextBtn);
    } else {
      if (this.options.multiSelect) {
        this.doneBtn.css({ float: 'none' });
        this.paginationContainer.css({ textAlign: 'left' });
      } else {
        if (
          (!this.options.hasResetButton && !this.options.hasReloadButton) ||
          (!this.options.hasResetButton && this.options.hasReloadButton && !this.options.dataStore.ajax.url)
        ) {
          this.paginationContainer = null;
        }
      }
    }
    if (this.paginationContainer != null) {
      this.paginationContainer.append('<div style="clear:both"></div>');
    }
  }

  showPanel(isLoading = false) {
    this.clickEventCounter = 1;
    if (this.itemContainerEl.is(':hidden') || isLoading) {
      this.itemContainerEl.slideDown(200, () => {
        this.clickEventCounter = 0;
        this.sBoxEl.removeClass('w2l-box-active').addClass('w2l-box-active');
      });
    } else {
      if (this.options.toggleHide && $.inArray(this.options.expandEvent, ['mouseover', 'hover']) == -1) {
        this.hidePanel();
      }
    }
  }

  hidePanel() {
    this.itemContainerEl.slideUp(200, () => {
      this.clickEventCounter = 0;
      this.sBoxEl.removeClass('w2l-box-active');
      if (
        this.options.multiSelect ||
        (this.getInputText() === '' && this.inputEl.find('.w2l-sbox-colorCell').length < 1)
      ) {
        this.inputEl.html(this.emptyTextPanel);
      }
    });
  }

  focusSBox() {
    if (!this.options.typeHeader) {
      this.itemContainerEl
        .find('.w2l-sbox-cell:first')
        .addClass('w2l-sbox-hover')
        .prepend("<a href='#' class='tempFocus'></a> ");
      this.itemContainerEl.find('.tempFocus').trigger('focus');
    } else {
      this.inputEl.trigger('focus');
    }
    this.hideOtherSBOX(this.inputEl.closest('.w2l-sbox'));
  }

  hideOtherSBOX(currentEl: JQuery<Element>) {
    $('.w2l-sbox').removeClass('w2l-box-active');
    currentEl.addClass('w2l-box-active');
    $('.w2l-sbox:not(.w2l-box-active)').find('.w2l-sbox-itemContainer').hide();
  }

  getSubCell(cls = '') {
    const subCell = $('<div/>');
    if (cls) {
      subCell.attr('class', cls);
    }
    return subCell;
  }

  prepareCell(data: any) {
    if (!data) {
      throw 'No Data Yet';
    }
    let dataId: string,
      dataName: string,
      dataImage: string,
      dataColor: string,
      dataTip = null;
    if (typeof data == 'object') {
      if (data.id || data.name == '') {
        dataId = data.id;
      }
      if (data.name || data.name == '') {
        dataName = data.name;
      }
      if (data.image) {
        dataImage = data.image;
      }
      if (data.color) {
        dataColor = data.color;
      }
      if (data.tip) {
        dataTip = $.trim(data.tip);
      }
      if (!data.id && !data.name && !data.image && data.length == 2) {
        dataId = $.trim(data[0]);
        dataName = $.trim(data[1]);
      }
    } else {
      dataId = $.trim(data);
      dataName = $.trim(data);
    }

    const itemEl = $('<div/>');
    itemEl.attr('class', 'w2l-sbox-cell');
    itemEl.data('dataId', dataId);
    itemEl.data('cellData', data);
    if (this.options.showCellTitle) {
      itemEl.attr('title', dataTip ? dataTip : dataName);
    }
    if (this.options.multiSelect && this.options.checkboxSelection) {
      const checkCell = this.getSubCell();
      const inpCheck = $('<input/>');
      inpCheck.attr('type', 'checkbox');
      inpCheck.val(dataId);
      checkCell.append(inpCheck);
      itemEl.append(checkCell);
    }
    if (dataImage) {
      const imageCell = this.getSubCell();
      imageCell.addClass('w2l-sbox-imageCell');
      const imgEl = $('<img/>');
      imgEl.attr('src', dataImage);
      if (dataName) {
        imgEl.attr('alt', dataName);
        imgEl.attr('title', dataName);
      }
      imageCell.append(imgEl);
      itemEl.append(imageCell);
    }
    if (dataColor) {
      const colorCell = this.getSubCell();
      colorCell.addClass('w2l-sbox-colorCell');
      const colorEl = $('<div/>');
      colorEl.css('backgroundColor', dataColor);
      colorCell.append(colorEl);
      itemEl.append(colorCell);
    }

    const nameCell = this.getSubCell();
    nameCell.addClass('w2l-sbox-nameCell');
    if (dataName) {
      nameCell.html(dataName);
    }
    itemEl.append(nameCell);
    if (!this.options.multiSelect && !this.options.checkboxSelection && !dataImage) {
      nameCell.css('display', 'block');
    }
    const selectedIds = this.getSelectedId();
    if (selectedIds.length > 0 && dataId && $.inArray(dataId.toString(), selectedIds) > -1) {
      itemEl.addClass('w2l-sbox-selected');
      if (this.options.multiSelect && this.options.checkboxSelection) {
        itemEl.find('input[type=checkbox]').attr('checked', 'true');
      }
    }
    // Event Bind
    if (!this.options.isListReadonly) {
      itemEl.on('click.sbox', (e) => {
        if (this.itemClickEventCounter < 1) {
          this.itemClickEventCounter++;
          this.cellBind(itemEl);
          setTimeout(() => {
            this.itemClickEventCounter = 0;
          }, 600);
        }
        e.stopPropagation();
      });
      if (this.options.multiSelect && this.options.checkboxSelection) {
        itemEl.find('input[type=checkbox]').on('click.sbox', (e) => {
          if (this.itemClickEventCounter < 1) {
            this.itemClickEventCounter++;
            this.cellBind(itemEl);
            setTimeout(() => {
              this.itemClickEventCounter = 0;
            }, 600);
          }
        });
      }
    }
    if (this.options.isListReadonly) {
      itemEl.css({ cursor: 'text' });
    }
    itemEl.on('mouseover', (e) => {
      itemEl.addClass('w2l-sbox-hover');
    });
    itemEl.on('mouseout', (e) => {
      itemEl.removeClass('w2l-sbox-hover');
    });
    return itemEl;
  }

  getHiddenInput(dataId: string) {
    const inputHdEl = $('<input/>');
    inputHdEl.attr('name', this.options.name || this.getSelector().attr('id'));
    inputHdEl.attr('type', 'hidden');
    if (dataId) {
      inputHdEl.val(dataId);
    } else {
      inputHdEl.addClass('w2l-sbox-inpInit');
    }
    if (this.options.inputCls) {
      inputHdEl.addClass(this.options.inputCls);
    }
    if (this.options.validation) {
      inputHdEl.attr('validation', this.options.validation);
      inputHdEl.addClass('sbox-combo');
      if (this.sBoxEl.find('.w2l-sbox-comboPanel').hasClass('error')) {
        inputHdEl.addClass('error');
      }
    }
    return inputHdEl;
  }

  prepareItem(data: any) {
    if (data || data == 'loading') {
      const itemDataContainer = $('<div/>');
      itemDataContainer.addClass('w2l-sbox-itemDataContainer');
      if (this.options.noSelection) {
        itemDataContainer.append(
          this.prepareCell({ id: this.options.noSelectionValue, name: this.options.noSelection })
        );
      }
      if (data != 'loading') {
        for (let i = 0; i < data.length; i++) {
          itemDataContainer.append(this.prepareCell(data[i]));
        }
      } else {
        this.itemContainerEl.show();
      }
      // for auto hiding problem when datatype json or arrayList
      this.itemContainerEl.find('.w2l-sbox-itemDataContainer').hide();
      this.itemContainerEl.find('.w2l-sbox-paginationContainer').hide();
      setTimeout(() => {
        this.itemContainerEl.find('.w2l-sbox-itemDataContainer').not('.w2l-sbox-itemDataContainer:last').remove();
        this.itemContainerEl.find('.w2l-sbox-paginationContainer').not('.w2l-sbox-paginationContainer:last').remove();
      }, 100);

      this.itemContainerEl.append(itemDataContainer);
      if (this.options.pagination || this.options.multiSelect) {
        this.preparePagination();
        this.itemContainerEl.append(this.paginationContainer);
      }
    }
  }

  multipleSelectedCell(dataId: string, name: string, isSingle: boolean, image: string) {
    if (this.selectedItemContainer.find("input[value='" + dataId + "']").length < 1) {
      const selectedCell = this.getSubCell('w2l-sbox-selectedCell');
      selectedCell.data('dataId', dataId);
      let selectedCellRemoveItem: JQuery<HTMLElement>;
      if (!isSingle) {
        if (image) {
          const selectedImageCellItem = this.getSubCell('w2l-sbox-selectedCellItem');
          selectedImageCellItem.html(image);
          selectedCell.append(selectedImageCellItem);
        }
        const selectedCellItem = this.getSubCell('w2l-sbox-selectedCellItem');
        selectedCellItem.text(name);

        selectedCell.append(selectedCellItem);
        selectedCellRemoveItem = this.getSubCell('w2l-sbox-selectedCellItem');
        selectedCellRemoveItem.addClass('w2l-sbox-remove');
        selectedCell.append(selectedCellRemoveItem);
      }
      selectedCell.append(this.getHiddenInput(dataId));
      if (selectedCellRemoveItem) {
        selectedCellRemoveItem.on('click.sbox', (e) => {
          const selectedIds = this.getSelectedId();
          if (selectedIds.length > 0 && dataId && $.inArray(dataId.toString(), selectedIds) > -1) {
            const itemEl = this.sBoxEl.find('.w2l-sbox-selected').filter((idx, el) => $(el).data('dataId') === dataId);
            if (itemEl) {
              itemEl.removeClass('w2l-sbox-selected');
              if (this.options.multiSelect && this.options.checkboxSelection) {
                itemEl.find('input[type=checkbox]').removeAttr('checked');
              }
              if (this.options.listners.onSelect && typeof this.options.listners.onSelect == 'function') {
                this.options.listners.onSelect(
                  itemEl,
                  '',
                  null
                );
              }
            }
          }
          selectedCellRemoveItem.parents('.w2l-sbox-selectedCell').remove();
          if (this.selectedItemContainer.find('.w2l-sbox-selectedCell').length < 1) {
            this.selectedItemContainer.empty().append(this.getHiddenInput('')).hide();
          }
          if (this.options.listners.onRemove && typeof this.options.listners.onRemove == 'function') {
            this.options.listners.onRemove(selectedCellRemoveItem, this.sBoxEl, this);
          }

          e.stopPropagation();
        });
      }
      if (isSingle) {
        this.selectedItemContainer.empty().append(selectedCell).hide();
      } else {
        if (this.selectedItemContainer.find('.w2l-sbox-selectedCell').length > 0) {
          this.selectedItemContainer.find('.w2l-sbox-inpInit').remove();
          this.selectedItemContainer.find('.errorlist').remove();
        } else {
          this.selectedItemContainer.empty();
        }
        this.selectedItemContainer.append(selectedCell).show();
      }
      if (this.options.multiSelect) {
        if (!this.options.showSelectedPanel) {
          this.selectedItemContainer.hide();
        } else {
          this.selectedItemContainer.show();
        }
      }
    }
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
        this.itemContainerEl.find(".w2l-sbox-selected").removeClass("w2l-sbox-selected");
        this.setInputValue(name, image);
        if (color) {
          this.setColorInputValue(name, color);
        }
        this.multipleSelectedCell(dataId, '', true, image);
        this.hidePanel();
      } else {
        this.multipleSelectedCell(dataId, name, false, image);
        if (this.options.multiSelect && this.options.checkboxSelection) {
          el.find('input[type=checkbox]').attr('checked', 'true');
        }
      }
      el.addClass('w2l-sbox-selected');
    } else {
      el.removeClass('w2l-sbox-selected');
      if (this.options.multiSelect && this.options.checkboxSelection) {
        el.find('input[type=checkbox]').removeAttr('checked');
      }
      this.selectedItemContainer
        .find("input[value='" + dataId + "']")
        .parent()
        .remove();
    }
    if (this.options.listners.onSelect && typeof this.options.listners.onSelect == 'function') {
      this.options.listners.onSelect(
        el,
        el.data('cellData'),
        this.selectedItemContainer.find("input[value='" + dataId + "']")
      );
    }
  }

  setInputValue(name: string, image: string) {
    let currentValue = '';
    name = $.trim(name);
    name = name.replace(/&nbsp;/g, '');
    if (name.substring(0, 1) == '.') {
      name = name.replace(/\./g, '');
    }
    let inpVal = name;
    if (image) {
      inpVal =
        '<div class="w2l-sbox-imageCell">' +
        image +
        '</div>' +
        '<div class="w2l-sbox-nameCell">' +
        name || '' + '</div>';
    }
    if (!this.options.multiSelect && !this.options.noTitleValue) {
      currentValue = $('<p>' + inpVal + '</p>').text();
      this.inputEl.html(inpVal);
    }
    return currentValue;
  }

  setColorInputValue(name: string, color: string) {
    let currentValue = '';
    name = $.trim(name);
    name = name.replace(/&nbsp;/g, '');
    if (name.substring(0, 1) == '.') {
      name = name.replace(/\./g, '');
    }
    let inpVal = name;
    if (color) {
      inpVal =
        '<div class="w2l-sbox-colorCell">' +
        color +
        '</div>' +
        '<div class="w2l-sbox-nameCell">' +
        name || '' + '</div>';
    }
    if (!this.options.noTitleValue) {
      currentValue = $('<p>' + inpVal + '</p>').text();
      this.inputEl.html(inpVal);
    }
    return currentValue;
  }
}
