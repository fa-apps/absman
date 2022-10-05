/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('AbsMan.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',



    stores: {

        userPreference: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'main.UserPreference'
        }
    }



});
