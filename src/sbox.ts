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
import $ from 'jquery';
import { ISboxOptions } from './interfaces';
import { Sbox } from './sbox.core';
import { populateSboxOptions } from './sbox.util';

export const initialize = () => {

  $(function () {
    ($.fn as any).Sbox = function (options: ISboxOptions) {
      return this.each(() => {
        const currentEl = $(this);
        const selectConfig = populateSboxOptions(currentEl, options);
        if (typeof selectConfig === 'object') {
          const newSBox = new Sbox(selectConfig);
          $(selectConfig.selector).data('sbox', newSBox);
          return newSBox;
        } else {
          $.error('Configuration not found');
        }
      });
    };
  });

}

