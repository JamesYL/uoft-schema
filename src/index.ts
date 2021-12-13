import { saveRaw, saveParsed, Option } from "./util/cacheData";

const latest = "20219"; // Update this to whatever latest term
const codes = ["CSC", "MAT", "STA"]; // Update for more courses

// Always save, doesn't make requests if data is already saved
codes.forEach((code) => {
  const option: Option = { code, latest };
  saveRaw(option).then((data) => saveParsed(data, option));
});
