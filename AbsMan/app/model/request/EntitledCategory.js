Ext.define('AbsMan.model.request.EntitledCategory', {
    extend: 'AbsMan.model.Base',

    fields: [

        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'left', type: 'number'},
        {name: 'ondemandleft', type: 'number'},
        {name: 'useondemand', type: 'boolean'},
        {name: 'taken', type: 'number'},
        {name: 'ondemandtaken', type: 'number'},
        {name: 'startdateratio', type: 'number'},
        {name: 'enddateratio', type: 'number'},
        {name: 'startdate', type: 'date', dateFormat: 'Y-m-d'},
        {name: 'enddate', type: 'date', dateFormat: 'Y-m-d'},
        {name: 'lastupdate', type: 'int'}


    ]

});