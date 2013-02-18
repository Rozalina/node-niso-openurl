var openurl = require('../index');

exports['testAttributes'] = function (test) {
    entity = new openurl.Entity();
    entity.identifier = '1234';
    test.equals('1234', entity.identifier);
    entity.valFormat = "foo:/bar";
    test.equals("foo:/bar", entity.valFormat);
    entity.refFormat = "bar:/foo";
    test.equals("bar:/foo", entity.refFormat);
    entity.refLocation = "http://example.org/foo";
    test.equals("http://example.org/foo", entity.refLocation);
    entity.privateData = 'foobar';
    test.equals('foobar', entity.privateData);

    test.done();
};

exports['testSetValues'] = function (test)
{
    entity = new openurl.Entity();
    entity.setValue('foo','bar');
    test.equals('bar', entity.values.foo);
    entity.setValue('foo', 'baz');
    test.ok((entity.values.foo instanceof Array), "Value is an array");
    test.equals('bar', entity.values.foo[0]);
    test.equals('baz', entity.values.foo[1]);
    entity.setValue('foo','raboof', true);
    test.equals('raboof',entity.values.foo);
    entity.setValue('bar','foo');
    test.equals('foo', entity.values.bar);
    test.ok((entity.values instanceof Object));
    test.done();
};

exports['testSetMetadata'] = function (test)
{
    entity = new openurl.Entity();
    entity.setMetadata('id', 'foo:/bar');
    test.equals('foo:/bar', entity.identifier);
    entity.setMetadata('val_fmt', 'foo.bar.baz');
    test.equals('foo.bar.baz', entity.valFormat);
    entity.setMetadata('ref_fmt', 'bar.baz.foo');
    test.equals('bar.baz.foo', entity.refFormat);
    entity.setMetadata('ref', 'baz.foo.bar');
    test.equals('baz.foo.bar', entity.refLocation);
    entity.setMetadata('dat', 'zabraboof');
    test.equals('zabraboof', entity.privateData);
    test.done();
};

exports['testToKev'] = function (test)
{
    entity = new openurl.Entity();
    test.throws(function(){entity.toKev()}, SyntaxError);
    entity.setValue('foo','bar');
    entity.setValue('foo', 'baz');
    entity.setValue('bar','foo');
    entity.setMetadata('id', 'foo:/bar');
    entity.setMetadata('val_fmt', 'foo.bar.baz');
    entity.setMetadata('ref_fmt', 'bar.baz.foo');
    entity.setMetadata('ref', 'http://baz.foo.bar/');
    entity.setMetadata('dat', 'zabraboof');
    var kev = entity.toKev('rft');
    test.ok(kev.match(/^rft_id=foo%3A%2Fbar\&/), "Test rft_id");
    test.ok(kev.match(/\&rft_val_fmt=foo\.bar\.baz\&/), "Test rft_val_fmt");
    test.ok(kev.match(/\&rft_ref_fmt=bar\.baz\.foo\&/), "Test rft_ref_fmt");
    test.ok(kev.match(/\&rft_ref=http%3A%2F%2Fbaz\.foo\.bar/), "Test rft_ref");
    test.ok(kev.match(/\&rft_dat=zabraboof/), "Test rft_dat");
    test.ok(kev.match(/\&rft\.foo=bar/), "Test rft.foo=bar");
    test.ok(kev.match(/\&rft\.foo=baz/), "Test rft.foo=baz");
    test.ok(kev.match(/\&rft\.bar=foo/), "Test rft.bar=foo");
    test.done();
};

