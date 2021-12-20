import React from "react";
import CourseRelationTree from "./components/CourseRelationTree";

const App = () => {
  const treeData = {
    code: "1",
    children: [
      { code: "CSC369H1", optional: true },
      { code: "3" },
      { code: "4" },
      { code: "4" },
      {
        code: "5",
        parentToThisMsg:
          "parent messagemessagemessagemes sagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessagemessag emessagemessa gemessagemessagemessagemessagemessa gemessagemessagemessagem essagemessagemessage",
      },
    ],
  };
  return (
    <div>
      <CourseRelationTree tree={treeData} />
    </div>
  );
};

export default App;
