
Ext.define('AbsMan.view.admin.category.CompanyPublicDayController', {
    extend: 'AbsMan.view.admin.category.CompanyCategoryController',


    alias: 'controller.companypublicdaypanel',


    onAdd : function() {

        this.getView().ownerCt.controller.adminPanels.fireEvent("newpanel","adminform-pub-0-" + this.ownerId);
    },

    onEdit : function() {

        var selectedRecord = this.getView().getSelectionModel().getSelected().items[0];

        if (selectedRecord) this.getView().ownerCt.controller.adminPanels.fireEvent("newpanel","adminform-pub-" + selectedRecord.id);

    },

    publicDayLengthRender : function (value,metaData,record) {

        return this.getViewModel().getData().publicDayLength[value][1];

    },

    onSaveSorting : function() {

    },

    onLoad : function() {

        this.parentLoadedSubForms["pub"] = this.getOldestTimeStamp();
    }

});