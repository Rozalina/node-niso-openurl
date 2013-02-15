var openurl = require('../index');

exports['testContextObjectMetadataGetterSetters'] = function(test)
{
    var ctx = new openurl.context_object();
    test.equals(ctx.version, "Z39.88-2004");
    ctx.version = 'foobar';
    test.notEqual(ctx.version, 'foobar');
    test.equals(ctx.version, "Z39.88-2004");
    ctx.timestamp = '1234567';
    test.equals(ctx.timestamp, '1234567');
    ctx.identifier = 'info:foo/bar';
    test.equals(ctx.identifier, 'info:foo/bar');
    test.equals(ctx.encoding, 'info:ofi/enc:UTF-8');
    ctx.encoding = 'info:ofi/enc:SOME-OTHER-ENCODING';
    test.equals(ctx.encoding, 'info:ofi/enc:SOME-OTHER-ENCODING');
    test.done();
};
exports['testEntityGettersSetters'] = function (test)
{
    var ctx = new openurl.context_object();
    x = "1";
    var rft = new openurl.entity();
    test.throws(ctx.rft="blah", TypeError);
    rft.setMetadata('id', x);
    ctx.referent = rft;
    test.deepEqual(ctx.referent, rft);
    test.deepEqual(ctx.rft, rft);
    x++;
    var rft2 = new openurl.entity();
    rft2.setMetadata('id', x);
    ctx.rft = rft2;
    test.deepEqual(ctx.referent, rft2);
    test.deepEqual(ctx.rft, rft2);
    var rfe = new openurl.entity();
    x++;
    rfe.setMetadata('id', x);
    ctx.referringEntity = rfe;
    test.deepEqual(ctx.referringEntity, rfe);
    test.deepEqual(ctx.rfe, rfe);
    var rfe2 = new openurl.entity();
    x++;
    rfe2.setMetadata('id', x);
    ctx.rfe = rfe2;
    test.deepEqual(ctx.referringEntity, rfe2);
    test.deepEqual(ctx.rfe, rfe2);
    var rfr = new openurl.entity();
    x++;
    rfr.setMetadata('id',x);
    ctx.referrer = rfr;
    test.deepEqual(ctx.referrer, rfr);
    test.deepEqual(ctx.rfr, rfr);
    var rfr2 = new openurl.entity();
    x++;
    rfr2.setMetadata('id', x);
    ctx.rfr = rfr2;
    test.deepEqual(ctx.referrer, rfr2);
    test.deepEqual(ctx.rfr, rfr2);
    var req = new openurl.entity();
    x++;
    req.setMetadata('id', x);
    ctx.requester = req;
    test.deepEqual(ctx.requester, req);
    test.deepEqual(ctx.req, req);
    var req2 = new openurl.entity();
    x++;
    req2.setMetadata('id',x);
    ctx.req = req2;
    test.deepEqual(ctx.requester, req2);
    test.deepEqual(ctx.req, req2);

    var svc = new openurl.entity();
    x++;
    svc.setMetadata('id',x);
    ctx.serviceType = svc;
    test.deepEqual(ctx.serviceType, svc);
    test.deepEqual(ctx.svc, svc);
    test.throws(function() { ctx.serviceType = [svc, "blah"]; }, TypeError);
    var svc2 = new openurl.entity();
    x++;
    svc2.setMetadata('id',x);
    test.doesNotThrow(function() { ctx.serviceType = [svc, svc2]; });
    test.deepEqual(ctx.serviceType[0], svc);
    test.deepEqual(ctx.svc[0], svc);
    test.deepEqual(ctx.serviceType[1], svc2);
    test.deepEqual(ctx.svc[1], svc2);
    ctx.svc = svc2;
    test.deepEqual(ctx.serviceType, svc2);
    test.deepEqual(ctx.svc, svc2);
    test.throws(function() { ctx.svc = [svc, "blah"]; }, TypeError);

    var res = new openurl.entity();
    x++;
    res.setMetadata('id',x);
    ctx.resolver = res;
    test.deepEqual(ctx.resolver, res);
    test.deepEqual(ctx.res, res);
    test.throws(function() { ctx.resolver = [res, "blah"]; }, TypeError);
    var res2 = new openurl.entity();
    x++;
    res2.setMetadata('id',x);
    test.doesNotThrow(function() { ctx.resolver = [res, res2]; });
    test.deepEqual(ctx.resolver[0], res);
    test.deepEqual(ctx.res[0], res);
    test.deepEqual(ctx.resolver[1], res2);
    test.deepEqual(ctx.res[1], res2);
    ctx.res = res2;
    test.deepEqual(ctx.resolver, res2);
    test.deepEqual(ctx.res, res2);
    test.throws(function() { ctx.res = [res, "blah"]; }, TypeError);

    test.done();
};

