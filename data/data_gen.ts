import { saveRaw, saveParsed, Option } from "./data_gen_scripts/cacheData";
import coursesToCsv from "./data_gen_scripts/to_csv/course";
import meetingToCsv from "./data_gen_scripts/to_csv/meeting";
import selectionToCsv from "./data_gen_scripts/to_csv/selection";

interface GenerateOptions {
  fetchUpdatedData: boolean;
  updateCourses: boolean;
  updateSelections: boolean;
  updateMeetings: boolean;
}
const generate = async ({
  fetchUpdatedData,
  updateCourses,
  updateSelections,
  updateMeetings,
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
  if (updateMeetings) await meetingToCsv();
};
generate({
  fetchUpdatedData: true,
  updateCourses: true,
  updateSelections: true,
  updateMeetings: true,
});
