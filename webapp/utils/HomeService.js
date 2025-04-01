// Llama la lista de productos

// oModel, es oData en este caso

sap.ui.define([], function () {
    "use strict";

    return {
        readProducts: async function (oModel, oFilter) {
            const aRequestPromises = [
                new Promise(function (resolve, reject) {
                    oModel.read('/Products', {
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