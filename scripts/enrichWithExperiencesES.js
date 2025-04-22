const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// This script adds experiences to each Spanish box using box_exp.csv and experiences_es.csv

const processedDir = path.join(__dirname, "../data/processed");
const mappingPath = path.join(__dirname, "../data/raw/box_exp.csv");
const experiencesPath = path.join(__dirname, "../data/raw/experiences/experiences_es.csv");

// Step 1: Load box to experience mappings
function loadMappings() {
  return new Promise((resolve) => {
    const map = {};
    fs.createReadStream(mappingPath)
      .pipe(csv())
      .on("data", (row) => {
        const boxId = row.BoxId;
        const expId = row.ExperienceId;
        if (!map[boxId]) map[boxId] = [];
        map[boxId].push(expId);
      })
      .on("end", () => {
        resolve(map);
      });
  });
}

// Step 2: Load Spanish experiences
function loadExperiences() {
  return new Promise((resolve) => {
    const data = {};
    fs.createReadStream(experiencesPath)
      .pipe(csv())
      .on("data", (row) => {
        data[row.experience_id] = row;
      })
      .on("end", () => {
        resolve(data);
      });
  });
}

// Step 3: Add experiences to each box using mappings
async function enrichBoxesES() {
  const langKey = "ES-es";
  const boxesPath = path.join(processedDir, `${langKey}.json`);
  const outputPath = path.join(processedDir, `${langKey}.enriched.json`);

  const boxes = JSON.parse(fs.readFileSync(boxesPath));
  const mappings = await loadMappings();
  const experiences = await loadExperiences();

  const enriched = boxes.map((box) => {
    const boxId = box["PIM Code"];
    const expIds = mappings[boxId] || [];

    const photoFields = Object.keys(box).filter((k) => k.startsWith("Photo"));
    const photos = photoFields.map((k) => box[k]).filter(Boolean);
    box.photos = photos;
    photoFields.forEach((k) => delete box[k]);

    const boxExperiences = expIds
      .slice(0, 10)
      .map((id, i) => {
        const exp = experiences[id];
        if (!exp) return null;
        return {
          ...exp,
          image_url: photos[i % photos.length] || null,
        };
      })
      .filter(Boolean);

    return {
      ...box,
      experiences: boxExperiences,
    };
  });

  fs.writeFileSync(outputPath, JSON.stringify(enriched, null, 2));
  console.log(`Wrote enriched file: ${outputPath}`);
}

enrichBoxesES();