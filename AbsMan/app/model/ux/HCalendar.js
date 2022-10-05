Ext.define('AbsMan.model.ux.HCalendar', {
    extend: 'AbsMan.model.Base',

    fields: [
        {name: "id", type: 'string'},
        {name: 'startDate', type: 'date', dateFormat: 'Y-m-d'},
        {name: 'startDateRatio', type: 'string'},
        {name: 'endDate', type: 'date', dateFormat: 'Y-m-d'},
        {name: 'endDateRatio', type: 'string'},
        {name: 'totalRequest', type: 'number'},
        {name: 'requestStatus', type: 'string'},
        {name: 'requestStatusId', type: 'number'}
    ]

});