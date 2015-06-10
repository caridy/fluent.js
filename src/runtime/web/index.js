'use strict';

import { fetch } from './io';
import { Service, getAdditionalLanguages } from '../../bindings/html/service';
import { setAttributes, getAttributes } from '../../bindings/html/dom';

const additionalLangsAtLaunch = getAdditionalLanguages();
const readyStates = {
  loading: 0,
  interactive: 1,
  complete: 2
};

function whenInteractive(callback) {
  if (readyStates[document.readyState] >= readyStates.interactive) {
    return callback();
  }

  document.addEventListener('readystatechange', function onrsc() {
    if (readyStates[document.readyState] >= readyStates.interactive) {
      document.removeEventListener('readystatechange', onrsc);
      callback();
    }
  });
}

function init() {
  window.L10n = new Service(fetch, additionalLangsAtLaunch);
  window.addEventListener('languagechange', window.L10n);
  document.addEventListener('additionallanguageschange', window.L10n);
}

whenInteractive(init);

// XXX for easier testing with existing Gaia apps; remove later on
let once = callback => whenInteractive(
  () => document.l10n.ready.then(callback));

navigator.mozL10n = {
  get: id => id,
  once: once,
  ready: once,
  setAttributes: setAttributes,
  getAttributes: getAttributes
};
