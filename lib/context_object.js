var _ = require('underscore')._,
    openurl = require('./../index.js');

var ContextObject = function()
{
    var _version = 'Z39.88-2004';
    var _timestamp = null;
    var _identifier = null;
    var _encoding = 'info:ofi/enc:UTF-8';
    var entities = {referent:null, referringEntity:null, referrer:null, requester:null, serviceType:null, resolver:null};

    var entityMap = {rft:"referent", rfr:"referrer",rfe:"referringEntity",req:"requester",svc:"serviceType",res:"resolver"};

    this.loadFromKev = function(kevString, callback)
    {
        parseKev(this, kevString, callback)
    };

    var parseKev = function(obj, kevString, callback)
    {
        var keyVals = {};

        var kevToKeyVals = function(params, callback)
        {
            var param = params.shift();
            var p = param.split("=");
            if(keyVals[p[0]] && keyVals[p[0]] instanceof Array)
            {
                keyVals[p[0]].push(decodeURIComponent(p[1]))
            }    else if(keyVals[p[0]] && keyVals[p[0]] instanceof String) {
                keyVals[p[0]] = [keyVals[p[0]], decodeURIComponent(p[1])];
            } else {
                keyVals[p[0]] = decodeURIComponent(p[1]);
            }
            if(params.length > 0)
            {
                kevToKeyVals(params, callback);
            } else {
                callback();
            }
        };
        kevToKeyVals(kevString.split("&"), function(err) {
            loadFromKeyVals(obj, keyVals, callback);
        });
    };


    var loadKeyVal = function(obj, key, val, callback)
    {
        if(key.match(/^url_/))
        {
            callback();
        } else if(key.match(/^[A-z0-9]+_[A-z0-9]+/))
        {
            setEntityMetadata(key, val, obj, callback);
        } else if(key.match(/^[A-z0-9]+\.[A-z0-9]+/))
        {
            setEntityValue(key, val, obj, callback);
        } else if(['ctx_ver','ctx_enc','ctx_tim'].indexOf(key) !== -1) {
            switch(key)
            {
                case 'ctx_ver':
                    _version = val;
                    break;
                case 'ctx_enc':
                    _encoding = val;
                    break;
                case 'ctx_id':
                    _identifier = val;
                    break;
                case 'ctx_tim':
                    _timestamp = val;
                break;
            }
            callback();
        } else {
            setEntityValue('rft.'+key, val, obj, callback);
        }
    };

    var loadFromKeyVals = function(obj, keyVals, callback){
        var key = Object.keys(keyVals).shift();
        loadKeyVal(obj, key, keyVals[key], function(err)
        {
            delete keyVals[key];
            if(!_.isEmpty(keyVals))
            {
                loadFromKeyVals(obj, keyVals, callback);
            } else {
                callback();
            }
        });
    };

    this.loadFromKeyVals = function(keyVals, callback) { loadFromKeyVals(this, keyVals, callback); };

    var setEntityMetadata = function(key, val, obj, callback)
    {
        var keyParts = key.split(/_(.+)/, 2);
        if(!entityMap[keyParts[0]])
        {
            definePrivateEntity(obj, keyParts[0], null);
        }
        if(!entities[entityMap[keyParts[0]]])
        {
            entities[entityMap[keyParts[0]]] = new openurl.entity();
        }
        entities[entityMap[keyParts[0]]].setMetadata(keyParts[1], val);
        callback();
    };

    var setEntityValue = function(key, val, obj, callback)
    {
        var keyParts = arguments[0].split(/\.(.+)/, 2);
        if(!entityMap[keyParts[0]])
        {
            entityMap[keyParts[0]] = keyParts[0];
            definePrivateEntity(obj, keyParts[0], function(err) {
                setEntityValue(key, val, obj, callback);
            });
        } else {
            if(!entities[entityMap[keyParts[0]]])
            {
                entities[entityMap[keyParts[0]]] = new openurl.entity();
            }
            if(!(val instanceof Array))
            {
                val = [val];
            }
            entities[entityMap[keyParts[0]]].setValue(keyParts[1],val.shift());
            if(val.length > 0)
            {
                setEntityValue(key, val, obj, callback);
            } else {
                callback();
            }
        }
    };

    this.__defineGetter__('version', function(){ return _version });

    this.__defineGetter__('timestamp', function(){ return _timestamp });

    this.__defineSetter__('timestamp', function(t) { _timestamp = t; });

    this.__defineGetter__('identifier', function(){ return _identifier });

    this.__defineSetter__('identifier', function(i) { _identifier = i; });

    this.__defineGetter__('encoding', function(){ return _encoding });

    this.__defineSetter__('encoding', function(e) { _encoding = e; });

    /*
     * Referent getter/setter and alias
     */

    this.__defineGetter__('referent', function(){ return entities.referent });

    this.__defineSetter__('referent', function(entity)
    {
        setEntity('referent', entity);
    });

    this.__defineGetter__('rft', function(){ return entities.referent });

    this.__defineSetter__('rft', function(entity)
    {
        setEntity('referent', entity);
    });

    /*
     * ReferringEntity getter/setter and alias
     */

    this.__defineGetter__('referringEntity', function(){ return entities.referringEntity });

    this.__defineSetter__('referringEntity', function(entity)
    {
        setEntity('referringEntity', entity);
    });

    this.__defineGetter__('rfe', function(){ return entities.referringEntity });

    this.__defineSetter__('rfe', function(entity)
    {
        setEntity('referringEntity', entity);
    });

    /*
     * Referrer getter/setter and alias
     */

    this.__defineGetter__('referrer', function(){ return entities.referrer });

    this.__defineSetter__('referrer', function(entity)
    {
        setEntity('referrer', entity);
    });

    this.__defineGetter__('rfr', function(){ return entities.referrer });

    this.__defineSetter__('rfr', function(entity)
    {
        setEntity('referrer', entity);
    });

    /*
     * Requester getter/setter and alias
     */

    this.__defineGetter__('requester', function(){ return entities.requester });

    this.__defineSetter__('requester', function(entity)
    {
        setEntity('requester', entity);
    });

    this.__defineGetter__('req', function(){ return entities.requester });

    this.__defineSetter__('req', function(entity)
    {
        setEntity('requester', entity);
    });

    /*
     * ServiceType getter/setter and alias
     */

    this.__defineGetter__('serviceType', function(){ return entities.serviceType });

    this.__defineSetter__('serviceType', function(entity)
    {
        setEntity('serviceType', entity, true);
    });

    this.__defineGetter__('svc', function(){ return entities.serviceType });

    this.__defineSetter__('svc', function(entity)
    {
        setEntity('serviceType', entity, true);
    });

    /*
     * Resolver getter/setter and alias
     */

    this.__defineGetter__('resolver', function(){ return entities.resolver });

    this.__defineSetter__('resolver', function(entity)
    {
        setEntity('resolver', entity, true);
    });

    this.__defineGetter__('res', function(){ return entities.resolver });

    this.__defineSetter__('res', function(entity)
    {
        setEntity('resolver', entity, true);
    });


    var setEntity = function(entityName, entity, repeatable)
    {
        if(repeatable && entity instanceof Array)
        {
            _.each(entity, function(ent)
            {
                if(!isEntityObject(ent))
                {
                    throw new TypeError('Argument needs to be an Entity object or an array of Entity objects');
                }
            });
        }
        else if(!isEntityObject(entity))
         {
             return new TypeError('Argument needs to be an Entity object');
         }
        entities[entityName] = entity;
    };

    var definePrivateEntity = function(obj, abbreviation, name, callback)
    {
        if(typeof name === 'undefined')
        {
            name = abbreviation;
        }

        entityMap[abbreviation] = name;

        obj.__defineGetter__(abbreviation, function(){ return entities[name] });

        obj.__defineSetter__(abbreviation, function(entity)
        {
            setEntity(name, entity, true);
        });
        if(typeof callback === 'function')
        {
            callback();
        }
    };

    this.definePrivateEntity = function(abbreviation, name) { definePrivateEntity(this, abbreviation, name); };

    var isEntityObject = function(entity)
    {
        var proto_entity = openurl.entity();
        if(!entity instanceof Object)
        {
            return false;
        }
        return _.functions(entity).toString() == _.functions(proto_entity).toString();


    };

    this.toKev = function()
    {
        var kevs = ['url_ver=Z39.88-2004', 'url_ctx_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Actx'];
        if(_identifier)
        {
            kevs.push("ctx_id="+encodeURIComponent(_identifier));
        }

        if(_version)
        {
            kevs.push("ctx_ver="+encodeURIComponent(_version));
        }

        if(_encoding)
        {
            kevs.push("ctx_enc="+encodeURIComponent(_encoding));
        }

        if(_timestamp)
        {
            kevs.push("ctx_tim="+encodeURIComponent(_timestamp));
        }

        var kev = kevs.join("&");

        var abbrs = {};

        for(e in entityMap)
        {
            abbrs[entityMap[e]] = e;
        }
        for(e in entities)
        {
            // KEV doesn't support repeating entities
            if(entities[e] instanceof Array)
            {
                kev = kev + "&" + entities[e][0].toKev(abbrs[e]);
            } else if(entities[e]){
                kev = kev + "&" + entities[e].toKev(abbrs[e]);
            }
        }
        return(kev);
    }
};

module.exports = function() {
    return new ContextObject();
};
