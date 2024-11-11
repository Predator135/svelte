const Excel = require('exceljs');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function getRowValues(RAW_Row) {
    return RAW_Row['_cells'].map((item) => {
        if (item !== undefined) {
            return item['_value']['value'];
        }
    })
};

function combineArrsToJsonObject(key_arr, value_arr) {
    if (key_arr.length !== value_arr.length) {
        console.log("provided arrays are not same size");
    }

    var tempObj = {};

    for (var i = 0; i < key_arr.length; i++) {
        if (value_arr[i] !== undefined && value_arr[i] !== null) {
            tempObj[key_arr[i].toString()] = value_arr[i].toString();
        } else {
            tempObj[key_arr[i].toString()] = value_arr[i];
        }
    }

    return tempObj;
}

function toNdjson(array) {
    return array.map(JSON.stringify).join('\n');
}

function vzCredit(rawString) {
    const lowerStr = rawString.toLowerCase();

    const nameIndex = lowerStr.indexOf("name:");
    const descriptionIndex = lowerStr.indexOf("description:");
    const ibanIndex = lowerStr.indexOf("iban:");
    const referenceIndex = lowerStr.indexOf("reference:");
    const valuedateIndex = lowerStr.indexOf("value date:");

    const name = rawString.substring((nameIndex + 5), (descriptionIndex - 1));
    const description = rawString.substring((descriptionIndex + 12), (ibanIndex - 1));
    const iban = rawString.substring((ibanIndex + 5), (referenceIndex - 1));
    const reference = rawString.substring((referenceIndex + 10), (valuedateIndex - 1));
    const valuedate = rawString.substring((valuedateIndex + 11), (rawString.length));

    return [description, valuedate];
}

function gmDebit(rawString) {
    const lowerStr = rawString.toLowerCase();

    const csnIndex = lowerStr.indexOf("card sequence no.:");
    const transactionIndex = lowerStr.indexOf("transaction:");
    const termIndex = lowerStr.indexOf("term:");
    const valuedateIndex = lowerStr.indexOf("value date:");

    const csn = rawString.substring((csnIndex + 18), (transactionIndex - 1));
    const transaction = rawString.substring((transactionIndex + 12), (termIndex - 1));
    const term = rawString.substring((termIndex + 5), (termIndex - 1));
    const valuedate = rawString.substring((valuedateIndex + 11), (rawString.length));

    return [csn, valuedate];
}

function gtCredit(rawString) {
    const lowerStr = rawString.toLowerCase();

    if (lowerStr.indexOf("name:") !== -1) {
        const nameIndex = lowerStr.indexOf("name:");
        const ibanIndex = lowerStr.indexOf("iban:");
        const referenceIndex = lowerStr.indexOf("reference:");
        const datetimeIndex = lowerStr.indexOf("date/time:");
        const valuedateIndex = lowerStr.indexOf("value date:");

        const name = rawString.substring((nameIndex + 5), (ibanIndex - 1));
        const iban = rawString.substring((ibanIndex + 5), (referenceIndex - 1));
        const reference = rawString.substring((referenceIndex + 10), (datetimeIndex - 1));
        const datetime = rawString.substring((datetimeIndex + 10), (ibanIndex - 1));
        const valuedate = rawString.substring((valuedateIndex + 11), (rawString.length));

        return [`${reference} - ${datetime}`, valuedate];
    } else {
        const fromIndex = lowerStr.indexOf("from");
        const valuedateIndex = lowerStr.indexOf("value date:");

        const from = rawString.substring(fromIndex, (valuedateIndex - 1));
        const valuedate = rawString.substring((valuedateIndex + 11), (rawString.length));

        return [from, valuedate];
    }
}

function gtDebit(rawString) {
    const lowerStr = rawString.toLowerCase();

    if (lowerStr.indexOf("name:") !== -1) {
        var ibanPresent = false;

        const nameIndex = lowerStr.indexOf("name:");
        if (lowerStr.indexOf("iban:") !== -1) {
            var ibanIndex = lowerStr.indexOf("iban:");
            ibanPresent = true;
        }
        const descriptionIndex = lowerStr.indexOf("description:");
        const valuedateIndex = lowerStr.indexOf("value date:");

        if (ibanPresent) {
            var name = rawString.substring((nameIndex + 5), (ibanIndex - 1));
            var iban = rawString.substring((ibanIndex + 5), (descriptionIndex - 1));
            var description = rawString.substring((descriptionIndex + 12), (valuedateIndex - 1));
            var valuedate = rawString.substring((valuedateIndex + 11), (rawString.length));
        } else {
            var name = rawString.substring((nameIndex + 5), (descriptionIndex - 1));
            var description = rawString.substring((descriptionIndex + 12), (valuedateIndex - 1));
            var valuedate = rawString.substring((valuedateIndex + 11), (rawString.length));
        }

        return [`${description}`, valuedate];
    } else {
        const toIndex = lowerStr.indexOf("to");
        const valuedateIndex = lowerStr.indexOf("value date:");

        const from = rawString.substring(toIndex, (valuedateIndex - 1));
        const valuedate = rawString.substring((valuedateIndex + 11), (rawString.length));

        return [from, valuedate];
    }
}

function dvDebit(rawString) {
    const lowerStr = rawString.toLowerCase();

    const periodIndex = 0;
    const valuedateIndex = lowerStr.indexOf("value date:");

    const period = rawString.substring(periodIndex, (valuedateIndex - 1));
    const valuedate = rawString.substring((valuedateIndex + 11), (rawString.length));

    return [period, valuedate];
}

