Ext.define('AbsMan.view.appmenu.AppMenuController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.tree-list',

    onAppMenuClick: function(tree, node) {
        var contentPanels = Ext.ComponentQuery.query('#tabpanels')[0];

        if (node && node.get('formType')) {
            contentPanels.fireEvent("newpanel", node.get('formType'), node.get('formId'));
        }
    },

    onToggleMicro: function () {
        var treelist = this.lookupReference('treelist'),
            ct = treelist.ownerCt,
            isMicro = treelist.getMicro();

        if (isMicro) {
            ct.setWidth ( ct.getMaxWidth() , true);
            ct.setIconCls ('fa fa-angle-left');
            ct.setTitle('Navigation');
        } else {
            ct.setWidth ( ct.getMinWidth() );
            ct.setIconCls ('fa fa-angle-right');
            ct.setTitle(' ');
        }

        treelist.setMicro(!isMicro);

        if (Ext.isIE8) {
            this.repaintList(treelist, treelist.getMicro());
        }
    },

    repaintList: function(treelist, microMode) {
        treelist.getStore().getRoot().cascadeBy(function(node) {
            var item, toolElement;

            item = treelist.getItem(node);

            if (item && item.isTreeListItem) {
                if (microMode) {
                    toolElement = item.getToolElement();

                    if (toolElement && toolElement.isVisible(true)) {
                        toolElement.syncRepaint();
                    }
                }
                else {
                    if (item.element.isVisible(true)) {
                        item.iconElement.syncRepaint();
                        item.expanderElement.syncRepaint();
                    }
                }
            }
        });
    }

});