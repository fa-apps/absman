Ext.define('AbsMan.view.request.RequestListModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.requestlist',

    formulas: {

        staff: {
            get: function (get) {
                return this.getView().listType == "staff" ? 'Staff ' : '';
            }
        },
        pending: {
            bind: '{listPending}',
            get: function (get) {
                return get ? 'Pending ' : '';
            }
        }

    },


    stores: {

        requestListData: {

            autoLoad: false,
            autoSync: false,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 25,
            model: 'request.RequestList',
            listeners: {
                beforeload: "beforeLoadForm",
                load: "afterLoadForm"
            },

            proxy: {

                type: 'rest',
                baseUrl: 'request/list/',
                url: 'request/list/',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        }
    },


    data: {

        title: 'Requests',
        listPending: true,
        hideSavePreference : false
    }

});