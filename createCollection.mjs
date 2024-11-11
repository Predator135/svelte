import PocketBase from 'pocketbase';

//#region old

// // Configuration: Set your PocketBase API URL, admin email, and password here
// const apiUrl = 'https://pocketbase.home.nl';           // e.g., http://localhost:8090
// const email = 'shekharmuziek@hotmail.com';         // Your PocketBase admin email
// const password = 'kKy2dS7NWqmthTs';   // Your PocketBase admin password

// const pb = new PocketBase(apiUrl);

// async function createCollection() {
//     try {
//         // Authenticate as an admin
//         await pb.admins.authWithPassword(email, password);
//         console.log("Admin authenticated successfully.");

//         // Define collection schema
//         const collectionData = {
//             name: "transactions",
//             type: "base",
//             schema: [
//                 { name: "Account", type: "text" },
//                 { name: "Counterparty", type: "text" },
//                 { name: "Code", type: "text" },
//                 { name: "ID", type: "text" },
//                 { name: "ENTITY", type: "text" },
//                 { name: "DESCRIPTION", type: "text" },
//                 { name: "VALUEDATE", type: "date" },
//                 { name: "AMOUNT", type: "number" },
//                 { name: "TRANSACTION_METHOD", type: "text" },
//                 { name: "DATE", type: "date" },
//                 { name: "TRANSACTION_TYPE", type: "text" },
//                 { name: "CATEGORY_TAGS", type: "json", options: { maxSize: 1000 } },
//                 { name: "TELT_MEE", type: "bool", options: { default: true } },
//                 { name: "ENTITY_ALIAS", type: "text" },
//                 { name: "NATUURLIJK_PERSOON", type: "bool", options: { default: false } },
//                 { name: "VERANTWOORDING", type: "text" },
//                 { name: "GESPLITSTE_TRANSACTIE", type: "bool", options: { default: false } },
//                 { name: "ORIGINEEL_BERICHT", type: "text" },
//                 { name: "RECURRING", type: "bool", options: { default: false } },
//                 { name: "OPENSTAAND", type: "bool", options: { default: false } },
//                 { name: "VERWERKT", type: "text" },
//                 { name: "LOCALHOST_TRANSACTION", type: "bool", options: { default: false } }
//             ],
//             options: {}
//         };

//         // Create the collection
//         const newCollection = await pb.collections.create(collectionData);
//         console.log("Collection created successfully:", newCollection);
//     } catch (error) {
//         console.error("Failed to create collection:", error);
//     }
// }

// // Run the script
// createCollection();

//#endregion

// Initialize the PocketBase client
const pb = new PocketBase('https://pocketbase.home.nl');

// Authenticate as admin (adjust credentials as needed)
async function authenticateAdmin() {
    await pb.admins.authWithPassword('shekharmuziek@hotmail.com', 'kKy2dS7NWqmthTs');
}

// Create collection function
async function createCollection() {
    await authenticateAdmin();

    // Define collection schema based on JSON structure
    const schema = [
        {
            name: 'Account',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'Counterparty',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'Code',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'ENTITY',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'DESCRIPTION',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'VALUEDATE',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'AMOUNT',
            type: 'number',
        },
        {
            name: 'TRANSACTION_METHOD',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'DATE',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'TRANSACTION_TYPE',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'CATEGORY_TAGS',
            type: 'json',
            options: {
                "maxSize": 2000000
            }
        },
        {
            name: 'TELT_MEE',
            type: 'bool',
            required: false,
        },
        {
            name: 'ENTITY_ALIAS',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'NATUURLIJK_PERSOON',
            type: 'bool',
            required: false,
        },
        {
            name: 'VERANTWOORDING',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'GESPLITSTE_TRANSACTIE',
            type: 'bool',
            required: false,
        },
        {
            name: 'ORIGINEEL_BERICHT',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'RECURRING',
            type: 'bool',
            required: false,
        },
        {
            name: 'OPENSTAAND',
            type: 'bool',
            required: false,
        },
        {
            name: 'VERWERKT',
            type: 'text',
            required: false,
            options: {
                min: 0,
            },
        },
        {
            name: 'LOCALHOST_TRANSACTION',
            type: 'bool',
            required: false,
        },
    ];

    try {
        // Create the collection with the defined schema
        const collection = await pb.collections.create({
            name: 'transactions',
            type: 'base',
            schema: schema,
            listRule: "",     
            viewRule: "",     
            createRule: "",   
            updateRule: "",   
            deleteRule: "",
        });

        console.log('Collection created successfully:', collection);
    } catch (error) {
        console.error('Error creating collection:', error);
    }

}
// Execute the createCollection function
createCollection();
