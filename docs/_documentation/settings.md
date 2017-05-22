---
title:  "Settings"
handle: "settings"
category: 'settings'
---
If you wish to change the names of the selectors you can pass them in with the following settings.

For example:
{% highlight javascript %}
$(document).ready(function(){
  ajaxify({
    linkParent: '.custom-pagination',
    parentContainer: '#page-content'
    });
});
{% endhighlight %}

### linkParent
##### Type
String
##### Default
`.pagination`
##### Description
Set the selector of the pagination container. Should only be a class as the script will generate multiple.

---
### parentContainer
##### Type
String
##### Default
`#MainContent`
##### Description
Set the selector of the top level container. Can be class or id.

---
### endlessScrollContainer
##### Type
String
##### Default
`.EndlessScroll`
##### Description
Set the selector of the content container. Should only be a class as the script will generate multiple.

---
### endlessClickContainer
##### Type
String
##### Default
`.EndlessClick`
##### Description
Set the selector of the content container. Should only be a class as the script will generate multiple.

---
### endlessOffset
##### Type
Integer
##### Default
`0`
##### Description
Set the distance from the bottom of the page to fire the endless scroll, in pixels. The higher the number the sooner it will fire.

---
### ajaxinateContainer
##### Type
String
##### Default
`.Ajaxinate`
##### Description
Set the selector of the content container. Should only be a class as the script will generate multiple.

---
### ajaxinateLink
##### Type
String
##### Default
`.page a`
##### Description
Set the selector for the pagination links. Should only be a class as the script will generate multiple.

---
### fade
##### Type
String
##### Default
`fast`
##### Description
Set the speed of the fade animation.

---
### textChange
##### Type
String
##### Default
`Loading`
##### Description
Set the text string to change during the loading process.

---
