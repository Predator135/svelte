import PocketBase from 'pocketbase';
import ingData from './data.json' assert { type: "json" };

const pb = new PocketBase('https://pocketbase.home.nl');

async function main(){
    for(var i=0; i<ingData.length;i++){
        var data = {
            "Account": ingData[i]['Account'],
            "Counterparty": ingData[i]['Counterparty'],
            "Code": ingData[i]['Code'],
            "ENTITY": ingData[i]['ENTITY'],
            "DESCRIPTION": ingData[i]['DESCRIPTION'],
            "VALUEDATE": ingData[i]['VALUEDATE'],
            "AMOUNT": ingData[i]['AMOUNT'],
            "TRANSACTION_METHOD": ingData[i]['TRANSACTION_METHOD'],
            "DATE": ingData[i]['DATE'],
            "TRANSACTION_TYPE": ingData[i]['TRANSACTION_TYPE'],
            "CATEGORY_TAGS": ingData[i]['CATEGORY_TAGS'],
            "TELT_MEE": ingData[i]['TELT_MEE'],
            "ENTITY_ALIAS": ingData[i]['ENTITY_ALIAS'],
            "NATUURLIJK_PERSOON": ingData[i]['NATUURLIJK_PERSOON'],
            "VERANTWOORDING": ingData[i]['VERANTWOORDING'],
            "GESPLITSTE_TRANSACTIE": ingData[i]['GESPLITSTE_TRANSACTIE'],
            "ORIGINEEL_BERICHT": ingData[i]['ORIGINEEL_BERICHT'],
            "RECURRING": ingData[i]['RECURRING'],
            "OPENSTAAND": ingData[i]['OPENSTAAND'],
            "VERWERKT": ingData[i]['VERWERKT'],
            "LOCALHOST_TRANSACTION": ingData[i]['LOCALHOST_TRANSACTION'],
            "ORIG_ID": ingData[i]['ID']
        };
        const record = await pb.collection('transactions').create(data);
        console.log(ingData[i]);
    }
}

main();