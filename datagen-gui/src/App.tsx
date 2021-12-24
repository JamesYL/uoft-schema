import React, { useState } from "react";
import CourseRelationTree, { TreeNode } from "./components/CourseRelationTree";
import EditCourseRelation from "./components/EditCourseRelation";

const App = () => {
  const [relation, setRelation] = useState(
    "CSCB09H3/MAT157Y1/MAT235Y1;MAT123/MAT237/(MAT102, MAT202)"
  );
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  return (
    <div style={{ display: "flex", overflow: "visible" }}>
      <div style={{ marginRight: 10 }}>
        <CourseRelationTree treeData={treeData} />
      </div>
      <EditCourseRelation
        relation={relation}
        setTreeData={setTreeData}
        setRelation={setRelation}
      />
    </div>
  );
};

export default App;
