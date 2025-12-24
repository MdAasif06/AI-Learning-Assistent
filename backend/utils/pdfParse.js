import { promises } from "dns";
import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

/**
 * Extract text from pdf file
 * @param {string} filePath -Path to pdf file
 * @returns {promise<{text:string,numPages:number}>}
 */

export const extractTextFromPDF = async (req, res, next) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    //pdf-parse expects a unit8Array,not a buffer
    const parse = new PDFParse(new Uint8Array(dataBuffer));
    const data = await parse.getText();

    return {
      text: data.text,
      numPages: data.numPages,
      info: data.info,
    };
  } catch (error) {
    console.error("pdf parsing error :", error);
    throw new Error("failed to extract text from pdf");
  }
};
