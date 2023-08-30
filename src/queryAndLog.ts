import pg from "pg";

let queryNumber = 0;

export default async function queryAndLog(
  client: pg.Client,
  sql: string,
  params?: (string | number)[]
) {
  queryNumber++;
  console.log(
    `SQL START qNum: ${String(queryNumber).padStart(
      5,
      "0"
    )} SQL: ${sql} params: [${params}]`
  );
  const startTime = performance.now();
  const result = await client.query(sql, params);
  const stopTime = performance.now();
  const elapsedTime = Math.round((stopTime - startTime) * 100) / 100;
  const rowCount = result.rowCount;
  console.log(
    `SQL END qNum: ${String(queryNumber).padStart(5, "0")} time: ${String(
      elapsedTime
    ).padStart(5, "0")}ms rowCount: ${rowCount} SQL: ${sql} params: [${params}]`
  );
  return result;
}
