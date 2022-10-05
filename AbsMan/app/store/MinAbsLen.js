Ext.define('Absman.store.aMinAbsLen', {
    extend: 'Ext.data.ArrayStore',

    alias: 'store.minabslen',


    fields: [
        { name: 'id', type: 'int' },
        { name: 'unit', type: 'int' },
        { name: 'value', type: 'int' },
        { name: 'text', type: 'string' },
        { name: 'desc', type: 'string' }
    ],


    data: [
        [0,0,25,'0.25','quarter of a day'],
        [1,0,50,'0.5','half day'],
        [2,0,100,'1','one day'],
        [3,1,25,'0.25','quarter of an hour'],
        [4,1,50,'0.5','half an hour'],
        [5,1,100,'1','one hour'],
        [6,1,200,'2','two hours'],
        [7,1,300,'3','three hours'],
        [8,1,400,'4','four hours'],
        [9,1,500,'5','five hours']
    ]
});