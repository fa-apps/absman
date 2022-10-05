Ext.define('AbsMan.model.util.pickUser', {
    extend: 'AbsMan.model.Base',

    fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'number', type: 'string'},
        {name: 'first', type: 'string'},
        {name: 'last', type: 'string'},
        {name: 'country', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'company', type: 'string'}
    ],

    proxy: {
        type: 'ajax',
        baseUrl: 'user/search/',
        url: 'user/search/dummy',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});