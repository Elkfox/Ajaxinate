# Getting started

## NPM

```bash
$ npm i ajaxinate
```

```javascript
import {Ajaxinate} from 'ajaxinate';

new Ajaxinate({
  container: '#AjaxinateContainer',
  pagination: '#AjaxinatePagination',
  loadingText: 'Loading more...',
});
```

## Manual installation

**IMPORTANT! If you are using Ajaxinate without a package manager, use** [**the v2 branch**](https://github.com/Elkfox/Ajaxinate/tree/v2) **↗**

1. Add ajaxinate.min.js to the assets folder of your shopify theme, or add it to your vendor files if you are using Slate or a similar method.
2. Add the ajaxinate.min.js script src tag before the closing body tag, or defer its loading:

   {% code title="collection.liquid" %}
   ```python
   {{ 'ajaxinate.min.js' | asset_url | script_tag }}
   ```
   {% endcode %}

3. Setup your collection or blog template, for example:

   {% code title="collection.liquid" %}
   ```python
   {% paginate collection.products by 3 %}
       <div id="AjaxinateContainer" >
         {% for product in collection.products %}
           {% include 'product-grid-item' %}
         {% endfor %}
       </div>

       <div id="AjaxinatePagination">
         {% if paginate.next %}
           <a href="{{ paginate.next.url }}">Loading More</a>
         {% endif %}
       </div>
   {% endpaginate %}
   ```
   {% endcode %}

4. Initialize it in your script file, or inline:

   ```javascript
   document.addEventListener("DOMContentLoaded", function() {
     var endlessScroll = new Ajaxinate();
   });
   ```

5. Configure your settings as desired.

