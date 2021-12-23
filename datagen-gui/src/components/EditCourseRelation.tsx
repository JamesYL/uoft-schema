import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import generateRelation from "../util/generateRelation";
import { TreeNode, TreeNodeData } from "./CourseRelationTree";
export interface EditCourseRelationProps {
  relation: string;
  setRelation: (relation: string) => unknown;
  setTreeData: (data: TreeNodeData) => unknown;
  setCSVData: (data: string[]) => unknown;
}
const EditCourseRelation = ({
  relation,
  setRelation,
  setTreeData,
  setCSVData,
}: EditCourseRelationProps) => {
  const treeData = generateRelation(relation);
  const flattened: {
    code: string;
    optional?: boolean;
    parentToThisMsg?: string;
  }[] = [];
  const items = [treeData];
  while (items.length) {
    const { code, optional, parentToThisMsg, children } =
      items.pop() as TreeNode;
    if (code) flattened.push({ code, optional, parentToThisMsg });
    children?.forEach((item) => items.push(item));
  }
  console.log(flattened);

  return (
    <>
      <TextField
        defaultValue={relation}
        disabled
        fullWidth
        label="Course Relation"
      />
      {flattened.map(({ code, optional, parentToThisMsg }) => {
        console.log(treeData);
        return (
          <span>
            <Typography>Course Code: {code} </Typography>
            <FormControlLabel
              control={<Checkbox checked={optional} />}
              label="Optional?"
            />
          </span>
        );
      })}
      <Button variant="outlined">Save</Button>
    </>
  );
};
export default EditCourseRelation;
