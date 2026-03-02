const express = require("express");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const cors = require("cors");

const { validatePayload } = require("./utils/validatePayload.cjs");
const { readTemplateBinary } = require("./utils/template.cjs");
const { buildWorkersWithSplitFields } = require("./utils/mapWorkerData.cjs");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate", (req, res) => {
  try {
    const { valid, message, shared, workers } = validatePayload(req.body);
    if (!valid) {
      return res.status(400).send(message || "Invalid data");
    }

    const content = readTemplateBinary();

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter() {
        return "";
      }
    });

    const workersWithSplitFields = buildWorkersWithSplitFields(shared, workers);

    doc.setData({
      workers: workersWithSplitFields
    });

    doc.render();

    const buffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE"
    });

    res.setHeader("Content-Disposition", "attachment; filename=DC3.docx");

    res.send(buffer);
  } catch (error) {
    if (error && error.statusCode === 404) {
      return res.status(404).send(error.message || "Template file not found");
    }

    console.error("Generation error:", error);
    res.status(500).send("Error generating document");
  }
});

app.use(express.static(path.join(__dirname, "../dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
