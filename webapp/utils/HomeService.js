// Llama la lista de productos

// oModel, es oData en este caso

sap.ui.define([], function () {
    "use strict";

    return {
        readSuppliers: async function (oModel, oFilter) {
            const aRequestPromises = [
                new Promise(function (resolve, reject) {
                    oModel.read('/Suppliers', {
                        filters: oFilter,
                        success: resolve,
                        error: reject
                    })
                }.bind(this) )
            ];
            return Promise.all(aRequestPromises);
        }
    }
});