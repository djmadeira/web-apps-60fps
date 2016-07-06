# DOMinate: How to make web pages at 60 fps 

## Who cares? Let's just get "good enough" performance and fix the really atrocious things
- UX research on why performance = better metrics
- Scary numbers of people leaving the mobile web, and with good reason: it sucks!
- We have to face it: the DOM is slow. Millions of $$$ every year go towards making the DOM suck less. (React, Redux, etc.)
- If we want the open web to win (I do), we have to do better. Like, a lot better.

## "Our real bottleneck is back-end performance"
- Maybe on your one-year-old iPhone 6S. What about on a 3 year old, sorta crappy Android tablet? (hint: it sucks. No real user would use our site on one.)
- That is the case for 80% of the stuff we do at Opower. But it's not going to stay that way. Our experiences are getting more ambitious and complex, and integrating more realtime data from more sources than before. We have to find a way to scale.

http://pandawhale.com/post/59404/kung-fu-panda-enough-talk-lets-fight-gif

## Why 60fps?
Talk about how this is the threshold beyond which user's can't tell.

That means we have just 16ms every frame!!! And most of that is browser overhead. We have to shoot for 8-10ms or less every frame (but sometimes we can cheat).

## How to take names and start DOMinating the browser

Plz stop saying DOMinating.

https://www.youtube.com/watch?v=otUcnfiBTLs

You can get 60fps for 90% of the stuff you do in the browser if you remember these 4 things:

1. Keep JS off the critical rendering path
1. Don't trigger Forced Synchronous Layout
1. Do your heavy work during idle time (easier than you think)
1. Animate using composit-friendly CSS properties

## The critical rendering path: a browser story

The typical browser operates on a cycle every frame:

JavaScript -> Style -> Layout -> Paint -> Composite

### JavaScript
Everyone's favorite weakly-typed, Object-Oriented-but-not-really, Prototypal-but-not-really, Functional-but-not-really, completely ubiquitous and entirely unstoppable browser scripting language.

The browser needs to download, parse (create an AST), and run this before it can do anything else, including make network requests.

[ Demo: using chrome dev tools to see blocking requests ]

You can load JS asynchronously fairly trivially by placing the script tag at the bottom of the body instead of in the head:

```html
<head>
    <!-- Styles + Images will be loaded at the same time as JS is downloaded and parsed -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <img src="users/dj/memes/morpheus.jpg">
    <script src="non-blocking-stuff.js"></script>
</body>
```

There's a more modern way to do this: the `async` attribute.

[ Code sample ]

[ Demo: async ]

Browser support for this is ["good enough"](http://caniuse.com/#search=async)

After initial load, the browser will execute JS based on events and timers every frame.

### Style
Each frame, the browser must compute styles for every element on the page.

This is hardly worth talking about; modern browsers are really, really good at computing CSS.

Focus on writing bad (as opposed to completely unintelligible) CSS and hope for the best. 

### Layout
Layout and paint are the scary parts. These can and will happen multiple times in a frame (and remember we only have 8-10ms!)

Layout is when the browser takes the CSS of every element and figures out where it belongs on the page.

JS can force Layout to happen by reading from the DOM during execution. More on this in "Forced Synchronous Layout".

### Paint
Paint is when the browser actually displays the elements on the page. This includes stuff like:

- Drawing CSS gradients
- Drawing images
- Drawing borders and shadows

[ DEMO: using Chrome Dev Tools to inspect browser paints, composite layer borders ]

### Composite
Browsers don't paint all at once. They have layers called "composite layers" that are painted separately and then combined in the composite step.

Some CSS properties don't require paint, only composite:

- CSS transforms (`rotate`, `translate`, `scale`)
- Elements with `position: fixed`
- (Sometimes) Elements with `position: absolute` (but be careful)

### Don't block the critical rendering path: load your JS asynchronously if you can (you can)

## How to not trigger Forced Synchronous Layout

### What is a Forced Synchronous Layout?
FSL happens when you read from the DOM
