const fs = require("fs");
const path = require("path");

function getTemplatePath() {
  return path.join(__dirname, "..", "templates", "template.docx");
}

function readTemplateBinary() {
  const templatePath = getTemplatePath();

  if (!fs.existsSync(templatePath)) {
    const error = new Error("Template file not found");
    error.statusCode = 404;
    throw error;
  }

  return fs.readFileSync(templatePath, "binary");
}

module.exports = { getTemplatePath, readTemplateBinary };

