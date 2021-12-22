import CourseRelationTree from "./components/CourseRelationTree";
// import generateRelation from "./util/generateRelation";

const App = () => {
  /*   const prereq =
    "CSCB09H3/ ESC190H1/ ECE244H1/(MAT157Y1 with a minimum mark of 67)/MAT235Y1/MAT237Y1/MAT257Y1/ MAT291H1/ MAT292H1\r\n"; */
  const data = {
    code: "",
    children: [
      {
        code: "",
        optional: true,
        children: [
          {
            code: "CSCB09H3",
            optional: false,
            children: [
              {
                code: "CSCB09H3",
                optional: true,
              },
            ],
          },
          {
            code: " ESC190H1",
            optional: false,
            children: [
              {
                code: "CSCB09H3",
                optional: true,
              },
            ],
          },
          {
            code: " ECE244H1",
            optional: false,
            children: [
              {
                code: "CSCB09H3",
                optional: true,
              },
              {
                code: "CSCB09H3",
                optional: true,
              },
              {
                code: "CSCB09H3",
                optional: true,
              },
            ],
          },
          {
            code: "(MAT157Y1 with a minimum mark of 67)",
            optional: false,
          },
          {
            code: "MAT235Y1",
            optional: false,
          },
          {
            code: "MAT237Y1",
            optional: false,
          },
          {
            code: "MAT257Y1",
            optional: false,
          },
          {
            code: " MAT291H1",
            optional: false,
          },
          {
            code: " MAT292H1",
            optional: false,
            parentToThisMsg:
              "This is an example long message. This is an example long message. This is an example long message. This is an example long message. This is an example long message. ",
          },
        ],
      },
    ],
  };
  return (
    <div>
      <CourseRelationTree treeData={data} width={1000} height={1000} />
    </div>
  );
};

export default App;
