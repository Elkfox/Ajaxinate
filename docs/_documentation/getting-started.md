---
title:  "Getting Started"
handle: "getting-started"
category: "getting started"
---
Ajaxify requires jQuery!

Add ajaxify.min.js to the assets folder of your shopify theme.

Add ajaxify.min.js before the closing body tag


{% highlight liquid %}
{% raw %}
{{ 'ajaxify.min.js' | asset_url | script_tag }}
{% endraw %}
{% endhighlight %}


Setup your collection or blog template, for example:
{% highlight liquid %}
{% raw %}
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
{% endraw %}
{% endhighlight %}
##### Note:
 - The pagination is within the `.EndlessScroll` element. This is important so that we are always getting the next page!

 - Endless scroll and click use only a next button

Default pagination will work for ajaxinate
{% highlight liquid %}
{% raw %}
{% if paginate.pages > 1 %}
  <div class="pagination">
    {{ paginate | default_pagination }}
  </div>
{% endif %}
{% endraw %}
{% endhighlight %}

Initialize it in your script file or inline

{% highlight javascript %}
$(document).ready(function(){
  ajaxify();
});
{% endhighlight %}
