# Web Apps at 60fps 

<div class="slide">

## Who cares? Let's just get "good enough" performance and fix the really atrocious things
- Users can tell when an app is slow. And research shows they don't like it.
- Native apps are winning on this front, big time.
- If we want the open web to win (I do), we have to do better.

</div>
<div class="slide">

## "Our real bottleneck is back-end performance"
- Maybe on your one-year-old iPhone 6S. What about on a 3 year old, sorta crappy Android tablet? (hint: it sucks. No real user would use our site on one.)
- That is the case for 80% of the stuff we do at Opower. But it's not going to stay that way. Our experiences are getting more ambitious and complex. We have to find a way to scale.

</div>
<div class="slide">

## Why 60fps?
Basically, any more and users can't tell. Any less and many can.

That means we have just 16ms every frame (!) And most of that is browser overhead. We have to shoot for 8-10ms or less every frame (but sometimes we can cheat).

</div>
<div class="slide">

## How do we get to 60fps?

You can get 60fps for 90% of the stuff you do in the browser if you remember these 4 things:

1. Keep JS off the critical rendering path
1. Don't trigger Forced Synchronous Layout
1. Do your heavy work during idle time
1. Animate using composit-friendly CSS properties

</div>
<div class="slide">

## The critical rendering path: a browser story

The typical browser operates on a cycle every frame:

<img src="browser-render-flow.jpg" alt="JavaScript -> Style -> Layout -> Paint -> Composite">

</div>
<div class="slide">

### JavaScript
The browser needs to download, parse, and run this before it can do anything else, but modern browsers
are smart enough to do look-ahead and pro-actively make network requests in parallel.

[DEMO: Blocking requests](/blocking-requests/)

</div>
<div class="slide">

You can load JS asynchronously fairly trivially by placing the script tag at the bottom of the body instead of in the head:

```html
<head>
    <!-- Styles + Images will be loaded in parallel with JS -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <img src="users/dj/memes/morpheus.jpg">
    <script src="non-blocking-stuff.js"></script>
</body>
```

</div>
<div class="slide">

There's a more modern way to do this: the `async` attribute. (also `defer`)

[DEMO: Async requests](/async-requests/)

```html
<head>
    <!-- JS will be downloaded in parallel, executed "whenever" -->
    <link rel="stylesheet" href="styles.css">
    <script src="non-blocking-stuff.js" async></script>
</head>
<body>
    <img src="users/dj/memes/morpheus.jpg">
</body>
```

Browser support for this is ["good enough"](http://caniuse.com/#search=async)

After initial load, the browser will execute JS based on events and timers every frame.

</div>
<div class="slide">

### Style
Each frame, the browser must compute styles for every element on the page.

This is hardly worth talking about; modern browsers are really, really good at computing CSS.

Focus on writing bad (as opposed to completely unintelligible) CSS and hope for the best. 

</div>
<div class="slide">

### Layout
Layout and paint are the scary parts. Layout can happen multiple times in a frame (and remember we only have 8-10ms!) and paint can be very slow.

Layout is when the browser takes the computed CSS of every element and figures out where it belongs on the page:

- Dimensions & position
- If it has a float, how it flows with other elements
- If inline or inline-block, how text flows around it

</div>
<div class="slide">

### Paint
Paint is when the browser actually displays the elements on the page. This includes stuff like:

- Drawing CSS gradients
- Drawing images
- Drawing borders and shadows

</div>
<div class="slide">

### Composite
Browsers don't paint all at once. They have layers called "composite layers" that are painted separately and then combined in the composite step.

[DEMO](/paint-composite)

## How to not trigger Forced Synchronous Layout

</div>
<div class="slide">

### What is a Forced Synchronous Layout?

> What is the DOM? "Document Object Model": Basically, the browser's "live" version of the HTML document, updated in real time by scripts and styles.

Forced Synchronous Layout (AKA Layout Thrashing) happens when you read from the DOM and write to the DOM "in the same frame" (synchronously).

[DEMO](/forced-synchronous-layout)

It's not that hard to avoid a forced synchronous layout in most cases; just defer writing to the DOM until after you've finished reading from it.

[DEMO](/forced-synchronous-layout-solution)

</div>
<div class="slide">

### If you only remember one thing, remember this. Avoid Forced Synchronous Layout at all costs.

</div>
<div class="slide">

### Saving the frames: doing work during idle time

There are lots of things you want to do at a regular interval, like animation. You should NEVER use `setTimeout` or `setInterval` for these things, ESPECIALLY animation.

[DEMO](/set-timeout-thrash)

Instead, use `requestAnimationFrame`.

[DEMO](/set-timeout-thrash-solution)

In general, get your heavy code of the main thread: use promises and other async APIs for network requests, and check out more modern features like
service workers for even more awesomeness!

</div>
<div class="slide">

### Composite-friendly animations

Earlier, we talked about the difference between the paint and composite steps.

Some CSS properties don't require paint, only composite:

- CSS transforms (`rotate`, `translate`, `scale`)
- Elements with `position: fixed`
- (Sometimes) Elements with `position: absolute` (but be careful)

The browser will decide whether to promote an element to a composite layer. You can use the [`will-change`](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change) CSS property to give it some hints, but you should do this rarely if ever.

</div>
<div class="slide">

### Further reading
Basically everything I know about this comes from [this Udacity course](https://www.udacity.com/course/browser-rendering-optimization--ud860).

It is excellent and free. I highly recommend it if this talk was at all interesting to you.

</div>