function descriptionFormatter(ingCode, ingTransactionType, rawString) {

    switch (ingCode) {
        case "VZ":
            return vzCredit(rawString);
        case "GM":
            return gmDebit(rawString);
        case "ID":
            return vzCredit(rawString); //same format
        case "GT":
            if (ingTransactionType == "Credit") {
                return gtCredit(rawString);
            }
            if (ingTransactionType == "Debit") {
                return gtDebit(rawString);
            }
        case "BA":
            if (ingTransactionType == "Credit") {
                return gmDebit(rawString);
            }
            if (ingTransactionType == "Debit") {
                return gmDebit(rawString); //same format
            }
        case "IC":
            if (ingTransactionType == "Credit") {
                return vzCredit(rawString); //same format
            }
            if (ingTransactionType == "Debit") {
                return vzCredit(rawString); //same format
            }
        case "OV":
            return gtCredit(rawString); //same format
        case "DV":
            return dvDebit(rawString);
    }
}

function formatDateString(inputDateString) {
    // Extract year, month, and day from the input string
    const year = inputDateString.slice(0, 4);
    const month = inputDateString.slice(4, 6);
    const day = inputDateString.slice(6, 8);

    // Create the formatted date string
    const formattedDateString = `${day}-${month}-${year}`;

    return formattedDateString;
}

async function main(filename) {
    //import raw excel from ing
    console.log("loading workbook");
    const workbook = new Excel.Workbook();
    await workbook.csv.readFile(filename);
    console.log("workbook loaded");

    console.log("loading worksheet");
    const worksheet = workbook.worksheets[0];
    console.log("worksheet loaded");

    console.log("getting total rowcount");
    var activeRows = worksheet.rowCount;
    console.log(`${activeRows} rows total found in sheet`);

    var headerRowIndex = 1;

    //get values of column name row
    var columnNamesRow = worksheet.getRow(headerRowIndex);
    var columnNames = getRowValues(columnNamesRow);

    //extract rows from sheet
    var activeRowData = worksheet.getRows(headerRowIndex + 1, activeRows);

    //convert row data to objects with correct keys and store in array
    var allDataRowsToObj = [];

    for (var i = 0; i < activeRows; i++) {
        let tempRow = getRowValues(activeRowData[i]);

        if (tempRow[0] == undefined) {
            continue;
        }

        let tempObj = combineArrsToJsonObject(columnNames, tempRow);

        allDataRowsToObj.push(tempObj);

    }

    console.log("getting data rowcount");
    console.log(`${allDataRowsToObj.length} data rows found in sheet`);

    //iterate over array and convert each entry to final format depending on ing format type
    for (var i = 0; i < allDataRowsToObj.length; i++) {
        var descriptionString = descriptionFormatter(allDataRowsToObj[i]['Code'],
            allDataRowsToObj[i]['Debit/credit'],
            allDataRowsToObj[i]['Notifications']);

        allDataRowsToObj[i]['ID'] = uuidv4();
        allDataRowsToObj[i]['ENTITY'] = allDataRowsToObj[i]['Name / Description'];
        allDataRowsToObj[i]['DESCRIPTION'] = descriptionString[0];
        allDataRowsToObj[i]['VALUEDATE'] = descriptionString[1];
        allDataRowsToObj[i]['AMOUNT'] = allDataRowsToObj[i]['Amount (EUR)'].replace(',', '.');
        allDataRowsToObj[i]['TRANSACTION_METHOD'] = allDataRowsToObj[i]['Transaction type'];
        allDataRowsToObj[i]['DATE'] = formatDateString(allDataRowsToObj[i]['Date']);

        if (allDataRowsToObj[i]['Counterparty'] == null) {
            allDataRowsToObj[i]['Counterparty'] = "";
        }

        if(allDataRowsToObj[i]['Debit/credit'] == "Credit"){
            allDataRowsToObj[i]['TRANSACTION_TYPE'] = "Inkomst";
        }

        if(allDataRowsToObj[i]['Debit/credit'] == "Debit"){
            allDataRowsToObj[i]['TRANSACTION_TYPE'] = "Uitgave";
        }

        allDataRowsToObj[i]['CATEGORY_TAGS'] = [];
        allDataRowsToObj[i]['TELT_MEE'] = true;
        allDataRowsToObj[i]['ENTITY_ALIAS'] = "";
        allDataRowsToObj[i]['NATUURLIJK_PERSOON'] = false;
        allDataRowsToObj[i]['VERANTWOORDING'] = "";
        allDataRowsToObj[i]['GESPLITSTE_TRANSACTIE'] = false;
        allDataRowsToObj[i]['ORIGINEEL_BERICHT'] = "";
        allDataRowsToObj[i]['RECURRING'] = false;
        allDataRowsToObj[i]['OPENSTAAND'] = false;
        allDataRowsToObj[i]['VERWERKT'] = false;
        allDataRowsToObj[i]['LOCALHOST_TRANSACTION'] = false;

        delete allDataRowsToObj[i]['Amount (EUR)'];
        delete allDataRowsToObj[i]['Name / Description'];
        delete allDataRowsToObj[i]['Debit/credit'];
        delete allDataRowsToObj[i]['Notifications'];
        delete allDataRowsToObj[i]['Transaction type'];
        delete allDataRowsToObj[i]['Date'];

        console.log(allDataRowsToObj[i]);
        // fs.appendFileSync('./data.json',JSON.stringify(allDataRowsToObj[i]));
    }

    // console.log(allDataRowsToObj.length);
    fs.appendFileSync('./data.json',JSON.stringify(allDataRowsToObj));

    //store final array in local json file
}

main('./ing-new.csv');