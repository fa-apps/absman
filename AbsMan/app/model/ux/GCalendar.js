Ext.define('AbsMan.model.ux.GCalendar', {
    extend: 'AbsMan.model.Base',

    fields: [
        {name: "id", type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'lastupdate', type: 'int'},
        {name: 'isdefault', type: 'boolean'}
    ],

    hasMany: {
        name: "schedule",
        model: "ux.HCalendar"
    },


    proxy: {
        type: 'rest',
        baseUrl: 'staff/group/calendar/',
        url: 'staff/group/calendar/'
    }


});