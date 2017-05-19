# Ajaxify
Ajax pagination plugin for Shopify themes.

## Features
 - Endless scrolling - scroll to the bottom of the page to load the next.
 - Endless click - Like endless scroll but click a link to load the next pages.
 - Ajaxination - Normal pagination style but load the page without reloading, uses push states.
 - Fallsback gracefully when there is no javascript available.

## Demos

Endless Scroll (default) https://ajaxify.myshopify.com/collections/all

More coming soon

## Getting Started
Ajaxify requires jQuery!

Add ajaxify.min.js to the assets folder of your shopify theme.

Add ajaxify.min.js before the closing body tag

```
{{ 'ajaxify.min.js' | asset_url | script_tag }}
```

Setup your collection or blog template, for example:
```
{% paginate collection.products by 3 %}
  <div id="MainContent" class="container">
    <div class="row">

      <div class="EndlessScroll">
      
        {% for product in collection.products %}
          {% include 'product-grid-item' %}
        {% endfor %}
        
        {% if paginate.next %}
          <div class="pagination">
            <a href="{{ paginate.next.url }}">Loading More</a>
          </div>
        {% endif %}
        
      </div>

    </div>
  </div>
{% endpaginate %}
```
##### Note:
 - The pagination is within the `.EndlessScroll` element. This is important so that we are always getting the next page!

 - Endless scroll and click use only a next button

Default pagination will work for ajaxinate
```
{% if paginate.pages > 1 %}
  <div class="pagination">
    {{ paginate | default_pagination }}
  </div>
{% endif %}
```

Initialize it in your script file or inline

```
$(document).ready(function(){
  ajaxify();
});
```

## Settings
### linkParent
  ###### Type
  String
  ###### Default
  `.pagination`
  ###### Description
  Set the selector of the pagination container. Should only be a class as the script will generate multiple.

---
### parentContainer
  ###### Type
  String
  ###### Default
  `#MainContent`
  ###### Description
  Set the selector of the top level container. Can be class or id.

---
### endlessScrollContainer
  ###### Type
  String
  ###### Default
  `.EndlessScroll`
  ###### Description
  Set the selector of the content container. Should only be a class as the script will generate multiple.

---
### endlessClickContainer
  ###### Type
  String
  ###### Default
  `.EndlessClick`
  ###### Description
  Set the selector of the content container. Should only be a class as the script will generate multiple.

---
### endlessOffset
  ###### Type
  Integer
  ###### Default
  `0`
  ###### Description
  Set the distance from the bottom of the page to fire the endless scroll, in pixels. The higher the number the sooner it will fire.

---
### ajaxinateContainer
  ###### Type
  String
  ###### Default
  `.Ajaxinate`
  ###### Description
  Set the selector of the content container. Should only be a class as the script will generate multiple.

---
### ajaxinateLink
  ###### Type
  String
  ###### Default
  `.page a`
  ###### Description
  Set the selector for the pagination links. Should only be a class as the script will generate multiple.

---
### fade
  ###### Type
  String
  ###### Default
  `fast`
  ###### Description
  Set the speed of the fade animation.

---
### textChange
  ###### Type
  String
  ###### Default
  `Loading`
  ###### Description
  Set the text string to change during the loading process.

---
