# Web Apps @ 60fps
This talk will teach you the basics of writing fast JavaScript web apps.

## Running the presentation
Part of the presentation is seeing how blocking requests affect performance, and this is difficult to do
when files are served lightning-fast off the filesystem. To "fix" this, I wrote a slow webserver
for demonstration purposes/because I'm evil. The binary is included, so on must \*nix systems you can just run:

`./server`

And visit [localhost:8080](http://localhost:8080) to view the presentation and demos.

The presentation does not walk you through using the dev tools to inspect these problems, which is basically half this talk.
I'll try to post a link here to the recorded talk after I've done it.
