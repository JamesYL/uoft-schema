import React, { useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import generateRelation from "../util/generateRelation";
import { TreeNode } from "./CourseRelationTree";
export interface EditCourseRelationProps {
  relation: string;
  setRelation: (relation: string) => unknown;
  setTreeData: (data: TreeNode[]) => unknown;
}
const EditCourseRelation = ({
  relation,
  setRelation,
  setTreeData,
}: EditCourseRelationProps) => {
  const treeData = generateRelation(relation);
  useEffect(() => {
    setTreeData(treeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <TextField
        defaultValue={relation}
        disabled
        fullWidth
        label="Course Relation"
      />
      {treeData.map(({ code, optional, parentToThisMsg }) => {
        return (
          <span>
            <Typography>Course Code: {code} </Typography>
            <FormControlLabel
              control={<Checkbox checked={optional} />}
              label="Optional?"
            />
            <TextField value={parentToThisMsg} />
          </span>
        );
      })}
      <Button
        variant="outlined"
        onClick={() => {
          setTreeData(treeData);
        }}
      >
        Save
      </Button>
    </>
  );
};
export default EditCourseRelation;
