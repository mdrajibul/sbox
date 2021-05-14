export enum SearchMethod {
  StartWith = 'StartWith',
  EndWith = 'EndWith',
  Contains = 'Contains',
}

export enum Size {
  SMALL = 'small',
  Medium = 'medium',
  Large = 'large',
}

export interface IOption {
  id: string;
  name: string;
  color?: string;
  image?: string;
  tip?: string;
}

export interface ISboxOptions {
  multiSelect: boolean;
  checkboxSelection: boolean;
  size: Size,
  pagination: boolean;
  selector: JQuery<HTMLElement> | HTMLElement | null;
  tabindex: number;
  name: string;
  id: string;
  style: string;
  noSelection: boolean;
  noSelectionValue: string;
  value: any;
  noTitleValue: boolean;
  showCellTitle: boolean;
  validation: string | null;
  typeHeader: boolean;
  searchMethod: SearchMethod;
  inputMode: boolean;
  isListReadonly: boolean;
  itemPerPage: number;
  width: string | null;
  autoWidth: boolean;
  optionAutoWidth: boolean;
  height: string | null;
  nextBtnText: string;
  prevBtnText: string;
  btnText: string;
  hasResetButton: boolean;
  resetButtonText: string;
  hasReloadButton: boolean;
  reloadButtonText: string;
  cls: string | null;
  resizeOnLoad: boolean;
  showSelectedPanel: boolean; // if multiSelect true
  toggleHide: boolean; // item panel hide by toggle
  inputCls: string | null;
  emptyText: string;
  dataCache: boolean;
  expandEvent: string; //click,mouseover
  collapseEvent: string; //mousemove
  dataStore: {
    ajax: {
      url: string | null;
      data: any;
      dataType: string;
      type: string;
      cache: boolean;
      success: (res: any) => void | undefined;
      error: (err: any) => void | undefined;
      beforeSend: () => void | undefined;
      complete: () => void | undefined;
    };
    json: Array<IOption>;
    arrayList: Array<string | number | boolean>;
  };
  listners: {
    onSelect: (currentCell: any, cellData: any, inputElement: JQuery<HTMLElement>) => void;
    onSubmit: (element: JQuery<HTMLElement>, selectedIds: Array<string>) => void | undefined;
    onRemove: (element: JQuery<HTMLElement>, sBoxEl: JQuery<HTMLElement>, thisScop: any) => void | undefined;
    onSearch: (queryText: string, currentData: any, inputElement: JQuery<HTMLElement>) => void;
  };
}
