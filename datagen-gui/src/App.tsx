import React, { useState } from "react";
import CourseRelationTree, { TreeNode } from "./components/CourseRelationTree";
import EditCourseRelation from "./components/EditCourseRelation";

const App = () => {
  const [relation, setRelation] = useState(
    "CSCB09H3/(MAT157Y1 with a minimum mark of 67)/MAT235Y1;MAT123/MAT237/(MAT102, MAT202)"
  );
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  return (
    <div>
      <EditCourseRelation
        relation={relation}
        setRelation={setRelation}
        setTreeData={setTreeData}
      />
      <CourseRelationTree treeData={treeData} />
    </div>
  );
};

export default App;
