const pinToParent = (arr, node) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === node.parent) {
            if (!arr[i].children) {
                arr[i].children = [];
            }
            arr[i].children.push(node);
            return;
        } else if (arr[i].children) {
            pinToParent(arr[i].children, node);
        }
    }
};

const addNode = (tree, node, idx) => {
    if (idx === 0) {
        tree.push({
            ...node,
            parent: null,
            children: [],
        });
    } else {
        pinToParent(tree, node);
    }
    return tree;
}

export default flatTree => ({
    farms: flatTree.filter(node => node.isFarm),
    yco: flatTree.find(node => node.name === 'YCO'),
    tree: flatTree.filter(node => !node.isOffset).reduce(addNode, [])[0],
});