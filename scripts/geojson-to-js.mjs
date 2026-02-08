import fs from "fs";

const inputPath = "./data/data.geojson";
const outputPath = "./public/mapData.js";

const geojson = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const js = `
// AUTO-GENERATED FILE
// Generated ${new Date().toISOString()}

export const mapData = ${JSON.stringify(geojson, null, 2)};
`;

fs.writeFileSync(outputPath, js);
console.log(`Wrote ${outputPath}`);

