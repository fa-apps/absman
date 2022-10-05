
Ext.define('AbsMan.view.formpanel.MyContacts', {
    extend: 'Ext.form.Panel',

    requires: [
        'AbsMan.view.formpanel.MyContactsModel',
		'AbsMan.view.formpanel.MyContactsController'
    ],

    xtype: 'my-contacts',


    viewModel: {
        type: 'my-contact'
    },

    controller: 'my-contact',


    closable:true,


    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            text: 'Save and Close',
            iconCls: 'x-fa fa-save',
            scope: this,
            handler: this.saveCloseForm
        }, {
            text: 'Save',
            iconCls: 'x-fa fa-save',
            scope: this,
            handler: this.applyForm
        }, {
            //todo rec saved?
            text: 'Close',
            iconCls: 'x-fa fa-close',
            scope: this,
            handler: this.closeForm
        }, {
            text: 'Delete',
            iconCls: 'x-fa fa-trash-o',
            scope: this,
            disabled: true,
            handler: this.deleteRecord

        }, '->', {
            text: 'Favorites',
            iconCls: 'x-fa fa-heart-o',
            scope: this,
            tooltip: 'Click here to add this form to your favorites',
            handler: this.addToFavorites,
            disabled: false

        }, {
            text: 'Reload',
            scope: this,
            iconCls: 'x-fa fa-refresh',
            tooltip: 'todo Click here to reload the form.<br>All modifications will be lost!',
            handler: this.reloadForm
        }]
    }]


});