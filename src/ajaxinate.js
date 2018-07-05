/* ==============================================================================
 ___  _   _    _
/   || | | |  | |
\__  | | | |  | |  __
/    |/  |/_) |/  /  \_/\/
\___/|__/| \_/|__/\__/  /\_/
              |\
              |/
Ajaxinate v2.0.1
https://github.com/Elkfox/Ajaxinate
Copyright (c) 2017 Elkfox Co Pty Ltd
https://elkfox.com
Project lead: George Butter
MIT License
============================================================================== */

const Ajaxinate = function ajaxinateConstructor(config) {
  const settings = config || {};
  /*
    pagination: Selector of pagination container
    container: Selector of repeating content
    offset: 0, offset the number of pixels before the bottom to start loading more on scroll
    loadingText: 'Loading', The text changed during loading
    callback: null, function to callback after a new page is loaded
  */
  const defaultSettings = {
    pagination: '.AjaxinatePagination',
    method: 'scroll',
    container: '.AjaxinateLoop',
    offset: 0,
    loadingText: 'Loading',
    callback: null,
  };
  // Merge configs
  this.settings = Object.assign(defaultSettings, settings);

  this.buildEndlessScrollEventListeners = this.buildEndlessScrollEventListeners.bind(this);
  this.buildEndlessClickEventListeners = this.buildEndlessClickEventListeners.bind(this);
  this.checkIfPaginationInView = this.checkIfPaginationInView.bind(this);
  this.stopMultipleClicks = this.stopMultipleClicks.bind(this);

  this.containerElement = document.querySelector(this.settings.container);
  this.paginationElement = document.querySelector(this.settings.pagination);

  this.settings.method ? this.initialize() : console.error('Ajaxinate: No method provided, expected: click, scroll, or, ajaxinate');
};

Ajaxinate.prototype.initialize = function initializeTheCorrectFunctionsBasedOnTheMethod() {

  if(this.containerElement) {
    var initializers = {
      click: this.buildEndlessClickEventListeners,
      scroll: this.buildEndlessScrollEventListeners,
      ajaxinate: this.buildAjaxinateEventListeners
    }
    return initializers[this.settings.method]();
  } else {
    console.error('Ajaxinate: container element "'+this.settings.container+'" not found!');
  }
};

Ajaxinate.prototype.buildEndlessScrollEventListeners = function() {
  if(this.paginationElement) {
    document.addEventListener("scroll", this.checkIfPaginationInView);
    window.addEventListener("resize", this.checkIfPaginationInView);
    window.addEventListener("orientationchange", this.checkIfPaginationInView);
  } else {
    console.error('Ajaxinate: pagination element "'+this.settings.pagination+'" not found!');
  }
};

Ajaxinate.prototype.buildEndlessClickEventListeners = function() {
  if(this.paginationElement) {
    this.nextPageLinkElement = this.paginationElement.getElementsByTagName('a')[0];
    this.clickActive = true;
    if(typeof(this.nextPageLinkElement) !== 'undefined') {
      this.nextPageLinkElement.addEventListener('click', this.stopMultipleClicks);
    }
  } else {
    console.error('Ajaxinate: pagination element "'+this.settings.pagination+'" not found!');
  }
};

Ajaxinate.prototype.stopMultipleClicks = function(event) {
  event.preventDefault();
  // We still want to prevent default therefore we do not want to remove the event listener
  // but do not want to allow the user to fire multiple requests.
  if(this.clickActive) {
    this.nextPageLinkElement.innerText = this.settings.loadingText;
    this.nextPageUrl = this.nextPageLinkElement.href;
    this.clickActive = false;
    this.loadMore();
  }
};

Ajaxinate.prototype.checkIfPaginationInView = function() {
  if (((this.paginationElement.getBoundingClientRect().top <= window.innerHeight) - this.settings.offset && (this.paginationElement.getBoundingClientRect().bottom + this.settings.offset) >= 0)) {
    this.nextPageLinkElement = this.paginationElement.getElementsByTagName('a')[0];
    document.removeEventListener("scroll", this.checkIfPaginationInView);
    window.removeEventListener("resize", this.checkIfPaginationInView);
    window.removeEventListener("orientationchange", this.checkIfPaginationInView);
    if(this.nextPageLinkElement) {
      this.nextPageLinkElement.innerText = this.settings.loadingText;
      this.nextPageUrl = this.nextPageLinkElement.href;
      this.loadMore();
    }
  }
};

Ajaxinate.prototype.loadMore = function getTheHtmlOfTheNextPageWithAnAjaxRequest() {
  this.request = new XMLHttpRequest();
  this.request.onreadystatechange = function() {
    if(this.request.readyState === 4 && this.request.status === 200) {
      var newContainer = this.request.responseXML.querySelectorAll(this.settings.container)[0];
      var newPagination = this.request.responseXML.querySelectorAll(this.settings.pagination)[0];
      this.containerElement.insertAdjacentHTML('beforeend', newContainer.innerHTML);
      this.paginationElement.innerHTML = newPagination.innerHTML;
      if(this.settings.callback && typeof(this.settings.callback) === 'function') {
        this.settings.callback(this.request.responseXML);
      }
      this.initialize();
    }

  }.bind(this);
  this.request.open('GET', this.nextPageUrl);
  this.request.responseType = 'document';
  this.request.send();
};
