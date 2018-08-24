const getTotal = (total, capita) => Math.floor(total / capita); 

const rowIterator = (iterator, specs, utils) => {
    specs.rows = iterator;
    specs.cols = Math.ceil(utils.N / specs.rows);  

    specs.rectHeight = (utils.areaHeight - (specs.rows - 1) * utils.gutter[1]) / specs.rows;          
    specs.rectWidth = specs.rectHeight * utils.rectRatio;

    if (specs.cols * specs.rectWidth + (specs.cols - 1) * utils.gutter[0] > utils.areaWidth) {
        return rowIterator(specs.rows + 1, specs, utils);
    }

    return [specs.rectWidth, specs.rectHeight];
};

const colIterator = (iterator, specs, utils) => {
    specs.cols = iterator;
    specs.rows = Math.ceil(utils.N / specs.cols);

    specs.rectWidth = (utils.areaWidth - (specs.cols - 1) * utils.gutter[0]) / specs.cols;
    specs.rectHeight = specs.rectWidth / utils.rectRatio;

    if (specs.rows * specs.rectHeight + (specs.rows - 1) * utils.gutter[1] > utils.areaHeight) {
        return colIterator(specs.cols + 1, specs, utils);
    }
    
    return [specs.rectWidth, specs.rectHeight];
};

export default (total, capita, areaWidth, areaHeight) => {
    const specs = {
        cols: 0,
        rows: 0,
        rectWidth: 0,
        rectHeight: 0,
    };

    const utils = {
        areaHeight,
        areaWidth,
        N: getTotal(total, capita),
        rectRatio: 0.74,
        gutter: [0.5, 0.5],
    };

    const rowSpecs = rowIterator(1, specs, utils);
    const colSpecs = colIterator(1, specs, utils);

    return {
        rows: specs.rows,
        cols: specs.cols,
        width: Math.max(rowSpecs[0], colSpecs[0]),
        height: Math.max(rowSpecs[1], colSpecs[1])
    };
} 