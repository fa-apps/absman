Ext.define('AbsMan.model.admin.category.PublicDayGroup', {
    extend: 'AbsMan.model.Base',


    fields: [

        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'date', type: 'date', dateFormat:'Y-m-d'},
        { name: 'displayorder', type: 'int' },
        { name: 'isremovable', type: 'boolean' },
        { name: 'year', type: 'string'},
        { name: 'lastupdate', type: 'int'}

    ]


});


