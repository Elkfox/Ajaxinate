---
title:  "Getting Started"
handle: "getting-started"
category: "getting started"
---
Add ajaxinate.min.js to the assets folder of your shopify theme, or add it to your vendor files if you are using slate.

Add ajaxinate.min.js before the closing body tag or defer it's loading.


{% highlight liquid %}
{% raw %}
{{ 'ajaxinate.min.js' | asset_url | script_tag }}
{% endraw %}
{% endhighlight %}


Setup your collection or blog template, for example:
{% highlight liquid %}
{% raw %}
{% paginate collection.products by 3 %}
  <div id="MainContent" class="container">
    <div class="row AjaxinateLoop">
      {% for product in collection.products %}
        {% include 'product-grid-item' %}
      {% endfor %}
    </div>

    <div id="AjaxinatePagination">
      {% if paginate.next %}
        <a href="{{ paginate.next.url }}">Loading More</a>
      {% endif %}
    </div>
  </div>
{% endpaginate %}
{% endraw %}
{% endhighlight %}

Initialize it in your script file or inline

{% highlight javascript %}
document.addEventListener("DOMContentLoaded", function() {
  var endlessScroll = new Ajaxinate();
});
{% endhighlight %}
