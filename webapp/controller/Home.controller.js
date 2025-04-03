sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/library",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter"
], (Controller, CoreLibrary, FilterOperator, Filter, Sorter) => {
    "use strict";

    const SortOrder = CoreLibrary.SortOrder;

    return Controller.extend("com.bootcamp.sapui5.freestyle.controller.Home", {
        onInit: function () {
            console.log("Vista inicializada correctamente.");
            this.oRouter = this.getOwnerComponent().getRouter();
        
            // Esperar un pequeño tiempo para asegurar que el modelo esté disponible
            setTimeout(() => {
                const oModel = this.getView().getModel(); 
        
                if (!oModel) {
                    console.warn("⚠️ Modelo OData no disponible aún.");
                    return;
                }
        
                oModel.read("/Suppliers", {
                    success: (oData) => {
                        console.log("✅ Proveedores cargados:", oData);
        
                        const aSuppliers = oData.results || [];
        
                        // Extraer países únicos, evitar vacíos y ordenarlos
                        const aCountries = [...new Set(
                            aSuppliers.map(s => s.Country).filter(Boolean)
                        )].sort();
        
                        // Crear modelo con formato { key, text }
                        const oCountriesModel = new sap.ui.model.json.JSONModel(
                            aCountries.map(c => ({ key: c, text: c }))
                        );
        
                        // Asignar modelo a la vista
                        this.getView().setModel(oCountriesModel, "CountriesModel");
                        
                    },
                    error: (oError) => {
                        console.error("❌ Error al leer /Suppliers:", oError);
                    }
                });
            }, 500);
        },        

        onSearchSuppliers: function () {
            const oTable = this.getView().byId("id_SuppliersTable");
        
            if (!oTable) {
                console.error("No se encontró la tabla con ID 'id_SuppliersTable'");
                return;
            }
        
            const oBinding = oTable.getBinding("rows");
            const oModel = this.getOwnerComponent().getModel("SupplierSearchModel");
            const sSuppliersSearch = oModel.getProperty("/searchValue");
            const sCountry = oModel.getProperty("/countryValue");
        
            const aFilters = [];
        
            if (/^\d+$/.test(sSuppliersSearch)) {
                aFilters.push(new Filter("SupplierID", FilterOperator.EQ, sSuppliersSearch));
            }
        
            if (sSuppliersSearch) {
                aFilters.push(new Filter("CompanyName", FilterOperator.Contains, sSuppliersSearch));
            }
        
            if (sCountry) {
                aFilters.push(new Filter("Country", FilterOperator.EQ, sCountry));
            }
        
            // Mensaje de búsqueda!
            sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
                MessageToast.show("Buscando proveedores... espera un momento");
            });
        
            // Filtrar
            oBinding.filter([new Filter({ filters: aFilters, and: false })]);

            console.log("🌍 countryValue:", this.getOwnerComponent().getModel("SupplierSearchModel").getProperty("/countryValue"));

        },
        

        onClearFilters: function () {
            const oModel = this.getOwnerComponent().getModel("SupplierSearchModel");
            oModel.setProperty("/searchValue", "");
            oModel.setProperty("/countryValue", ""); 

            const oTable = this.getView().byId("id_SuppliersTable");
            if (!oTable) return;

            const oBinding = oTable.getBinding("rows");
            oBinding.filter([]);
        },

        clearAllSortings: function () {
            const oTable = this.getView().byId("id_SuppliersTable");
            if (!oTable) return;

            oTable.getBinding("rows").sort(null);
            this._resetSortingState();
        },

        _resetSortingState: function () {
            const oTable = this.getView().byId("id_SuppliersTable");
            if (!oTable) return;

            const aColumns = oTable.getColumns();
            for (let i = 0; i < aColumns.length; i++) {
                aColumns[i].setSortOrder(SortOrder.None);
            }
        },

        sortCategories: function () {
            const oTable = this.getView().byId("id_SuppliersTable");
            if (!oTable) return;

            const oBinding = oTable.getBinding("rows");
            oBinding.sort([
                new Sorter("Country", false)
            ]);
        },

        sortCategoriesAndName: function () {
            const oTable = this.getView().byId("id_SuppliersTable");
            if (!oTable) return;

            const oBinding = oTable.getBinding("rows");
            oBinding.sort([
                new Sorter("Country", false),
                new Sorter("CompanyName", false)
            ]);
        },

        onPress: function () {
            console.log("Botón de búsqueda presionado :D ");
        },

        onRowSelected: function (oEvent) {
            const oTable = this.byId("id_SuppliersTable");
            const iIndex = oEvent.getParameter("rowIndex");
            
            oTable.setSelectedIndex(iIndex);

            const oContext = oTable.getContextByIndex(iIndex);
            if (oContext) {
                const oSupplier = oContext.getObject();
        
                this.getOwnerComponent().getRouter().navTo("detail", {
                    SupplierID: oSupplier.SupplierID
                });
            }
        }
        
        
        

    });
});