exports['testPrivateEntity'] = function(test)
{
    var ctx = new openurl.context_object();
    var e = new openurl.entity();
    ctx.definePrivateEntity('exp', 'exampleEntity');
    test.ok(ctx.__lookupGetter__('exp'));
    test.ok(ctx.__lookupSetter__('exp'));
    test.ok(typeof ctx.__lookupGetter__('exampleEntity') === 'undefined');
    test.ok(typeof ctx.__lookupSetter__('exampleEntity') === 'undefined');
    ctx.exp = e;
    test.deepEqual(ctx.exp, e);
    test.done();
};

exports['testToKev'] = function(test)
{
    var ctx = new openurl.context_object();
    ctx.rft = new openurl.entity();
    ctx.rft.setValue('isbn', '1234567890');
    ctx.rft.setMetadata('id', "info:isbn/1234567890");

    ctx.rfr = new openurl.entity();
    ctx.rfr.setMetadata('id', 'info:sid/example.org');

    ctx.svc = [new openurl.entity(), new openurl.entity()];
    ctx.svc[0].setValue('foo','bar');
    ctx.svc[1].setValue('baz','foobar');

    ctx.definePrivateEntity('exp', 'exampleEntity');
    ctx.exp = new openurl.entity();

    ctx.exp.setMetadata('id', 'info:id/foo.bar');
    ctx.exp.setValue('a','b');

    var kev = ctx.toKev();
    test.ok(kev.match(/^url_ver=Z39\.88\-2004\&url_ctx_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Actx\&/));
    test.ok(kev.match(/\&rft_id=info%3Aisbn%2F1234567890\&/));
    test.ok(kev.match(/\&ctx_ver=Z39\.88\-2004\&ctx_enc=info%3Aofi%2Fenc%3AUTF\-8\&/));
    test.ok(kev.match(/\&rft_id=info%3Aisbn%2F1234567890\&rft\.isbn=1234567890/));
    test.ok(kev.match(/\&rfr_id=info%3Asid%2Fexample\.org/));
    test.ok(kev.match(/\&svc\.foo=bar/));
    test.ok(!kev.match(/\&svc\.baz=foobar/));
    test.ok(!kev.match(/(rfe)|(req)|(res)[\._]/));
    test.ok(kev.match(/\&exp_id=info%3Aid%2Ffoo\.bar\&exp\.a=b/));
    test.done();
};

exports['testLoadFromKev'] = function(test)
{
    var ctx = new openurl.context_object();
    var kev = "url_ver=Z39.88-2004&url_ctx_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Actx&rft_id=info%3Adoi%2F10.1038%2Fnature01262&rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Ajournal&rft.doi=10.1038%2Fnature01262&rft.atitle=Initial%20sequencing%20and%20comparative%20analysis%20of%20the%20mouse%20genome&rft.au=Asif%20Chinwalla&rft.au=Chinwalla%2C%20Asif%20T.&rft.spage=520&rft.volume=420&rft.issue=6915&rft.date=2002-12&rft.issn=0028-0836&rft.issn=1476-4687&rft.eissn=0028-0836&rft.jtitle=Nature%20(London)&sfx.response_type=multi_obj_xml&sfx.doi_url=http://dx.doi.org&rft_id=info:doi/10.1038/nature01262&rfr_id=info:sid/talisaspire.com/clearance";
    ctx.loadFromKev(kev, function()
    {
        test.equals(ctx.rft.identifier, "info:doi/10.1038/nature01262");
        test.equals(ctx.rft.valFormat, "info:ofi/fmt:kev:mtx:journal");
        test.equals(ctx.rft.valFormat, "info:ofi/fmt:kev:mtx:journal");
        test.equals(ctx.rft.values.doi, "10.1038/nature01262");
        test.equals(ctx.rft.values.atitle, "Initial sequencing and comparative analysis of the mouse genome");
        test.equals(ctx.rft.values.au, "Chinwalla, Asif T.");
        test.equals(ctx.rft.values.spage, "520");
        test.equals(ctx.rft.values.volume, "420");
        test.equals(ctx.rft.values.issue, "6915");
        test.equals(ctx.rft.values.date, "2002-12");
        test.equals(ctx.rft.values.issn, "1476-4687");
        test.equals(ctx.rft.values.eissn, "0028-0836");
        test.equals(ctx.rft.values.jtitle, "Nature (London)");
        test.equals(ctx.sfx.values.response_type, "multi_obj_xml");
        test.equals(ctx.sfx.values.doi_url, "http://dx.doi.org");
        test.equals(ctx.rfr.identifier, "info:sid/talisaspire.com/clearance");
    });


    test.done();

};