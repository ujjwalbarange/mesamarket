const mysql = require('mysql2/promise');

const passwords = [
  "",
  "root",
  "admin",
  "password",
  "1234",
  "123456",
  "ujjwal",
  "Mesa123",
  "mysql",
  "password123"
];

async function test() {
  for (const pw of passwords) {
    console.log(`Testing root with password: "${pw}"...`);
    try {
      const conn = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: pw
      });
      console.log(`✅ Success! The password is: "${pw}"`);
      await conn.end();
      process.exit(0);
    } catch (err) {
      console.log(`❌ Failed: ${err.message}`);
    }
  }
  console.log("❌ All common passwords failed.");
  process.exit(1);
}

test();
