(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
    typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SBOX = {}, global.$));
}(this, (function (exports, $) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    exports.SearchMethod = void 0;
    (function (SearchMethod) {
        SearchMethod["StartWith"] = "StartWith";
        SearchMethod["EndWith"] = "EndWith";
        SearchMethod["Contains"] = "Contains";
    })(exports.SearchMethod || (exports.SearchMethod = {}));
    exports.Size = void 0;
    (function (Size) {
        Size["SMALL"] = "small";
        Size["Medium"] = "medium";
        Size["Large"] = "large";
    })(exports.Size || (exports.Size = {}));

    var Browser = {
        mozilla: /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase()),
        webkit: /webkit/.test(navigator.userAgent.toLowerCase()),
        opera: /opera/.test(navigator.userAgent.toLowerCase()),
        msie: /msie/.test(navigator.userAgent.toLowerCase()),
        version: Number(navigator.appVersion),
    };
    var sbAjax = function (options, beforeLoad, completeCallback) {
        if (beforeLoad === void 0) { beforeLoad = undefined; }
        if (completeCallback === void 0) { completeCallback = undefined; }
        return new Promise(function (resolve, reject) {
            return $__default['default'].ajax({
                url: options.dataStore.ajax.url,
                data: options.dataStore.ajax.data,
                dataType: options.dataStore.ajax.dataType,
                type: options.dataStore.ajax.type,
                cache: options.dataStore.ajax.cache,
                success: function (res) {
                    if (options.dataStore.ajax.success && typeof options.dataStore.ajax.success == 'function') {
                        options.dataStore.ajax.success(res);
                    }
                    resolve(res);
                },
                error: function (err) {
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
            });
        });
    };
    var hasSearchString = function (options, mainString, searchString) {
        if (!mainString || !searchString) {
            return false;
        }
        mainString = mainString.toString().trim();
        searchString = searchString.toString().trim();
        var strLength = mainString.length;
        var searchStrLength = searchString.length;
        if (options.searchMethod === exports.SearchMethod.StartWith) {
            return mainString.substring(0, searchStrLength) == searchString;
        }
        else if (options.searchMethod === exports.SearchMethod.EndWith) {
            return mainString.substring(strLength - searchStrLength, strLength) == searchString;
        }
        else {
            return mainString.indexOf(searchString) > -1;
        }
    };
    var getObjects = function (options, obj, key, val, isArray, recursive, searchType) {
        if (isArray === void 0) { isArray = false; }
        if (recursive === void 0) { recursive = false; }
        if (searchType === void 0) { searchType = false; }
        if (val) {
            val = val.toString().toLowerCase();
        }
        var objects = [];
        var nameVal = undefined;
        if (isArray && recursive && obj.length == 2) {
            nameVal = searchType ? obj[0].toString().toLowerCase() : obj[1].toString().toLowerCase();
            if ((val && (searchType ? nameVal == val : hasSearchString(options, nameVal, val))) || !val) {
                objects.push({ id: obj[0], name: obj[1] });
            }
        }
        else {
            for (var i in obj) {
                if (isArray) {
                    key = i;
                }
                if (!obj.hasOwnProperty(i))
                    continue;
                nameVal = obj[key] ? obj[key].toString().toLowerCase() : '';
                if (typeof obj[i] === 'object') {
                    objects = objects.concat(getObjects(options, obj[i], key, val, isArray, true, searchType));
                }
                else if ((val && (searchType ? nameVal == val : hasSearchString(options, nameVal, val))) || !val) {
                    if (!isArray && i == key) {
                        objects.push(obj);
                    }
                    else if (isArray) {
                        objects.push(obj[key]);
                    }
                }
            }
        }
        return objects;
    };
    var populateSboxOptions = function (selector, options) {
        var selectConfig = undefined;
        var replacePanel;
        if (selector.is('select')) {
            selectConfig = {};
            var optionData_1 = [];
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
            var selectedValue_1 = selector.attr('multiple') ? [] : '';
            selector.find('option').each(function () {
                var currentOption = $__default['default'](this);
                var optionNameValue = $__default['default'].trim(currentOption.html());
                var optionIdValue = $__default['default'].trim(currentOption.attr('value'));
                if (typeof optionIdValue == 'undefined') {
                    optionIdValue = optionNameValue;
                }
                var currentValue = { id: optionIdValue, name: optionNameValue };
                if (currentOption.is(':selected')) {
                    if (selector.attr('multiple') && Array.isArray(selectedValue_1)) {
                        selectedValue_1.push(currentValue);
                    }
                    else {
                        selectedValue_1 = currentValue;
                    }
                }
                optionData_1.push(currentValue);
            });
            if (selectedValue_1 != '' || selectedValue_1.length > 0) {
                selectConfig.value = selectedValue_1;
            }
            else {
                var dataValue = selector.attr('data-value');
                if (dataValue) {
                    dataValue = $__default['default'].trim(dataValue);
                    if (selector.attr('multiple')) {
                        dataValue = dataValue.split(':::');
                    }
                }
                selectConfig.value = dataValue ? dataValue : undefined;
            }
            if (selector.attr('multiple') && selectedValue_1.length < 1) {
                var dataIds = selector.attr('data-id');
                if (dataIds) {
                    dataIds = $__default['default'].trim(dataIds);
                    dataIds = JSON.parse(dataIds);
                    selectConfig.value = dataIds ? dataIds : undefined;
                }
            }
            if (optionData_1.length > 0) {
                selectConfig.dataStore = {
                    json: optionData_1,
                };
            }
            if (selectConfig) {
                $__default['default'].extend(selectConfig, options);
            }
            replacePanel = $__default['default']('<div/>');
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
    };

    var getJsonData = function (dataObject, options, template, lastFetchDataNo, isClick) {
        if (lastFetchDataNo === void 0) { lastFetchDataNo = 0; }
        if (isClick === void 0) { isClick = false; }
        var selectedValue = template.getSelectedId();
        var searchValue = isClick && selectedValue.length > 0 && selectedValue[0] != '' ? '' : template.getInputText();
        var data = getObjects(options, dataObject, 'name', searchValue);
        if (options.pagination) {
            data = getArrayElements(data, lastFetchDataNo, options.itemPerPage);
        }
        return data;
    };
    var getArrayData = function (dataObject, options, template, lastFetchDataNo, isClick) {
        if (lastFetchDataNo === void 0) { lastFetchDataNo = 0; }
        if (isClick === void 0) { isClick = false; }
        var selectedValue = template.getSelectedId();
        var searchValue = isClick && selectedValue.length > 0 && selectedValue[0] != '' ? '' : template.getInputText();
        var data = getObjects(options, dataObject, '', searchValue, true);
        if (options.pagination) {
            data = getArrayElements(data, lastFetchDataNo, options.itemPerPage);
        }
        return data;
    };
    var getArrayElements = function (arrayObject, index, total) {
        if (arrayObject.length < 1) {
            return [];
        }
        var newObject = [];
        for (var i = index; i < index + total; i++) {
            if (arrayObject[i]) {
                newObject.push(arrayObject[i]);
            }
        }
        return newObject;
    };

    var ResetDefault = /** @class */ (function () {
        function ResetDefault(options, template, dataObject) {
            this.options = options;
            this.template = template;
            this.dataObject = dataObject;
        }
        ResetDefault.prototype.getExistName = function (dataObject, id) {
            var existObject = getObjects(this.options, dataObject, 'id', id, false, null, true);
            if (existObject && existObject.length) {
                return existObject[0].name;
            }
            return '';
        };
        ResetDefault.prototype.getData = function () {
            return {
                data: this.dataObject,
                total: this.totalData,
            };
        };
        ResetDefault.prototype.setDefaultAjaxValue = function (isSingleSelection) {
            var _this = this;
            if (!this.dataObject) {
                $__default['default'].ajax({
                    url: this.options.dataStore.ajax.url,
                    data: this.options.dataStore.ajax.data,
                    dataType: this.options.dataStore.ajax.dataType,
                    type: this.options.dataStore.ajax.type,
                    cache: this.options.dataStore.ajax.cache,
                    success: function (res) {
                        if (res) {
                            _this.dataObject = res.data;
                            _this.totalData = res.total;
                            _this.name = _this.getExistName(_this.dataObject, _this.id);
                            _this.template.multipleSelectedCell(_this.id, _this.name, isSingleSelection || false, _this.image);
                            if (isSingleSelection) {
                                _this.template.setInputValue(_this.name, _this.image);
                                _this.template.setColorInputValue(_this.name, _this.color);
                            }
                        }
                    },
                });
            }
            else {
                this.template.multipleSelectedCell(this.id, this.name, isSingleSelection || false, this.image);
                if (isSingleSelection) {
                    this.template.setInputValue(this.name, this.image);
                    this.template.setColorInputValue(this.name, this.color);
                }
            }
        };
        ResetDefault.prototype.setDefaultValueProps = function (value) {
            if (typeof value == 'object') {
                if (value.id) {
                    this.id = value.id;
                }
                if (value.name) {
                    this.name = value.name;
                }
                else if (this.id) {
                    if (this.options.dataStore.arrayList) {
                        this.name = getObjects(this.options, this.options.dataStore.arrayList, '', value.id, true, null, true);
                    }
                    else if (this.options.dataStore.json) {
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
            }
            else {
                this.id = value;
                if (this.options.dataStore.arrayList) {
                    this.name = getObjects(this.options, this.options.dataStore.arrayList, '', this.id, true, null, true);
                }
                else if (this.options.dataStore.json) {
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
        };
        ResetDefault.prototype.set = function (emptyValue) {
            if (emptyValue) {
                this.template.inputEl.html(this.template.emptyTextPanel);
                this.template.selectedItemContainer.empty();
            }
            else {
                if ((this.options.value && Array.isArray(this.options.value)) ||
                    (this.options.multiSelect && typeof this.options.value === 'object')) {
                    for (var key in this.options.value) {
                        this.setDefaultValueProps(this.options.value[key]);
                        if (this.id && !this.name && this.options.dataStore.ajax.url) {
                            this.setDefaultAjaxValue(false);
                        }
                        else {
                            this.template.multipleSelectedCell(this.id, this.name, false, this.image);
                        }
                    }
                }
                else if (this.options.value && !$__default['default'].isArray(this.options.value)) {
                    this.setDefaultValueProps(this.options.value);
                    if (this.id && !this.name && this.options.dataStore.ajax.url) {
                        this.setDefaultAjaxValue(true);
                    }
                    else {
                        this.template.multipleSelectedCell(this.id, this.name, true, this.image);
                        this.template.setInputValue(this.name, this.image);
                        this.template.setColorInputValue(this.name, this.color);
                    }
                }
                else {
                    this.template.inputEl.html(this.template.emptyTextPanel);
                    this.template.selectedItemContainer.empty().append(this.template.getHiddenInput('')).hide();
                }
            }
        };
        return ResetDefault;
    }());

    var SboxEvents = /** @class */ (function () {
        function SboxEvents(options, template) {
            this.lastFetchDataNo = 0;
            this.clickEventCounter = 0;
            this.totalData = 0;
            this.options = options;
            this.template = template;
            this.tempDataStore = this.options.dataStore;
            this.resetDefault = new ResetDefault(this.options, this.template, null);
        }
        SboxEvents.prototype.setPaginationProperty = function (queryEmpty) {
            if (queryEmpty === void 0) { queryEmpty = undefined; }
            if (this.options.pagination) {
                this.options.dataStore.ajax.data.offset = this.lastFetchDataNo;
                this.options.dataStore.ajax.data.limit = this.options.itemPerPage;
            }
            if (this.options.typeHeader) {
                var inputText = this.template.getInputText();
                this.options.dataStore.ajax.data.q =
                    !queryEmpty && this.options.typeHeader && inputText != this.currentValue ? this.template.getInputText() : '';
            }
        };
        SboxEvents.prototype.clickEventBind = function (onlyPreparedData) {
            if (onlyPreparedData === void 0) { onlyPreparedData = false; }
            var isAjaxCalled = false;
            if (!this.options.dataCache || (this.options.dataCache && !this.dataObject)) {
                if (this.options.dataStore.json || this.options.dataStore.arrayList) {
                    this.dataObject = this.options.dataStore.json || this.options.dataStore.arrayList;
                    this.totalData = this.options.dataStore.json.length || this.options.dataStore.arrayList.length;
                }
                else if (this.options.dataStore.ajax && this.options.dataStore.ajax.url) {
                    isAjaxCalled = true;
                    this.setPaginationProperty(true);
                    this.doAjax(true, true, true);
                }
                if (!isAjaxCalled) {
                    var displayData = this.options.dataStore.json || this.isNoAjaxFetch
                        ? getJsonData(this.dataObject, this.options, this.template, this.lastFetchDataNo, true)
                        : getArrayData(this.dataObject, this.options, this.template, this.lastFetchDataNo, true);
                    if (displayData.length > 0) {
                        this.template.prepareItem(displayData);
                    }
                    else {
                        this.template.itemContainerEl.html('<div class="w2l-sbox-itemDataContainer"><div class="w2l-sbox-nameCell">No data</div></div>');
                    }
                }
            }
            if (!onlyPreparedData) {
                if (this.template.sBoxEl.hasClass('w2l-box-active')) {
                    this.template.hidePanel();
                }
                else {
                    this.template.showPanel();
                }
            }
            this.template.focusSBox();
        };
        SboxEvents.prototype.cellBind = function (el) {
            var dataId = el.data('dataId');
            var image, color;
            var name = $__default['default'].trim(el.find('.w2l-sbox-nameCell').text());
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
                }
                else {
                    el.addClass('w2l-sbox-selected');
                    this.template.multipleSelectedCell(dataId, name, false, image);
                    if (this.options.multiSelect && this.options.checkboxSelection) {
                        el.find('input[type=checkbox]').attr('checked', 'true');
                    }
                }
            }
            else {
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
                this.options.listners.onSelect(el, el.data('cellData'), this.template.selectedItemContainer.find("input[value='" + dataId + "']"));
            }
        };
        SboxEvents.prototype.bindKeyEvent = function () {
            var _this = this;
            this.template.sBoxEl.on('keydown', function (e) {
                var el = _this.template.itemContainerEl;
                var key = e.key;
                var lastHover = el.find('.w2l-sbox-hover:last');
                if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter') {
                    if (key === 'ArrowDown') {
                        var nextEl = lastHover.removeClass('w2l-sbox-hover').next();
                        if (lastHover.length > 0 && nextEl.length > 0) {
                            nextEl.addClass('w2l-sbox-hover');
                        }
                        else {
                            el.find('.w2l-sbox-cell:first').addClass('w2l-sbox-hover');
                        }
                    }
                    else if (key === 'ArrowUp') {
                        var prevEl = lastHover.removeClass('w2l-sbox-hover').prev();
                        if (prevEl.length > 0) {
                            prevEl.addClass('w2l-sbox-hover');
                        }
                        else {
                            el.find('.w2l-sbox-cell:last').addClass('w2l-sbox-hover');
                        }
                    }
                    else if (key === 'Enter') {
                        var currentCellEl = void 0;
                        if (_this.options.multiSelect && _this.options.checkboxSelection) {
                            var selectedEl = el.find('.w2l-sbox-hover:last');
                            var dataId = selectedEl ? selectedEl.data('dataId') : '';
                            if (selectedEl.hasClass('w2l-sbox-selected')) {
                                selectedEl.removeClass('w2l-sbox-selected');
                                if (_this.options.multiSelect && _this.options.checkboxSelection) {
                                    selectedEl.find('input[type=checkbox]').removeAttr('checked');
                                }
                                _this.template.selectedItemContainer
                                    .find("input[value='" + dataId + "']")
                                    .parent()
                                    .remove();
                            }
                            else {
                                selectedEl.addClass('w2l-sbox-selected');
                                selectedEl.find('input[type=checkbox]').attr('checked', 'true');
                                var name_1 = selectedEl.find('.w2l-sbox-nameCell').text();
                                var imageCell = selectedEl.find('.w2l-sbox-imageCell');
                                var image = void 0;
                                if (imageCell.length > 0) {
                                    image = imageCell.html();
                                }
                                _this.template.multipleSelectedCell(dataId, name_1, false, image);
                            }
                            currentCellEl = selectedEl;
                        }
                        else {
                            currentCellEl = el.find('.w2l-sbox-hover:last');
                            _this.currentValue = $__default['default'].trim(currentCellEl.find('.w2l-sbox-nameCell').text());
                            _this.template.inputEl.empty().text(_this.currentValue);
                            _this.template.selectedItemContainer
                                .empty()
                                .append(_this.template.getHiddenInput(currentCellEl.data('dataId')))
                                .hide();
                            el.slideUp(200);
                        }
                        if (_this.options.listners.onSelect && typeof _this.options.listners.onSelect == 'function') {
                            var currentDataId = currentCellEl.data('dataId');
                            _this.options.listners.onSelect(currentCellEl, currentCellEl.data('cellData'), _this.template.selectedItemContainer.find("input[value='" + currentDataId + "']"));
                        }
                    }
                    e.preventDefault();
                }
            });
        };
        SboxEvents.prototype.dataFetch = function () {
            var _this = this;
            var selector = this.template.getSelector();
            if (this.options.typeHeader) {
                var ajaxKeyAccess_1 = true;
                this.template.inputEl.on('keyup.sbox', function (e) {
                    var el = $__default['default'](_this);
                    var key = e.key;
                    if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Enter') {
                        if (_this.options.dataStore.json || _this.options.dataStore.arrayList || _this.isNoAjaxFetch) {
                            var data_1 = _this.options.dataStore.json || _this.isNoAjaxFetch
                                ? getJsonData(_this.dataObject, _this.options, _this.template)
                                : getArrayData(_this.dataObject, _this.options, _this.template);
                            if (ajaxKeyAccess_1) {
                                ajaxKeyAccess_1 = false;
                                setTimeout(function () {
                                    if (_this.options.listners.onSearch && typeof _this.options.listners.onSearch == 'function') {
                                        _this.options.listners.onSearch(_this.template.getInputText(), data_1, _this.template.inputEl);
                                    }
                                    if (data_1.length > 0) {
                                        _this.template.prepareItem(data_1);
                                        _this.template.itemContainerEl.slideDown(200);
                                    }
                                    else {
                                        _this.template.itemContainerEl.slideUp(200);
                                    }
                                    ajaxKeyAccess_1 = true;
                                }, 200);
                            }
                        }
                        else if (!_this.isNoAjaxFetch) {
                            _this.lastFetchDataNo = 0;
                            if (ajaxKeyAccess_1) {
                                ajaxKeyAccess_1 = false;
                                setTimeout(function () {
                                    _this.setPaginationProperty();
                                    _this.doAjax(true, false);
                                    ajaxKeyAccess_1 = true;
                                }, 800);
                            }
                        }
                    }
                    if (_this.options.inputMode) {
                        var inpEl = selector.find('input[type=hidden]');
                        inpEl.val($__default['default'].trim(el.text()));
                    }
                });
            }
            this.template.selectorEl.on(this.options.expandEvent, function (e) {
                if ($__default['default'](e.target).parents('.w2l-sbox-comboPanel').length > 0 || $__default['default'](e.target).hasClass('w2l-sbox-comboPanel')) {
                    if (_this.clickEventCounter < 1) {
                        _this.clickEventBind();
                    }
                    else {
                        _this.clickEventCounter = 0;
                    }
                }
            });
            if (this.options.collapseEvent && $__default['default'].inArray(this.options.expandEvent, ['mouseover', 'hover']) > -1) {
                $__default['default'](document).on(this.options.collapseEvent, function (e) {
                    if ($__default['default'](e.target).parents('.w2l-sbox').length < 1) {
                        _this.template.hidePanel();
                    }
                });
            }
        };
        SboxEvents.prototype.submitBtnEvent = function () {
            var _this = this;
            this.template.doneBtn.on('click.sbox', function () {
                _this.template.itemContainerEl.slideUp(200);
                _this.template.sBoxEl.removeClass('w2l-box-active');
                if (_this.options.listners.onSubmit && typeof _this.options.listners.onSubmit == 'function') {
                    _this.options.listners.onSubmit(_this.template.doneBtn, _this.template.getSelectedId());
                }
            });
        };
        SboxEvents.prototype.resetBtnEvent = function () {
            var _this = this;
            this.template.resetBtn.on('click.sbox', function () {
                _this.resetDataStore();
                _this.resetDefault.set(true);
                //itemContainerEl.slideUp(200);
                _this.clickEventBind(true);
                //selectorEl.trigger(this.options.expandEvent);
            });
        };
        SboxEvents.prototype.reloadBtnEvent = function () {
            var _this = this;
            this.template.reloadBtn.on('click.sbox', function () {
                _this.setPaginationProperty();
                _this.doAjax(true);
            });
        };
        SboxEvents.prototype.nextBtnEvent = function () {
            var _this = this;
            this.template.nextBtn.on('click.sbox', function () {
                _this.lastFetchDataNo += _this.options.itemPerPage;
                _this.rePopulateData();
            });
        };
        SboxEvents.prototype.prevBtnEvent = function () {
            var _this = this;
            this.template.prevBtn.on('click.sbox', function () {
                _this.lastFetchDataNo -= _this.options.itemPerPage;
                _this.rePopulateData();
            });
        };
        SboxEvents.prototype.doAjax = function (isPage, keyEvent, isLoading) {
            var _this = this;
            if (keyEvent === void 0) { keyEvent = undefined; }
            if (isLoading === void 0) { isLoading = false; }
            sbAjax(this.options, function () {
                if (isLoading) {
                    _this.template.prepareItem('loading');
                }
                _this.template.prepareLoaderContainer();
                _this.template.itemContainerEl.find('.w2l-sbox-itemDataContainer').append(_this.template.loaderEl);
            }, function () {
                if (_this.template.loaderEl) {
                    _this.template.loaderEl.remove();
                }
            }).then(function (res) {
                if (res) {
                    _this.dataObject = res.data;
                    _this.totalData = Number(res.total);
                    if (isPage) {
                        if (keyEvent) {
                            if (_this.options.listners.onSearch && typeof _this.options.listners.onSearch == 'function') {
                                _this.options.listners.onSearch(_this.options.dataStore.ajax.data.q, _this.dataObject, _this.template.inputEl);
                            }
                            if (_this.dataObject.length > 0) {
                                _this.rePopulateData();
                            }
                            _this.template.showPanel(isLoading);
                        }
                        else {
                            _this.rePopulateData();
                            _this.template.itemContainerEl.slideDown(50, function () {
                                _this.clickEventCounter = 0;
                            });
                        }
                    }
                    else {
                        _this.dataFetch();
                    }
                    _this.template.focusSBox();
                }
            });
        };
        SboxEvents.prototype.resetDataStore = function () {
            if (this.tempDataStore) {
                this.options.dataStore = this.tempDataStore;
            }
        };
        SboxEvents.prototype.rePopulateData = function () {
            if (this.options.dataStore.json || this.options.dataStore.arrayList || this.isNoAjaxFetch) {
                var data = getArrayElements(this.dataObject, this.lastFetchDataNo, this.options.itemPerPage);
                if (data && data.length > 0) {
                    this.template.prepareItem(data);
                }
                this.template.focusSBox();
            }
            else if (!this.isNoAjaxFetch) {
                this.setPaginationProperty();
                this.doAjax(true);
            }
        };
        Object.defineProperty(SboxEvents.prototype, "isNoAjaxFetch", {
            get: function () {
                return this.options.dataStore.ajax.url && this.dataObject && (this.dataObject.length === this.totalData || this.totalData === 0);
            },
            enumerable: true,
            configurable: true
        });
        return SboxEvents;
    }());

    var SboxTemplate = /** @class */ (function () {
        function SboxTemplate(options) {
            this.clickEventCounter = 0;
            this.itemClickEventCounter = 0;
            this.options = options;
        }
        SboxTemplate.prototype.setEventObject = function (events) {
            this.events = events;
        };
        SboxTemplate.prototype.getSelector = function () {
            return $__default['default'](this.options.selector);
        };
        SboxTemplate.prototype.getSBOxId = function () {
            return this.options.id || 'w2l-sbox-' + ($__default['default']('.w2l-sbox').length + 1);
        };
        SboxTemplate.prototype.getSelectedId = function () {
            var selectedIds = [];
            this.selectedItemContainer.find('input[type=hidden]').each(function (i) {
                var thisValue = $__default['default'](this).val();
                if (thisValue || thisValue == '') {
                    selectedIds.push(thisValue);
                }
            });
            return selectedIds;
        };
        SboxTemplate.prototype.getSelectedName = function () {
            var selectedName = $__default['default'].trim(this.inputEl.text());
            return selectedName != this.options.emptyText ? selectedName : '';
        };
        SboxTemplate.prototype.getInputText = function () {
            var text = $__default['default'].trim(this.inputEl.text());
            return text == this.options.emptyText ? '' : text;
        };
        SboxTemplate.prototype.prepareLoaderContainer = function () {
            this.loaderEl = $__default['default']('<div/>');
            this.loaderEl.addClass('w2l-sbox-loader');
        };
        SboxTemplate.prototype.prepareHTML = function () {
            if (this.options.emptyText) {
                this.emptyTextPanel = '<span class="placeholder">' + this.options.emptyText + '</span>';
            }
            var selector = this.getSelector();
            selector.empty();
            selector.removeData('sbox');
            var selectorWidth = this.options.width ? this.options.width : selector.outerWidth() + "px";
            this.sBoxEl = $__default['default']('<div/>');
            this.sBoxEl.addClass('w2l-sbox');
            this.sBoxEl.addClass("w2l-sbox-" + this.options.size);
            if (this.options.cls) {
                this.sBoxEl.addClass(this.options.cls);
            }
            if (this.options.style) {
                this.sBoxEl.attr('style', this.options.style);
            }
            var containerId = this.getSBOxId();
            this.sBoxEl.attr('id', containerId);
            if (this.options.width) {
                this.sBoxEl.css('width', parseInt(this.options.width, 10));
            }
            this.selectorEl = $__default['default']('<div/>');
            this.selectorEl.addClass('w2l-sbox-comboPanel');
            this.selectorEl.attr('tabindex', this.options.tabindex);
            this.handlerEl = $__default['default']('<div/>');
            this.handlerEl.attr('class', 'w2l-sbox-comboPanelHandler w2l-sbox-inb');
            if (this.options.height) {
                this.handlerEl.css('height', parseInt(this.options.height, 10));
            }
            this.inputEl = $__default['default']('<div/>');
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
            this.itemContainerEl = $__default['default']('<div/>');
            this.itemContainerEl.addClass('w2l-sbox-itemContainer').hide();
            if (this.options.width && !this.options.optionAutoWidth) {
                this.itemContainerEl.css('width', Number(this.options.width) - 2);
            }
            else if (this.options.width && this.options.optionAutoWidth) {
                this.itemContainerEl.css('minWidth', Number(this.options.width) - 2);
            }
            this.sBoxEl.append(this.itemContainerEl);
            this.selectedItemContainer = $__default['default']('<div/>');
            this.selectedItemContainer.addClass('w2l-sbox-selectedItemContainer').hide();
            this.sBoxEl.append(this.selectedItemContainer);
            selector.append(this.sBoxEl);
        };
        SboxTemplate.prototype.generateButton = function (cls, btnText) {
            var btn = $__default['default']('<button/>');
            btn.addClass(cls);
            btn.attr('type', 'button');
            btn.html(btnText);
            return btn;
        };
        SboxTemplate.prototype.preparePagination = function () {
            this.paginationContainer = $__default['default']('<div/>');
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
                }
                else {
                    this.events.nextBtnEvent();
                }
                this.prevBtn = this.generateButton('w2l-sbox-prevBtn', '');
                this.prevBtn.attr('title', this.options.prevBtnText);
                if (this.events.lastFetchDataNo < 1) {
                    this.prevBtn.attr('disabled', 'true');
                    this.prevBtn.off('click.sbox');
                }
                else {
                    this.events.prevBtnEvent();
                }
                this.paginationContainer.append(this.prevBtn).append(this.nextBtn);
            }
            else {
                if (this.options.multiSelect) {
                    this.doneBtn.css({ float: 'none' });
                    this.paginationContainer.css({ textAlign: 'left' });
                }
                else {
                    if ((!this.options.hasResetButton && !this.options.hasReloadButton) ||
                        (!this.options.hasResetButton && this.options.hasReloadButton && !this.options.dataStore.ajax.url)) {
                        this.paginationContainer = null;
                    }
                }
            }
            if (this.paginationContainer != null) {
                this.paginationContainer.append('<div style="clear:both"></div>');
            }
        };
        SboxTemplate.prototype.showPanel = function (isLoading) {
            var _this = this;
            if (isLoading === void 0) { isLoading = false; }
            this.clickEventCounter = 1;
            if (this.itemContainerEl.is(':hidden') || isLoading) {
                this.itemContainerEl.slideDown(200, function () {
                    _this.clickEventCounter = 0;
                    _this.sBoxEl.removeClass('w2l-box-active').addClass('w2l-box-active');
                });
            }
            else {
                if (this.options.toggleHide && $__default['default'].inArray(this.options.expandEvent, ['mouseover', 'hover']) == -1) {
                    this.hidePanel();
                }
            }
        };
        SboxTemplate.prototype.hidePanel = function () {
            var _this = this;
            this.itemContainerEl.slideUp(200, function () {
                _this.clickEventCounter = 0;
                _this.sBoxEl.removeClass('w2l-box-active');
                if (_this.options.multiSelect ||
                    (_this.getInputText() === '' && _this.inputEl.find('.w2l-sbox-colorCell').length < 1)) {
                    _this.inputEl.html(_this.emptyTextPanel);
                }
            });
        };
        SboxTemplate.prototype.focusSBox = function () {
            if (!this.options.typeHeader) {
                this.itemContainerEl
                    .find('.w2l-sbox-cell:first')
                    .addClass('w2l-sbox-hover')
                    .prepend("<a href='#' class='tempFocus'></a> ");
                this.itemContainerEl.find('.tempFocus').trigger('focus');
            }
            else {
                this.inputEl.trigger('focus');
            }
            this.hideOtherSBOX(this.inputEl.closest('.w2l-sbox'));
        };
        SboxTemplate.prototype.hideOtherSBOX = function (currentEl) {
            $__default['default']('.w2l-sbox').removeClass('w2l-box-active');
            currentEl.addClass('w2l-box-active');
            $__default['default']('.w2l-sbox:not(.w2l-box-active)').find('.w2l-sbox-itemContainer').hide();
        };
        SboxTemplate.prototype.getSubCell = function (cls) {
            if (cls === void 0) { cls = ''; }
            var subCell = $__default['default']('<div/>');
            if (cls) {
                subCell.attr('class', cls);
            }
            return subCell;
        };
        SboxTemplate.prototype.prepareCell = function (data) {
            var _this = this;
            if (!data) {
                throw 'No Data Yet';
            }
            var dataId, dataName, dataImage, dataColor, dataTip = null;
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
                    dataTip = $__default['default'].trim(data.tip);
                }
                if (!data.id && !data.name && !data.image && data.length == 2) {
                    dataId = $__default['default'].trim(data[0]);
                    dataName = $__default['default'].trim(data[1]);
                }
            }
            else {
                dataId = $__default['default'].trim(data);
                dataName = $__default['default'].trim(data);
            }
            var itemEl = $__default['default']('<div/>');
            itemEl.attr('class', 'w2l-sbox-cell');
            itemEl.data('dataId', dataId);
            itemEl.data('cellData', data);
            if (this.options.showCellTitle) {
                itemEl.attr('title', dataTip ? dataTip : dataName);
            }
            if (this.options.multiSelect && this.options.checkboxSelection) {
                var checkCell = this.getSubCell();
                var inpCheck = $__default['default']('<input/>');
                inpCheck.attr('type', 'checkbox');
                inpCheck.val(dataId);
                checkCell.append(inpCheck);
                itemEl.append(checkCell);
            }
            if (dataImage) {
                var imageCell = this.getSubCell();
                imageCell.addClass('w2l-sbox-imageCell');
                var imgEl = $__default['default']('<img/>');
                imgEl.attr('src', dataImage);
                if (dataName) {
                    imgEl.attr('alt', dataName);
                    imgEl.attr('title', dataName);
                }
                imageCell.append(imgEl);
                itemEl.append(imageCell);
            }
            if (dataColor) {
                var colorCell = this.getSubCell();
                colorCell.addClass('w2l-sbox-colorCell');
                var colorEl = $__default['default']('<div/>');
                colorEl.css('backgroundColor', dataColor);
                colorCell.append(colorEl);
                itemEl.append(colorCell);
            }
            var nameCell = this.getSubCell();
            nameCell.addClass('w2l-sbox-nameCell');
            if (dataName) {
                nameCell.html(dataName);
            }
            itemEl.append(nameCell);
            if (!this.options.multiSelect && !this.options.checkboxSelection && !dataImage) {
                nameCell.css('display', 'block');
            }
            var selectedIds = this.getSelectedId();
            if (selectedIds.length > 0 && dataId && $__default['default'].inArray(dataId.toString(), selectedIds) > -1) {
                itemEl.addClass('w2l-sbox-selected');
                if (this.options.multiSelect && this.options.checkboxSelection) {
                    itemEl.find('input[type=checkbox]').attr('checked', 'true');
                }
            }
            // Event Bind
            if (!this.options.isListReadonly) {
                itemEl.on('click.sbox', function (e) {
                    if (_this.itemClickEventCounter < 1) {
                        _this.itemClickEventCounter++;
                        _this.cellBind(itemEl);
                        setTimeout(function () {
                            _this.itemClickEventCounter = 0;
                        }, 600);
                    }
                    e.stopPropagation();
                });
                if (this.options.multiSelect && this.options.checkboxSelection) {
                    itemEl.find('input[type=checkbox]').on('click.sbox', function (e) {
                        if (_this.itemClickEventCounter < 1) {
                            _this.itemClickEventCounter++;
                            _this.cellBind(itemEl);
                            setTimeout(function () {
                                _this.itemClickEventCounter = 0;
                            }, 600);
                        }
                    });
                }
            }
            if (this.options.isListReadonly) {
                itemEl.css({ cursor: 'text' });
            }
            itemEl.on('mouseover', function (e) {
                itemEl.addClass('w2l-sbox-hover');
            });
            itemEl.on('mouseout', function (e) {
                itemEl.removeClass('w2l-sbox-hover');
            });
            return itemEl;
        };
        SboxTemplate.prototype.getHiddenInput = function (dataId) {
            var inputHdEl = $__default['default']('<input/>');
            inputHdEl.attr('name', this.options.name || this.getSelector().attr('id'));
            inputHdEl.attr('type', 'hidden');
            if (dataId) {
                inputHdEl.val(dataId);
            }
            else {
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
        };
        SboxTemplate.prototype.prepareItem = function (data) {
            var _this = this;
            if (data || data == 'loading') {
                var itemDataContainer = $__default['default']('<div/>');
                itemDataContainer.addClass('w2l-sbox-itemDataContainer');
                if (this.options.noSelection) {
                    itemDataContainer.append(this.prepareCell({ id: this.options.noSelectionValue, name: this.options.noSelection }));
                }
                if (data != 'loading') {
                    for (var i = 0; i < data.length; i++) {
                        itemDataContainer.append(this.prepareCell(data[i]));
                    }
                }
                else {
                    this.itemContainerEl.show();
                }
                // for auto hiding problem when datatype json or arrayList
                this.itemContainerEl.find('.w2l-sbox-itemDataContainer').hide();
                this.itemContainerEl.find('.w2l-sbox-paginationContainer').hide();
                setTimeout(function () {
                    _this.itemContainerEl.find('.w2l-sbox-itemDataContainer').not('.w2l-sbox-itemDataContainer:last').remove();
                    _this.itemContainerEl.find('.w2l-sbox-paginationContainer').not('.w2l-sbox-paginationContainer:last').remove();
                }, 100);
                this.itemContainerEl.append(itemDataContainer);
                if (this.options.pagination || this.options.multiSelect) {
                    this.preparePagination();
                    this.itemContainerEl.append(this.paginationContainer);
                }
            }
        };
        SboxTemplate.prototype.multipleSelectedCell = function (dataId, name, isSingle, image) {
            var _this = this;
            if (this.selectedItemContainer.find("input[value='" + dataId + "']").length < 1) {
                var selectedCell = this.getSubCell('w2l-sbox-selectedCell');
                selectedCell.data('dataId', dataId);
                var selectedCellRemoveItem_1;
                if (!isSingle) {
                    if (image) {
                        var selectedImageCellItem = this.getSubCell('w2l-sbox-selectedCellItem');
                        selectedImageCellItem.html(image);
                        selectedCell.append(selectedImageCellItem);
                    }
                    var selectedCellItem = this.getSubCell('w2l-sbox-selectedCellItem');
                    selectedCellItem.text(name);
                    selectedCell.append(selectedCellItem);
                    selectedCellRemoveItem_1 = this.getSubCell('w2l-sbox-selectedCellItem');
                    selectedCellRemoveItem_1.addClass('w2l-sbox-remove');
                    selectedCell.append(selectedCellRemoveItem_1);
                }
                selectedCell.append(this.getHiddenInput(dataId));
                if (selectedCellRemoveItem_1) {
                    selectedCellRemoveItem_1.on('click.sbox', function (e) {
                        var selectedIds = _this.getSelectedId();
                        if (selectedIds.length > 0 && dataId && $__default['default'].inArray(dataId.toString(), selectedIds) > -1) {
                            var itemEl = _this.sBoxEl.find('.w2l-sbox-selected').filter(function (idx, el) { return $__default['default'](el).data('dataId') === dataId; });
                            if (itemEl) {
                                itemEl.removeClass('w2l-sbox-selected');
                                if (_this.options.multiSelect && _this.options.checkboxSelection) {
                                    itemEl.find('input[type=checkbox]').removeAttr('checked');
                                }
                                if (_this.options.listners.onSelect && typeof _this.options.listners.onSelect == 'function') {
                                    _this.options.listners.onSelect(itemEl, '', null);
                                }
                            }
                        }
                        selectedCellRemoveItem_1.parents('.w2l-sbox-selectedCell').remove();
                        if (_this.selectedItemContainer.find('.w2l-sbox-selectedCell').length < 1) {
                            _this.selectedItemContainer.empty().append(_this.getHiddenInput('')).hide();
                        }
                        if (_this.options.listners.onRemove && typeof _this.options.listners.onRemove == 'function') {
                            _this.options.listners.onRemove(selectedCellRemoveItem_1, _this.sBoxEl, _this);
                        }
                        e.stopPropagation();
                    });
                }
                if (isSingle) {
                    this.selectedItemContainer.empty().append(selectedCell).hide();
                }
                else {
                    if (this.selectedItemContainer.find('.w2l-sbox-selectedCell').length > 0) {
                        this.selectedItemContainer.find('.w2l-sbox-inpInit').remove();
                        this.selectedItemContainer.find('.errorlist').remove();
                    }
                    else {
                        this.selectedItemContainer.empty();
                    }
                    this.selectedItemContainer.append(selectedCell).show();
                }
                if (this.options.multiSelect) {
                    if (!this.options.showSelectedPanel) {
                        this.selectedItemContainer.hide();
                    }
                    else {
                        this.selectedItemContainer.show();
                    }
                }
            }
        };
        SboxTemplate.prototype.cellBind = function (el) {
            var dataId = el.data('dataId');
            var image, color;
            var name = $__default['default'].trim(el.find('.w2l-sbox-nameCell').text());
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
                }
                else {
                    this.multipleSelectedCell(dataId, name, false, image);
                    if (this.options.multiSelect && this.options.checkboxSelection) {
                        el.find('input[type=checkbox]').attr('checked', 'true');
                    }
                }
                el.addClass('w2l-sbox-selected');
            }
            else {
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
                this.options.listners.onSelect(el, el.data('cellData'), this.selectedItemContainer.find("input[value='" + dataId + "']"));
            }
        };
        SboxTemplate.prototype.setInputValue = function (name, image) {
            var currentValue = '';
            name = $__default['default'].trim(name);
            name = name.replace(/&nbsp;/g, '');
            if (name.substring(0, 1) == '.') {
                name = name.replace(/\./g, '');
            }
            var inpVal = name;
            if (image) {
                inpVal =
                    '<div class="w2l-sbox-imageCell">' +
                        image +
                        '</div>' +
                        '<div class="w2l-sbox-nameCell">' +
                        name || '' + '</div>';
            }
            if (!this.options.multiSelect && !this.options.noTitleValue) {
                currentValue = $__default['default']('<p>' + inpVal + '</p>').text();
                this.inputEl.html(inpVal);
            }
            return currentValue;
        };
        SboxTemplate.prototype.setColorInputValue = function (name, color) {
            var currentValue = '';
            name = $__default['default'].trim(name);
            name = name.replace(/&nbsp;/g, '');
            if (name.substring(0, 1) == '.') {
                name = name.replace(/\./g, '');
            }
            var inpVal = name;
            if (color) {
                inpVal =
                    '<div class="w2l-sbox-colorCell">' +
                        color +
                        '</div>' +
                        '<div class="w2l-sbox-nameCell">' +
                        name || '' + '</div>';
            }
            if (!this.options.noTitleValue) {
                currentValue = $__default['default']('<p>' + inpVal + '</p>').text();
                this.inputEl.html(inpVal);
            }
            return currentValue;
        };
        return SboxTemplate;
    }());

    var Sbox = /** @class */ (function () {
        function Sbox(settings) {
            /**
             * Default Values
             * @private
             */
            this.options = {
                multiSelect: false,
                checkboxSelection: true,
                size: exports.Size.Medium,
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
                searchMethod: exports.SearchMethod.Contains,
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
                showSelectedPanel: true,
                toggleHide: false,
                inputCls: null,
                emptyText: 'Type..',
                dataCache: true,
                expandEvent: 'click.sbox',
                collapseEvent: 'click.sbox',
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
            settings = populateSboxOptions($__default['default'](settings.selector), settings);
            if (settings)
                $__default['default'].extend(true, this.options, settings);
            this.template = new SboxTemplate(this.options);
            this.events = new SboxEvents(this.options, this.template);
            this.template.setEventObject(this.events);
            this.resetDefault = new ResetDefault(this.options, this.template, null);
            this.init();
        }
        Sbox.prototype.init = function () {
            var _this = this;
            this.template.prepareHTML();
            this.resetDefault.set(false);
            this.events.dataFetch();
            if (this.options.typeHeader) {
                this.template.inputEl.on('focus.sbox', function (e) {
                    var el = $__default['default'](_this);
                    if (el.text() == _this.options.emptyText) {
                        el.empty();
                    }
                });
            }
            if (!this.options.isListReadonly) {
                this.events.bindKeyEvent();
            }
            $__default['default'](document).on('click.w2lSbox', function (e) {
                var targetEl = $__default['default'](e.target);
                if (targetEl.parents('.w2l-sbox-comboPanel').length < 1 &&
                    targetEl.parents('.w2l-sbox-itemDataContainer').length < 1 &&
                    targetEl.parents('.w2l-sbox-paginationContainer').length < 1) {
                    if (!_this.options.multiSelect &&
                        _this.template.inputEl.find('.w2l-sbox-colorCell').length < 1 &&
                        _this.template.getInputText() == '') {
                        _this.template.selectedItemContainer.find('input[type=hidden]').val('');
                    }
                    _this.template.hidePanel();
                }
                else {
                    _this.template.hideOtherSBOX(targetEl.closest('.w2l-sbox'));
                }
            });
            if (this.options.resizeOnLoad) {
                $__default['default'](window).on('resize.sbox', function () {
                    _this.init();
                });
            }
        };
        Sbox.prototype.resetValue = function (isEmpty) {
            this.resetDefault.set(isEmpty);
        };
        Sbox.prototype.getValue = function () {
            var allIds = this.template.getSelectedId();
            return typeof allIds == 'object' ? (allIds.length > 1 ? allIds : allIds[0]) : allIds;
        };
        Sbox.prototype.setValue = function (value, displayValue) {
            this.template.selectedItemContainer.find('input[type=hidden]').each(function (item) {
                item.val(value);
            });
            this.template.inputEl.text(displayValue || value);
        };
        Sbox.prototype.getSelectedName = function () {
            return this.template.getSelectedName();
        };
        Sbox.prototype.setDataStore = function (dataStore) {
            if (!this.events.tempDataStore) {
                this.events.tempDataStore = this.options.dataStore;
            }
            this.options.dataStore = dataStore;
        };
        Sbox.prototype.getDataStore = function () {
            return this.options.dataStore;
        };
        Sbox.prototype.resetDataStore = function () {
            this.events.resetDataStore();
        };
        Object.defineProperty(Sbox.prototype, "params", {
            get: function () {
                return {
                    id: this.options.id,
                    name: this.options.name,
                    cls: this.options.cls,
                    value: this.options.value,
                    inputCls: this.options.inputCls,
                };
            },
            enumerable: true,
            configurable: true
        });
        return Sbox;
    }());

    /**
     * A jQuery Based suggestion box.
     * @author Md.Rajib-Ul-Islam<mdrajibul@gmail.com>
     * @version 1.2
     * <h3>Features </h3>
     * <ul>
     *  <li>Easy plug and play.</li>
     *  <li>Ajax call for populating tooltip.</li>
     * </ul>
     * @param settings
     */
    var initialize = function () {
        $__default['default'](function () {
            $__default['default'].fn.Sbox = function (options) {
                var _this = this;
                return this.each(function () {
                    var currentEl = $__default['default'](_this);
                    var selectConfig = populateSboxOptions(currentEl, options);
                    if (typeof selectConfig === 'object') {
                        var newSBox = new Sbox(selectConfig);
                        $__default['default'](selectConfig.selector).data('sbox', newSBox);
                        return newSBox;
                    }
                    else {
                        $__default['default'].error('Configuration not found');
                    }
                });
            };
        });
    };

    initialize();

    exports.Browser = Browser;
    exports.Sbox = Sbox;
    exports.SboxEvents = SboxEvents;
    exports.SboxTemplate = SboxTemplate;
    exports.getArrayData = getArrayData;
    exports.getArrayElements = getArrayElements;
    exports.getJsonData = getJsonData;
    exports.getObjects = getObjects;
    exports.hasSearchString = hasSearchString;
    exports.populateSboxOptions = populateSboxOptions;
    exports.sbAjax = sbAjax;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sbox.js.map
