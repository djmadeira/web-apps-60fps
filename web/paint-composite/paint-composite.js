'use strict';

var SPEED = 2,
    ROTATE_SPEED = 0.2,
    ROTATE_MAX = 10,
    IDENTITY = 'matrix(1, 0, 0, 1, 0, 0)',
    animateEls,
    i,
    offsets = [],
    enablePosition = false,
    xTransformRegexp = /matrix\([0-9], [0-9], [0-9], [0-9], ([0-9]+), [0-9]\)/i;

document.getElementById('position-toggle').addEventListener('click', function() {
    enablePosition = !enablePosition;
    for (var el of animateEls) {
        el.style.left = '0px';
        el.style.top = '0px';
        el.style.transform = IDENTITY;
        el.classList.toggle('red');
    }
});

animateEls = document.querySelectorAll('.box');

i = 0;
for (var el of animateEls) {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    el.style.transform = 'translateZ(0px)';
    el.style.left = '0px';
    el.style.top = '0px';

    offsets[i] = {
        x: Math.floor(Math.random() * (windowWidth - 200)) + 50,
        y: Math.floor(Math.random() * (windowHeight - 200)) + 50,
        xDirection: (Math.random() > 0.5 ? 1 : -1),
        yDirection: (Math.random() > 0.5 ? 1 : -1),
        rotation: 0,
        startOffset: {
            x: el.offsetLeft,
            y: el.offsetTop
        }
    };

    i++;
}

function draw() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    i = 0;
    for (var el of animateEls) {
        for (var axis of ['x', 'y']) {
            var offset = offsets[i][axis];
            var direction = axis === 'x' ? offsets[i].xDirection : offsets[i].yDirection;

            if ((direction === 1 && offset >= ((axis === 'x' ? windowWidth : windowHeight) - 150)) ||
                (direction === -1 && offset <= 50)) {
                if (axis === 'x') {
                     offsets[i].xDirection = direction * -1;
                } else {
                     offsets[i].yDirection = direction * -1;
                }
            }

            offsets[i][axis] = (offset + (SPEED * direction));
        }

        var renderOffsetX = offsets[i].x - offsets[i].startOffset.x;
        var renderOffsetY = offsets[i].y - offsets[i].startOffset.y;

        //offsets[i].rotation += ROTATE_SPEED;
        //var rotation = offsets[i].rotation;

        //if (rotation >= ROTATE_MAX) {
        //    rotation = offsets[i].rotation = 0;
        //}

        if (enablePosition) {
            el.style.left = renderOffsetX + 'px';
            el.style.top = renderOffsetY + 'px';
        } else {
            el.style.transform = 'matrix(' + (1) + ', ' + (0) + ', ' + (0) + ', ' + (1) + ', ' + renderOffsetX + ', ' + renderOffsetY + ')';
        }

        i++;
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
