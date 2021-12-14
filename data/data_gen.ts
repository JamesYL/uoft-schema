import { saveRaw, saveParsed, Option } from "./data_gen_scripts/cacheData";
import coursesToCsv from "./data_gen_scripts/to_csv/course";

interface GenerateOptions {
  fetchUpdatedData: boolean;
  updateCourses: boolean;
}
const generate = async ({
  fetchUpdatedData,
  updateCourses,
}: GenerateOptions) => {
  const latest = "20219"; // Update this to whatever latest term
  const codes = ["CSC", "MAT", "STA"]; // Update for more courses
  if (fetchUpdatedData)
    await Promise.all(
      codes.map(async (code) => {
        const option: Option = { code, latest };
        return saveRaw(option).then((data) => saveParsed(data, option));
      })
    );
  if (updateCourses) await coursesToCsv();
};
generate({ fetchUpdatedData: false, updateCourses: true });
