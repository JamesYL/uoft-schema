import { TreeNode } from "../components/CourseRelationTree";

const generateRelation = (relation: string): TreeNode[] => {
  relation = relation.trim();
  let id = 1;
  const res: TreeNode[] = [];
  const splitComma = (relation: string, parent: string) => {
    const split = relation
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (split.length === 0) return;
    let currId = id;
    const node: TreeNode = {
      parentId: parent,
      id: `${id++}`,
      optional: true,
    };
    res.push(node);
    if (split.length === 1) {
      node.code = split[0];
    } else
      split.forEach((item) =>
        res.push({
          code: item,
          parentId: `${currId}`,
          id: `${id++}`,
          optional: false,
        })
      );
  };
  const splitSlash = (relation: string, parent?: string) => {
    const split = relation
      .split("/")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    if (split.length === 0) return;

    let currId = id;

    const node: TreeNode = {
      parentId: parent,
      id: `${id++}`,
    };
    res.push(node);
    if (split.length === 1) {
      if (/,/.test(split[0])) splitComma(split[0], `${currId}`);
      else node.code = split[0];
    } else split.forEach((item) => splitComma(item, `${currId}`));
  };
  const splitSemi = (relation: string) => {
    const split = relation
      .split(";")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    if (split.length === 0) return;

    const parent = id;
    const node: TreeNode = {
      id: `${id++}`,
    };
    res.push(node);
    if (split.length === 1) {
      if (/\//.test(split[0])) {
        res.pop();
        splitSlash(split[0]);
      } else if (/,/.test(split[0])) {
        split[0]
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
          .forEach((item) => {
            res.push({
              parentId: `${parent}`,
              id: `${id++}`,
              code: item,
              optional: true,
            });
          });
      } else {
        node.code = split[0];
      }
    } else {
      split.forEach((item) => {
        splitSlash(item, `${parent}`);
      });
    }
  };
  splitSemi(relation);

  return res;
};
export default generateRelation;
