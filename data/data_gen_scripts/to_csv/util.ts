import path from "path";
import fs from "fs/promises";
import { Course } from "../parseRawData";

const getAllParsed = async (): Promise<Course[]> => {
  const dirPath = path.resolve(process.cwd(), "data", "parsed");
  const names = await fs.readdir(dirPath);
  const contents = names.map((fileName) =>
    fs.readFile(path.resolve(dirPath, fileName), "utf-8")
  );
  return (await Promise.all(contents))
    .map((item) => JSON.parse(item) as Course[])
    .flat();
};
