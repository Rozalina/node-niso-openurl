node-niso-openurl
=================

An OpenURL (NISO Z39.88) parser and serializer for node.js

Note: currently only works with KEVs (key encoded values)

Usage:

var openurl = require('openurl');

var ctx = new openurl.context_object();

ctx.rft = new openurl.entity();

ctx.rft.setValue('title', 'A Title');

ctx.toKev();

var kev = "ctx_ver=Z39.88-2004&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajournal&rft.issn=1045-4438&rfr_id=info:/example.org/1";

var ctx = new openurl.context_object();

ctx.loadFromKev(kev, function(err) {
    console.log(ctx.rft.values.issn);
    console.log(ctx.rfr.identifier);
});