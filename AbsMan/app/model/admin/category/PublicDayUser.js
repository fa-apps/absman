Ext.define('AbsMan.model.admin.category.PublicDayUser', {
    extend: 'AbsMan.model.Base',


    fields: [

        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'date', type: 'date', dateFormat:'Y-m-d'},
        { name: 'length', type: 'int' },
        { name: 'displayorder', type: 'int' },
        { name: 'year', type: 'string'},
        { name: 'lastupdate', type: 'int' }
    ],


    proxy: {
        type: 'rest',
        baseUrl: 'admin/user/publicday/',
        url: 'admin/user/publicday/',
        reader: {
            type : 'array',
            rootProperty: 'data'
        },
        writer: {
            writeAllFields : true
        }
    }


});


