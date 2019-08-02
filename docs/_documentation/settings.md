---
title:  "Settings"
handle: "settings"
category: 'settings'
---
If you wish to change the names of the selectors you can pass them in with the following settings.

For example:
{% highlight javascript %}
document.addEventListener("DOMContentLoaded", function() {
  var endlessScroll = new Ajaxinate({
    container: '#AjaxinateLoop',
    pagination: '#AjaxinatePagination'
  });
});
{% endhighlight %}

Option      | Default                | Type     | Description
------------|------------------------|----------|-------------
pagination  | `#AjaxinatePagination` | String   | A selector to identify the pagination container.
container   | `#AjaxinateLoop`       | String   | A selector to identify the grid that you want to duplicate.
method      | `scroll`               | String   | Can be changed to click to that users must click to load more.
offset      | `0`                    | Integer  | Decrease the distance required to scroll before sending a request.
loadingText | `Loading`              | String   | Change the text of the pagination link during a request.
callback    | `null`                 | Function | A function fired after the new page has been loaded.
