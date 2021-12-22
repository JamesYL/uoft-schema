import { TreeNodeData } from "../components/CourseRelationTree";

const generateRelation = (relation: string): TreeNodeData => {
  relation = relation.trim();
  const children = relation.split(/;/);
  return {
    code: "",
    children: children.map((item) => {
      const optionalChildren = item.split("/");

      return {
        code: optionalChildren.length === 1 ? optionalChildren[0] : "",
        optional: true,
        children:
          optionalChildren.length > 1
            ? optionalChildren.map((item) => ({
                code: item,
                optional: false,
              }))
            : [],
      };
    }),
  } as TreeNodeData;
};
export default generateRelation;
