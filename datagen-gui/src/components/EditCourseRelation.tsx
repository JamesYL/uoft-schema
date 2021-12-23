import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Paper,
  Table,
  TableContainer,
  TextField,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import generateRelation from "../util/generateRelation";
import { TreeNode } from "./CourseRelationTree";
export interface EditCourseRelationProps {
  relation: string;
  setRelation: (relation: string) => unknown;
  setTreeData: (data: TreeNode[]) => unknown;
}
const CourseRelationNode = ({
  node,
  index,
  setNodes,
}: {
  node: TreeNode;
  index: number;
  setNodes: React.Dispatch<React.SetStateAction<TreeNode[]>>;
}) => {
  const handleChange = (node: TreeNode) => {
    setNodes((nodes) => {
      const allCpy = [...nodes];
      allCpy[index] = node;
      return allCpy;
    });
  };
  const { id, parentId, optional, parentToThisMsg, code } = node;
  return (
    <TableRow>
      <TableCell>
        <Typography>{id}</Typography>
      </TableCell>
      <TableCell>
        <TextField value={parentId} type="number" />
      </TableCell>
      <TableCell>
        <TextField
          value={code}
          onChange={(e) => handleChange({ ...node, code: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          checked={optional}
          // onChange={(e) => onChange({ ...node, optional: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <TextField
          value={parentToThisMsg}
          onChange={(e) =>
            handleChange({ ...node, parentToThisMsg: e.target.value })
          }
        />
      </TableCell>
    </TableRow>
  );
};
const MDisplayNode = React.memo(CourseRelationNode);

const EditCourseRelation = ({
  relation,
  setRelation,
  setTreeData,
}: EditCourseRelationProps) => {
  const [localTreeData, setLocalTreeData] = useState<TreeNode[]>(
    useMemo(() => generateRelation(relation), [relation])
  );

  useEffect(() => {
    setTreeData(localTreeData);
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Parent ID</TableCell>
              <TableCell>Course Code</TableCell>
              <TableCell>Optional?</TableCell>
              <TableCell>Extra Info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localTreeData.map((node, i) => (
              <MDisplayNode
                key={node.id}
                node={node}
                index={i}
                setNodes={setLocalTreeData}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="outlined">Save</Button>
    </>
  );
};
export default EditCourseRelation;
