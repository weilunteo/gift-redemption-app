// import * as fs from 'fs';
// import csv from 'csv-parser';
const fs = require('fs')
const csv = require('csv-parser')
// import {sql} from '@vercel/postgres';
const {sql} = require('@vercel/postgres');

interface csvRow {
    staff_pass_id: string;
    team_name: string;
    created_at: string;
}

async function createTable(){
    await sql`DROP TABLE IF EXISTS Team;`
    await sql`DROP TABLE IF EXISTS Redemption;`
    await sql`CREATE TABLE IF NOT EXISTS Team ( staff_pass_id varchar(255) PRIMARY KEY, team_name varchar(255), created_at varchar(255) );`;
    await sql`CREATE TABLE IF NOT EXISTS Redemption ( team_name varchar(255) PRIMARY KEY, redemption_status BOOLEAN, redeemed_at BIGINT);`;
    console.log('Table created successfully');
}

// Function to parse CSV and insert into PostgreSQL database
async function populateDatabase() {
    const csvFilePath = './src/app/scripts/staff-id-to-team-mapping-long.csv';
    // let x = 0
    const rows: Array<string> = []
  
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row: csvRow) => {
      rows.push(`('${row.staff_pass_id}', '${row.team_name}', '${row.created_at}')`);
    })
    .on('end', async () => {
        console.log('CSV file successfully processed');
        const insertQuery = `INSERT INTO Team (staff_pass_id, team_name, created_at) VALUES ${rows.join(',')};`
        await sql.query(insertQuery);
    });
}

// Call the functions to populate the database
async function executeSeed() {
    await createTable();
    await populateDatabase();
}

executeSeed()
