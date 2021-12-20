import React from "react";
import CourseRelationTree from "./components/CourseRelationTree";

const App = () => {
  const treeData = {
    code: "1",
    children: [{ code: "2" }, { code: "3" }, { code: "4" }],
  };
  return (
    <div>
      <CourseRelationTree tree={treeData} />
    </div>
  );
};

export default App;
