🚀 Proyecto Final Bootcamp Fiori

Aplicación desarrollada en SAPUI5 estilo Freestyle que permite consultar y simular la gestión de proveedores y productos a partir del servicio Northwind OData. Se simulan funcionalidades de creación local, validación de formularios y navegación entre vistas.

🔍 Vista General del Proyecto

Este diagrama interactivo muestra la arquitectura del proyecto, los componentes clave y sus relaciones:

![diagram](https://github.com/user-attachments/assets/0b4a3f10-e4b8-4059-9c64-cdba16fc9328)


## 📁 Estructura del Proyecto

```plaintext
webapp/
├── controller/
│   ├── App.controller.js
│   ├── Home.controller.js
│   └── Detail.controller.js
├── view/
│   ├── App.view.xml
│   ├── Home.view.xml
│   ├── Detail.view.xml
│   └── fragments/
│       ├── Suppliers_Table.fragment.xml
│       ├── Suppliers_Filters.fragment.xml
│       ├── Product_Table.fragment.xml
│       └── Product_Form.fragment.xml
├── model/
│   ├── models.js
│   └── formatter.js
├── utils/
│   ├── HomeHelper.js
│   └── HomeService.js
├── i18n/
│   ├── i18n.properties
├── localService/
│   └── mainService/metadata.xml
├── Component.js
├── index.html
└── manifest.json



## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>Tue Apr 01 2025 00:48:11 GMT+0000 (Coordinated Universal Time)|
|**App Generator**<br>@sap/generator-fiori-freestyle|
|**App Generator Version**<br>1.17.1|
|**Generation Platform**<br>SAP Business Application Studio|
|**Template Used**<br>simple|
|**Service Type**<br>SAP System (ABAP On Premise)|
|**Service URL**<br>https://services.odata.org/northwind/northwind.svc/|
|**Module Name**<br>freestyle|
|**Application Title**<br>App - PF Bootcamp |
|**Namespace**<br>com.bootcamp.sapui5|
|**UI5 Theme**<br>sap_horizon|
|**UI5 Version**<br>1.134.1|
|**Enable Code Assist Libraries**<br>False|
|**Enable TypeScript**<br>False|
|**Add Eslint configuration**<br>False|


🚀 Funcionalidades
✅ Buscar proveedores por ID o nombre
✅ Filtrar por país
✅ Visualizar detalles del proveedor
✅ Simular productos asociados
✅ Agregar, editar y eliminar productos (simulado)
✅ Validación de campos obligatorios
✅ Mensajes interactivos e internacionales (i18n)

## freestyle

An SAP Fiori application.

### Starting the generated app

-   This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite.  In order to launch the generated app, simply run the following from the generated app root folder:

```
    npm start
```

- It is also possible to run the application using mock data that reflects the OData Service URL supplied during application generation.  In order to run the application with Mock Data, run the following from the generated app root folder:

```
    npm run start-mock
```

#### Pre-requisites:

1. Active NodeJS LTS (Long Term Support) version and associated supported NPM version.  (See https://nodejs.org)


✨ Creado por:

Sara Palacio Zapata

Frontend Developer apasionada por crear interfaces funcionales y limpias usando SAPUI5.


