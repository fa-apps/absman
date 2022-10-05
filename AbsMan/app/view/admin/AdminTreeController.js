
Ext.define('AbsMan.view.admin.AdminTreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.admintree',


    init: function () {

        var adminTree = this.getView();

        this.adminTree = adminTree;
        this.currentEditor = null;
        this.adminTreeStore = this.getViewModel().getStore("adminTreeStore");


        adminTree.on("newnode", function (newNode){

            var selNode = adminTree.getSelectionModel().getSelection()[0];
            if (selNode) {
                selNode.parentNode.insertChild(0,newNode);
            }
        });


        adminTree.on("deletenode", function (delNodeId){

            console.log('deletenode');


            var treeModelIndex = adminTree.store.findExact('id',delNodeId);

            if ( treeModelIndex != -1 ) {
                var record = adminTree.store.getAt(treeModelIndex);
                if (record) record.remove();
            }

        });


        adminTree.on("newfavorite", function (newNode){

            adminTree.getSelectionModel().select(0,false,true);
            var selNode = adminTree.getSelectionModel().getSelection()[0];

            if (selNode && selNode.data.loaded) {
                var insertedNode = selNode.insertChild(0,newNode);
                adminTree.getSelectionModel().select(insertedNode,false,true);
            }
        });


        adminTree.on("deletefavorite", function (favoriteId){

            console.log('deletefavorite');


            var treeModelIndex = adminTree.store.findExact('id',favoriteId + "-fav");

            if ( treeModelIndex != -1 ) {
                var record = adminTree.store.getAt(treeModelIndex);
                if (record) record.erase();

            }
            else {

                Ext.Ajax.request({
                    scope: this,
                    url: 'admin/tree/' + favoriteId + "-fav",
                    method : 'delete',
                    success: function (response) {
                        //todo message
                        console.log('removed via ajax',response);
                    },
                    failure: function (response) {
                        //todo ;
                    }
                });
            }
        });


        adminTree.on("nodechange" , function(nodeId, value) {

            var treeModelIndex = adminTree.store.findExact('id',nodeId);

            if (treeModelIndex != -1) {
                adminTree.store.getAt(treeModelIndex).set('name', value);
            }
        });
    },


    onAdminTreeClick: function( model, selection, index,  config) {

        if (selection) {

            var adminPanels = Ext.ComponentQuery.query('admin-panels[itemId=adminpanels]')[0];
                adminPanels.fireEvent("newpanel", "adminform-" + selection.data.id );

        }
    },


    onAdminTreeItemBeforeEdit: function(editor, context, eOpts ) {

        this.currentEditor = editor;
        return context.record.data.editable;
    },



    onAdminTreeItemEdit: function(editor, context) {


        this.adminTreeStore.sync({

            scope: this,
            success: function (batch, options) {

                Ext.Array.each(batch.getOperations(), function (operation) {

                    var response = Ext.JSON.decode(operation.getResponse().responseText);

                    if (response.success) {

                            AbsMan.util.mess(response.mess || "Favorite saved successfully.");

                    } else {

                        AbsMan.util.mess(response.mess || "Favorite not saved!.", AbsMan.util.ERROR);
                    }


                }, this);
            },
            failure: function (batch) {

                var response = batch.getOperations()[0].getError();

                AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
            }
        });

    },

    onRefreshAdminTree: function() {

        this.view.getStore().load();
    },

    onAdminTreeActionClick: function(grid, rowIndex, colIndex, actionItem, event, record, row) {

        var  contextmenu = new Ext.menu.Menu({
            items:[{
                text: 'Rename (F2)',
                iconCls: 'x-fa fa-pencil',
                tooltip: 'Change the text for this favorite',
                scope: this,
                handler:  function () { this.editFavorite(grid, rowIndex) }
            },{
                text: 'Delete (Del)',
                iconCls: 'x-fa fa-trash-o',
                tooltip: 'Delete this favorite',
                scope: this,
                handler: function () { this.deleteFavorite(record, rowIndex) }
            }]
        });
        contextmenu.showBy(event.target.offsetParent, 'tr-br');
    },


    onDrop: function (node, data, overModel, dropPosition, eOpts) {

        var draggedRecord = data.records[0],
            parentNode = draggedRecord.parentNode,
            targets = [];

        parentNode.eachChild(function (favorite) {
            targets.push(favorite.id.slice(0,-4));
        }, this);

        Ext.Ajax.request({
            scope: this,
            url: this.getViewModel().getStore("adminTreeStore").getProxy().baseUrl + '/order/' + userId,
            method: 'POST',
            params: {
                targets: Ext.JSON.encode(targets)
            },
            success: function (response) {

                var responseData = Ext.JSON.decode(response.responseText);

                if (responseData.success) {

                    AbsMan.util.mess(responseData.mess || "Favorites ordered", AbsMan.util.INFO);

                } else {

                    AbsMan.util.mess(responseData.mess || responseData.code || responseData.reason || "Error during order operation", AbsMan.util.ERROR);

                }
            },
            failure: function (response) {

                AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
            }
        });

    },


    onBeforeDrop: function (node, data, overModel, dropPosition, dropHandlers) {

        dropHandlers.wait = false;

        return overModel.parentNode.id ===  "favorites" &&  data.records[0].get("parentId") ===  "favorites";

    },


    editFavorite: function (grid, rowIndex) {

        grid.editingPlugin.startEditByPosition({ row: rowIndex, column: 0 });
        this.currentEditor.editors.items[0].items.items[0].selectText();

    },

    deleteFavorite: function (record, rowIndex) {

        var adminPanels = Ext.ComponentQuery.query('admin-panels[itemId=adminpanels]')[0];

        adminPanels.fireEvent("deletefavorite","adminform-" + record.data.id );
        record.erase();
    }
});