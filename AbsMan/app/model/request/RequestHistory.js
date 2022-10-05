Ext.define('AbsMan.model.request.RequestHistory', {
    extend: 'AbsMan.model.Base',

    fields: [

        { name: 'id', type: 'string' },
        { name: 'date', type: 'date', dateFormat:'c'},
        { name: 'action', type: 'string' },
        { name: 'actionBy', type: 'string' },
        { name: 'text', type: 'string' }

    ]


});