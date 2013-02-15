var _ = require('underscore')._;

var Entity = function ()
{
    this.identifier = null;
    this.valFormat = null;
    this.refFormat = null;
    this.refLocation = null;
    this.privateData = null;
    var _values = {};

    this.__defineGetter__('values', function(){ return _values });

    this.setValue = function (key, value, replace)
    {
        if(!_values[key] || replace)
        {
            _values[key] = value;
        } else {
            if(!(_values[key] instanceof Array))
            {
                _values[key] = [_values[key]]
            }
            _values[key].push(value)
        }
    };

    this.setMetadata = function(key, value)
    {
        switch(key)
        {
            case 'id':
                this.identifier = value;
                break;
            case 'val_fmt':
                this.valFormat = value;
                break;
            case 'ref_fmt':
                this.refFormat = value;
                break;
            case 'ref':
                this.refLocation = value;
                break;
            case 'dat':
                this.privateData = value;
                break;
        }
    };

    this.toKev = function(abbr)
    {
        if(typeof abbr === 'undefined')
        {
            throw new SyntaxError("No abbreviation provided");
        } else {
            abbr = encodeURIComponent(abbr);
        }
        var kevs = [];

        if(this.identifier instanceof Array)
        {
            for(var i=0; i<this.identifier.length; i++)
            {
                kevs.push(abbr + "_id=" + encodeURIComponent(this.identifier[i]));
            }
        } else if(this.identifier)
        {
            kevs.push(abbr + "_id=" + encodeURIComponent(this.identifier));
        }
        var map = {valFormat:"val_fmt",refFormat:"ref_fmt",refLocation:"ref",privateData:"dat"};
        for(prop in map)
        {
            if(this[prop])
            {
                kevs.push(abbr + "_" + map[prop] + "=" + encodeURIComponent(this[prop]));
            }
        }

        for(key in _values)
        {
            if(_values[key] instanceof Array)
            {
                _.each(_values[key], function(val) {
                    kevs.push(abbr + "." + key + "=" + encodeURIComponent(val));
                });
            } else {
                kevs.push(abbr + "." + key + "=" + encodeURIComponent(_values[key]));
            }
        }
        return kevs.join("&");
    }
};

module.exports = function() {
  return new Entity();
};