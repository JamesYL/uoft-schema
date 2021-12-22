import CourseRelationTree from "./components/CourseRelationTree";
import generateRelation from "./util/generateRelation";

const App = () => {
  const prereq =
    "CSCB09H3/ ESC190H1/ ECE244H1/(MAT157Y1 with a minimum mark of 67)/MAT235Y1/MAT237Y1/MAT257Y1/ MAT291H1/ MAT292H1\r\n";
  return (
    <div>
      <CourseRelationTree
        treeData={generateRelation(prereq)}
        width={1000}
        height={1000}
      />
    </div>
  );
};

export default App;
