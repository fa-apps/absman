Ext.define('AbsMan.model.formpanel.MyHome', {
    extend: 'AbsMan.model.BaseUser',



    proxy: {
        type: 'rest',
        baseUrl: 'home/',
        url: 'home/',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});


