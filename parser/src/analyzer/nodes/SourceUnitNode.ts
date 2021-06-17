import * as cache from "@common/cache";
import * as finder from "@common/finder";
import {
    SourceUnit,
    FinderType,
    Node,
    SourceUnitNode as AbstractSourceUnitNode
} from "@common/types";

export class SourceUnitNode extends AbstractSourceUnitNode {
    astNode: SourceUnit;

    constructor (sourceUnit: SourceUnit, uri: string) {
        super(sourceUnit, uri);
        this.astNode = sourceUnit;
    }

    getDefinitionNode(): Node | undefined {
        return undefined;
    }

    accept(find: FinderType, orphanNodes: Node[], parent?: Node, expression?: Node): Node {
        this.setExpressionNode(expression);

        finder.setRoot(this);

        const documentAnalyzer = cache.getDocumentAnalyzer(this.uri);
        if (documentAnalyzer?.analyzerTree && documentAnalyzer.analyzerTree instanceof SourceUnitNode) {
            for (const oldSource of documentAnalyzer.analyzerTree.getExportNodes()) {
                if (oldSource.isAlive) {
                    this.addExportNode(oldSource);
                }
            }
        }

        if (documentAnalyzer) {
            documentAnalyzer.analyzerTree = this;
        }

        for (const child of this.astNode.children) {
            find(child, this.uri).accept(find, orphanNodes, this);
        }

        return this;
    }
}
