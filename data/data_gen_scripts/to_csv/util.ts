import path from "path";
import fs from "fs/promises";
import { createReadStream } from "fs";
import { createObjectCsvWriter } from "csv-writer";
import csv from "csv-parser";
import { Course } from "../parseRawData";

export const getAllParsed = async (): Promise<Course[]> => {
  const dirPath = path.resolve(process.cwd(), "data", "parsed");
  const names = (await fs.readdir(dirPath)).filter((item) =>
    item.toLowerCase().endsWith(".csv")
  );
  const contents = names.map((fileName) =>
    fs.readFile(path.resolve(dirPath, fileName), "utf-8")
  );
  return (await Promise.all(contents))
    .map((item) => JSON.parse(item) as Course[])
    .flat();
};
export const saveToCsv = async <Record>(
  filename: string,
  header: string[],
  records: Record[]
) => {
  if (filename.slice(filename.length - 4) !== ".csv") {
    throw new Error("Filename must end with .csv");
  }
  const dirPath = path.resolve(process.cwd(), "data", "tmp_csv");
  const csvWriter = createObjectCsvWriter({
    path: path.resolve(dirPath, filename),
    header: header.map((item) => ({ id: item, title: item })),
  });

  return csvWriter.writeRecords(records);
};
export const readFromCsv = async <CSVType>(
  pathToCsv: string
): Promise<CSVType[]> => {
  const res: CSVType[] = [];
  createReadStream(pathToCsv)
    .pipe(csv())
    .on("data", (data) => res.push(data))
    .on("end", () => {});

  const stream = createReadStream(pathToCsv).pipe(csv());
  return new Promise<CSVType[]>((resolve, reject) => {
    stream.on("data", (data) => res.push(data));
    stream.on("end", () => resolve(res));
    stream.on("error", (err) => reject(err));
  });
};
