Ext.define('AbsMan.view.main.UserModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.user',


    stores: {

        formData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'main.UserProfile',

            listeners: {
                //load: 'onLoadedRecord',
                beforeload: 'onBeforeLoadRecord'
            }


        }
    }
});
