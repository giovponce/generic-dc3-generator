const express = require("express")
const fs = require("fs")
const path = require("path")
const PizZip = require("pizzip")
const Docxtemplater = require("docxtemplater")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.post("/generate", (req, res) => {
  try {
    const { shared, workers } = req.body || {}

    if (!shared || !workers || !Array.isArray(workers) || workers.length === 0) {
      return res.status(400).send("Invalid data")
    }

    const templatePath = path.join(__dirname, "templates", "template.docx")

    if (!fs.existsSync(templatePath)) {
      return res.status(404).send("Template file not found")
    }

    const content = fs.readFileSync(templatePath, "binary")

    const zip = new PizZip(content)

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter() {
        return ""
      }
    })

    const workersWithSplitFields = workers.map((worker) => {
      const curpArray = worker.curp.padEnd(18, " ").split("")

      let cleanRfc = shared.rfc.trim()
      if (cleanRfc.length === 12) {
        cleanRfc = " " + cleanRfc
      }
      const rfcArray = cleanRfc.padEnd(13, " ").split("")

      const [startDay, startMonth, startYear] = shared.startDate.split("/")
      const [endDay, endMonth, endYear] = shared.endDate.split("/")

      return {
        ...shared,

        nombre: worker.nombre,
        ocupacion: worker.ocupacion,
        puesto: worker.puesto,

        ...Object.fromEntries(
          curpArray.map((c, i) => [`curp${i + 1}`, c])
        ),

        ...Object.fromEntries(
          rfcArray.map((c, i) => [`rfc${i + 1}`, c])
        ),

        startYear1: startYear[2],
        startYear2: startYear[3],
        startMonth1: startMonth[0],
        startMonth2: startMonth[1],
        startDay1: startDay[0],
        startDay2: startDay[1],

        endYear1: endYear[2],
        endYear2: endYear[3],
        endMonth1: endMonth[0],
        endMonth2: endMonth[1],
        endDay1: endDay[0],
        endDay2: endDay[1]
      }
    })

    doc.setData({
      workers: workersWithSplitFields
    })

    doc.render()

    const buffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE"
    })

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=DC3.docx"
    )

    res.send(buffer)

  } catch (error) {
    console.error("Generation error:", error)
    res.status(500).send("Error generating document")
  }
})

app.use(express.static(path.join(__dirname, "../dist")))

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"))
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})