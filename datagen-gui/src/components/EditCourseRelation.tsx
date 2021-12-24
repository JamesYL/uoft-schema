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
import { stratify } from "d3";
export interface EditCourseRelationProps {
  relation: string;
  setTreeData: (data: TreeNode[]) => unknown;
  setRelation: (relation: string) => unknown;
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
        <TextField
          variant="standard"
          value={parentId ?? ""}
          type="number"
          onChange={(e) =>
            handleChange({ ...node, parentId: e.target.value }, index)
          }
          style={{ width: 40 }}
        />
      </TableCell>
      <TableCell>
        <TextField
          variant="standard"
          value={code ?? ""}
          onChange={(e) =>
            handleChange({ ...node, code: e.target.value }, index)
          }
          style={{ width: 110 }}
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
          variant="standard"
          value={parentToThisMsg ?? ""}
          onChange={(e) =>
            handleChange({ ...node, parentToThisMsg: e.target.value }, index)
          }
          style={{ width: 150 }}
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
  setTreeData,
  setRelation,
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
  const handleAdd = useCallback(() => {
    setLocalTreeData((state) => {
      const ids = new Set(state.map((item) => item.id));
      let id = state.length;
      while (ids.has(`${id}`)) {
        id++;
      }
      return [...state, { id: `${id}` }];
    });
  }, [setLocalTreeData]);
  const handleSave = () => {
    try {
      stratify()(localTreeData);
      setTreeData(localTreeData);
    } catch (err) {
      alert("Invalid nodes, they don't form a tree");
    }
  };

  useEffect(() => {
    setTreeData(localTreeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: 650 }}>
      <TextField
        defaultValue={relation}
        fullWidth
        label="Course Relation"
        onChange={(e) => setRelation(e.target.value)}
      />
      <Button
        variant="outlined"
        style={{ marginBottom: 10 }}
        onClick={() => {
          const nodes = generateRelation(relation);
          setLocalTreeData(nodes);
        }}
      >
        Generate Nodes From Relation String
      </Button>
      <TableContainer component={Paper} style={{ marginBottom: 10 }}>
        <Table size="small">
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
      <Button
        variant="outlined"
        onClick={handleAdd}
        style={{ marginRight: 10 }}
      >
        Add Node
      </Button>
      <Button variant="outlined" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
};
export default EditCourseRelation;
