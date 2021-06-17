import * as finder from "@common/finder";
import { ModifierInvocation, FinderType, Node } from "@common/types";

export class ModifierInvocationNode extends Node {
    astNode: ModifierInvocation;

    constructor (modifierInvocation: ModifierInvocation, uri: string) {
        super(modifierInvocation, uri);
        this.astNode = modifierInvocation;
        
        if (modifierInvocation.loc) {
            this.nameLoc = {
                start: {
                    line: modifierInvocation.loc.start.line,
                    column: modifierInvocation.loc.start.column
                },
                end: {
                    line: modifierInvocation.loc.start.line,
                    column: modifierInvocation.loc.start.column + modifierInvocation.name.length
                }
            };
        }
    }

    getName(): string | undefined {
        return this.astNode.name;
    }

    accept(find: FinderType, orphanNodes: Node[], parent?: Node, expression?: Node): Node {
        this.setExpressionNode(expression);

        for (const argument of this.astNode.arguments || []) {
            find(argument, this.uri).accept(find, orphanNodes, parent);
        }

        if (parent) {
            const modifierInvocationParent = finder.findParent(this, parent);

            if (modifierInvocationParent) {
                this.addTypeNode(modifierInvocationParent);

                this.setParent(modifierInvocationParent);
                modifierInvocationParent?.addChild(this);

                return this;
            }
        }

        orphanNodes.push(this);

        return this;
    }
}
