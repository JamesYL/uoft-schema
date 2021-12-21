import React from "react";
import CourseRelationTree from "./components/CourseRelationTree";

const App = () => {
  const treeData = {
    code: "1",
    children: [
      {
        code: "CSC369H1",
        optional: true,
        parentToThisMsg: "first",
      },
      { code: "3" },
      { code: "4" },
      { code: "4", parentToThisMsg: "" },
      {
        code: "5",
        parentToThisMsg:
          "This course must be done with at least 60%.This course must be done with at least 60%.This course must be done with at least 60%.This course must be done with at least 60%.This course must be done with at least 60%.This course must be done with at least 60%.This course must be done with at least 60%.This course must be done with at least 60%.This course must be done with at least 60%.This course must be done with at least 60%.This course must be done with at least 60%.ourse must be done with at least 60%.This course must be done with at least 60%.This course must be done with at least 60%.ourse must be done with at least 60%.This course must be done with at least 60%.This course must be done with at least 60%.ourse must be done with at least 60%.This course must be done with at least 60%.This course must be done with at least 60%.",
      },
    ],
  };
  return (
    <div>
      <CourseRelationTree tree={treeData} width={1500} height={1000} />
    </div>
  );
};

export default App;
