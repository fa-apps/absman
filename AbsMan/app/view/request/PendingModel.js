Ext.define('AbsMan.view.request.PendingModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.pending',

    formulas : {

        currentRecord: {
            get: function (get) {
                return get('pendingData').getAt(0);
            }
        }


    },


    stores: {

        pendingData: {

            fields: [
                {name: 'pendingType', type: 'string'},
                {name: 'PendingCount', type: 'string'},
                {name: 'pendingText', type: 'string'}
            ],

            proxy: {

                type: 'rest',
                baseUrl: 'pending/',
                url: 'pending/',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            autoLoad: true,
            autoSync: false,
            pageSize: 0
        }
    },

    data : {

        selectedPendingView : 'approver',
        listPendingPreference : true

     }

});