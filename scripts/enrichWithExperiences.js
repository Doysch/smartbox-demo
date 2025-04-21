const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// This script adds experiences to each box using box_exp.csv and language-specific experiences

const processedDir = path.join(__dirname, "../data/processed");
const mappingPath = path.join(__dirname, "../data/raw/box_exp.csv");
const experienceFiles = {
  "CH-fr": path.join(__dirname, "../data/raw/experiences/experiences_fr.csv"),
  "CH-de": path.join(__dirname, "../data/raw/experiences/experiences_de.csv"),
  "CH-it": path.join(__dirname, "../data/raw/experiences/experiences_it.csv"),
};

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

// Step 2: Load experiences for a specific language
function loadExperiences(filePath) {
  return new Promise((resolve) => {
    const data = {};
    fs.createReadStream(filePath)
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
async function enrichBoxes(langKey) {
  const boxesPath = path.join(processedDir, `${langKey}.json`);
  const outputPath = path.join(processedDir, `${langKey}.enriched.json`);

  const boxes = JSON.parse(fs.readFileSync(boxesPath));
  const mappings = await loadMappings();
  const experiences = await loadExperiences(experienceFiles[langKey]);

  const enriched = boxes.map((box) => {
    const boxId = box["PIM Code"];
    const expIds = mappings[boxId] || [];

    const photoFields = Object.keys(box).filter((k) => k.startsWith("Photo"));
    const photos = photoFields.map((k) => box[k]).filter(Boolean);
    box.photos = photos;
    photoFields.forEach((k) => delete box[k]); // remove Photo 1...10

    const boxExperiences = expIds
      .slice(0, 10)
      .map((id, i) => {
        // limit to 10 experiences
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

// Run for each locale
["CH-fr", "CH-de", "CH-it"].forEach(enrichBoxes);
