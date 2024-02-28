import * as fs from 'fs';
import csv from 'csv-parser';
import {sql} from '@vercel/postgres';

async function createTable(){
    await sql`DROP TABLE IF EXISTS Team;`
    await sql`CREATE TABLE Team ( staff_pass_id varchar(255) PRIMARY KEY, team_name varchar(255), created_at varchar(255) );`;
    console.log('Table created successfully');
}

// Function to parse CSV and insert into PostgreSQL database
async function populateDatabase() {
    const csvFilePath = './src/app/scripts/staff-id-to-team-mapping-long.csv';
    let x = 0
    const rows = []
  
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
      rows.push(`('${row.staff_pass_id}', '${row.team_name}', '${row.created_at}')`);
    })
    .on('end', async () => {
        console.log('CSV file successfully processed');
        const insertQuery = `INSERT INTO Team (staff_pass_id, team_name, created_at) VALUES ${rows.join(',')};`
        await sql.query(insertQuery);
    });
}

// Call the functions to populate the database
await createTable();
await populateDatabase();
