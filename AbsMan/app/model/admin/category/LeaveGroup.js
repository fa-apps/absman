Ext.define('AbsMan.model.admin.category.LeaveGroup', {
    extend: 'AbsMan.model.Base',

    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'displayorder', type: 'int' },
        { name: 'isremovable', type: 'boolean' },
        { name: 'lastupdate', type: 'int'}
    ]

});
