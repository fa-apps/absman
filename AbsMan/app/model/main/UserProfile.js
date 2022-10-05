Ext.define('AbsMan.model.main.UserProfile', {
    extend: 'AbsMan.model.Base',


    fields: [
        { name: 'id', type: 'string' },
        { name: 'username', type: 'string' },
        { name: 'firstname', type: 'string' },
        { name: 'lastname', type: 'string' },
        { name: 'displayname', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'number', type: 'string' },
        { name: 'title', type: 'string' }
    ],

    proxy: {
        type: 'ajax',
        baseUrl: 'user/',
        url: 'user/',
        reader : {
            type : 'json',
            rootProperty : 'data'
        }
    }

});


