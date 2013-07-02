#DE Infinite Image Slider

##What is it?
This is a JQuery-less rotating image slider.

##How to use it?

Put a div on your website, put some image tags in it, id it and throw in some CSS:

html:

>&lt;div id=&quot;de_slider&quot;&gt;<br/>  &lt;img src=&quot;img/slider_sheep_1.png&quot;/&gt;<br/>  &lt;img src=&quot;img/slider_sheep_2.png&quot;/&gt;<br/>  &lt;img src=&quot;img/slider_sheep_3.png&quot;/&gt;<br/>  &lt;img src=&quot;img/slider_sheep_4.png&quot;/&gt;<br/>&lt;/div&gt;<br/><br/>

css:

><br/>#de_slider img {<br/>	margin: 0;<br/>	display: inline-block;<br/>}<br/><br/>#de_slider_prev {<br/>	visibility: hidden;<br/>	position:relative;<br/>	left: 1%;<br/>	float: left;<br/>	width: 25px;<br/>	height: 25px;<br/>	top: 40%;<br/>	z-index:100;<br/>	background-image: url('../img/prev.png');<br/>}<br/><br/>#de_slider_next {<br/>	visibility: hidden;<br/>	position:relative;<br/>	right: 1%;<br/>	float:right;<br/>	width: 25px;<br/>	height: 25px;<br/>	top:40%;<br/>	z-index:100;<br/>	background-image: url('../img/next.png');<br/>}

##Authors

Jonathan Montoya [(jonathan@dielectricsheep.com)](mailto:jonathan@dielectricsheep.com)

##License

This work is licensed under the [WTFPL license](http://www.wtfpl.net)

##Demo

[DE Image Slider Demo](http://dielectricsheep.com/portfolio.html#de_image_slider)
