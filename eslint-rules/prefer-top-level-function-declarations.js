/**
 * Custom ESLint rule to prefer function declarations over arrow functions at the top level
 */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "prefer function declarations over arrow functions at the top level",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "code",
    schema: [],
    messages: {
      preferFunctionDeclaration: "Prefer function declarations over arrow functions at the top level",
    },
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        // Check if this is a top-level variable declaration
        // We'll check if the parent is a VariableDeclaration and that's at the top level
        let current = node.parent;
        while (current && current.type !== "Program") {
          if (current.type === "BlockStatement" || current.type === "ArrowFunctionExpression" || current.type === "FunctionDeclaration") {
            return; // Inside a block or function, not top-level
          }
          current = current.parent;
        }
        
        if (!current || current.type !== "Program") {
          return; // Not at top level
        }

        // Check if it's an arrow function assignment
        if (
          node.init &&
          node.init.type === "ArrowFunctionExpression" &&
          node.id &&
          node.id.type === "Identifier"
        ) {
          context.report({
            node,
            messageId: "preferFunctionDeclaration",
          });
        }
      },
    };
  },
};