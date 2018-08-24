const getTotal = (total, capita) => Math.floor(total / capita); 

export default (total, capita, areaWidth, areaHeight) => {
    let cols, rows, rectWidth, rectHeight;

    const N = getTotal(total, capita);
    const rectRatio =  6 / 9;
    const gutter = [2, 2];  

    function rowIterator(iterator) {
        rows = iterator;
        cols = Math.ceil(N/rows);  

        rectHeight = (areaHeight - (rows-1)*gutter[1])/rows;          
        rectWidth = rectHeight*rectRatio;

        if (cols * rectWidth + (cols - 1)*gutter[0] > areaWidth) {
            rowIterator(rows + 1);
        }
    }

    function colIterator(iterator) {
        cols = iterator;
        rows = Math.ceil(N/cols);

        rectWidth = (areaWidth - (cols - 1)*gutter[0])/cols;
        rectHeight = rectWidth/rectRatio;

        if (rows * rectHeight + (rows - 1)*gutter[1] > areaHeight) {
            colIterator(cols + 1);
        }
    }

    rowIterator(1);
    const size1 = [rectWidth, rectHeight];

    colIterator(1);
    const size2 = [rectWidth, rectHeight];

    return {
        rows,
        cols,
        width: Math.max(size1[0], size2[0]),
        height: Math.max(size1[1], size2[1])
    };
} 