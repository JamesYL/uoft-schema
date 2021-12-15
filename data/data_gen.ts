import { saveRaw, saveParsed, Option } from "./data_gen_scripts/cacheData";
import coursesToCsv from "./data_gen_scripts/to_csv/course";
import selectionToCsv from "./data_gen_scripts/to_csv/selection";

interface GenerateOptions {
  fetchUpdatedData: boolean;
  updateCourses: boolean;
  updateSelections: boolean;
}
const generate = async ({
  fetchUpdatedData,
  updateCourses,
  updateSelections,
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
  if (updateSelections) await selectionToCsv();
};
generate({
  fetchUpdatedData: false,
  updateCourses: true,
  updateSelections: true,
});
