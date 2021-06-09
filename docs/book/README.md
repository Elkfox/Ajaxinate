# Shopify endless scroll plugin

## Features

* No dependencies
* Multiple methods; 'Endless scroll' automatically adds content as you scroll, whereas 'endless click' adds content on click
* Graceful fallback when JavaScript is not available
* Created for Shopify, but will work on any site

## Demos

* [**Endless scroll demo**](https://ajaxinate.myshopify.com/) ↗
* [**Endless click demo**](https://ajaxinate.myshopify.com/collections/all?view=endless-click) ↗

## Getting started

You can either use NPM to add the plugin to your project, or manually add and the configure the code as necessary

{% page-ref page="getting-started.md" %}

## Settings

If you would like to change the names of the selectors, you can pass them in with the following settings:

| Option | Default | Type | Description |
| :--- | :--- | :--- | :--- |
| container | **\#AjaxinateContainer** | String | Selector to identify the container element you want to paginate |
| pagination | **\#AjaxinatePagination** | String | Selector to identify the pagination element |
| method | **scroll** | String | Changes the method to 'endless click when set to' \`click\` |
| offset | **0** | Integer | The distance required to scroll before sending a request |
| loadingText | **Loading** | String | The text of the pagination link during a request |
| callback | null | Function | Function fired after the new page has been loaded |

For example:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var endlessScroll = new Ajaxinate({
    container: '#AjaxinateContainer',
    pagination: '#AjaxinatePagination',
    method: 'click',
    offset: 1000
  });
});
```

## Methods

{% page-ref page="methods.md" %}

