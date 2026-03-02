function normalizeRfcTo13(rfc) {
  let cleanRfc = (rfc || "").trim();
  if (cleanRfc.length === 12) {
    cleanRfc = " " + cleanRfc;
  }
  return cleanRfc.padEnd(13, " ");
}

function splitIntoFields(prefix, value, length) {
  const array = (value || "").padEnd(length, " ").split("");
  return Object.fromEntries(array.map((c, i) => [`${prefix}${i + 1}`, c]));
}

function splitDateDDMMYYYY(dateString, prefix) {
  const [day = "00", month = "00", year = "0000"] = (dateString || "").split("/");

  return {
    [`${prefix}Year1`]: year[2],
    [`${prefix}Year2`]: year[3],
    [`${prefix}Month1`]: month[0],
    [`${prefix}Month2`]: month[1],
    [`${prefix}Day1`]: day[0],
    [`${prefix}Day2`]: day[1]
  };
}

function buildWorkersWithSplitFields(shared, workers) {
  return workers.map((worker) => {
    const curpFields = splitIntoFields("curp", worker.curp, 18);
    const rfcFields = splitIntoFields("rfc", normalizeRfcTo13(shared.rfc), 13);

    const startDateFields = splitDateDDMMYYYY(shared.startDate, "start");
    const endDateFields = splitDateDDMMYYYY(shared.endDate, "end");

    return {
      ...shared,

      nombre: worker.nombre,
      ocupacion: worker.ocupacion,
      puesto: worker.puesto,

      ...curpFields,
      ...rfcFields,
      ...startDateFields,
      ...endDateFields
    };
  });
}

module.exports = {
  normalizeRfcTo13,
  splitIntoFields,
  splitDateDDMMYYYY,
  buildWorkersWithSplitFields
};

