import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  IconButton,
} from "@mui/material";
import generateRelation from "../util/generateRelation";
import { TreeNode } from "./CourseRelationTree";
import DeleteIcon from "@mui/icons-material/Delete";
export interface EditCourseRelationProps {
  relation: string;
  setRelation: (relation: string) => unknown;
  setTreeData: (data: TreeNode[]) => unknown;
}
const CourseRelationNode = ({
  node,
  handleChange,
  handleDelete,
  index,
}: {
  node: TreeNode;
  handleChange: (node: TreeNode, index: number) => unknown;
  handleDelete: (index: number) => unknown;
  index: number;
}) => {
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
          onChange={(e) =>
            handleChange({ ...node, code: e.target.value }, index)
          }
        />
      </TableCell>
      <TableCell>
        <Checkbox
          checked={!!optional}
          onChange={() => handleChange({ ...node, optional: !optional }, index)}
        />
      </TableCell>
      <TableCell>
        <TextField
          value={parentToThisMsg}
          onChange={(e) =>
            handleChange({ ...node, parentToThisMsg: e.target.value }, index)
          }
        />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => handleDelete(index)}>
          <DeleteIcon fontSize="large" />
        </IconButton>
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
  const handleChange = useCallback(
    (node: TreeNode, index: number) => {
      setLocalTreeData((state) => {
        const cpy = [...state];
        cpy[index] = node;
        return cpy;
      });
    },
    [setLocalTreeData]
  );
  const handleDelete = useCallback(
    (index: number) => {
      setLocalTreeData((state) => state.filter((_, i) => i !== index));
    },
    [setLocalTreeData]
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
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localTreeData.map((node, i) => (
              <MDisplayNode
                key={node.id}
                node={node}
                index={i}
                handleChange={handleChange}
                handleDelete={handleDelete}
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
