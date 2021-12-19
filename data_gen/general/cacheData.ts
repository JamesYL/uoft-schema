import fs from "fs/promises";
import path from "path";
import getRawData, { CourseRawData } from "./getRawData";
import parseRawData, { Course } from "./parseRawData";

export interface Option {
  /* Search term CSC, MAT, CSC108 are all valid */
  code: string;
  /* Term timetable is getting from */
  latest: string;
}

export const saveRaw = async (option: Option): Promise<CourseRawData> => {
  const { code, latest } = option;
  const fileName = `${code}-${latest}-raw.json`;
  const fullPath = path.resolve(process.cwd(), "data", "raw", fileName);
  const res = await getRawData(code, latest);
  await fs.writeFile(fullPath, JSON.stringify(res));
  console.log(`Wrote raw data to ${fileName}`);
  return res;
};
export const saveParsed = async (
  data: CourseRawData,
  option: Option
): Promise<Course[]> => {
  const { code, latest } = option;
  const fileName = `${code}-${latest}-parsed.json`;
  const fullPath = path.resolve(process.cwd(), "data", "parsed", fileName);
  const res = await parseRawData(data);
  await fs.writeFile(fullPath, JSON.stringify(res));
  console.log(`Wrote parsed data to ${fileName}`);
  return res;
};
