Ext.define('AbsMan.model.formpanel.Entitlement', {
    extend: 'AbsMan.model.Base',

    fields: [

        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'allocated', type: 'number'},
        {name: 'left', type: 'number'},
        {name: 'ondemandleft', type: 'number'},
        {name: 'taken', type: 'number'},
        {name: 'ondemandtaken', type: 'number'},
        {name: 'validfrom', type: 'date', dateFormat: 'Y-m-d'},
        {name: 'validto', type: 'date', dateFormat: 'Y-m-d'},
        {name: 'lastupdate', type: 'int'},
        {name: 'hidden', type: 'boolean'},
        {name: 'enforcevalidity', type: 'boolean'}



    ]

});