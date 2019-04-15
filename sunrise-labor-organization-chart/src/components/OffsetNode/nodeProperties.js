export default {
    'Twin H Farms': {
        linkPath: parent => {
            const node = {
                x: parent.x * 0.6, 
                y: parent.y + (parent.y * 0.2),
            };
            return `M${parent.x},${parent.y}C${parent.x},${(node.y + parent.y) / 2} ${node.x},${(node.y + parent.y) / 2} ${node.x},${node.y}`;
        },
        nodeTransform: parent => {
            const node = {
                x: parent.x * 0.6, 
                y: parent.y + (parent.y * 0.2),
            };
            return `translate(${node.x},${node.y})`;
        },
        positionClass: 'node--leaf',
    },
    'Farm One': {
        linkPath: parent => {
            const node = {
                x: parent.x * 0.2,
                y: parent.y + (parent.y * 0.2),
            };
            return `M${parent.x},${parent.y}C${parent.x},${(node.y + parent.y) / 2} ${node.x},${(node.y + parent.y) / 2} ${node.x},${node.y}`;
        },
        nodeTransform: parent => {
            const node = {
                x: parent.x * 0.2,
                y: parent.y + (parent.y * 0.2),
            };
            return `translate(${node.x},${node.y})`;
        },
        positionClass: 'node--internal',
    },
    'Turek Farms': {
        linkPath: parent => {
            const node = {
                x: parent.x + (parent.x - (parent.x * 0.6)),
                y: parent.y + (parent.y * 0.2),
            };
            return `M${parent.x},${parent.y}C${parent.x},${(node.y + parent.y) / 2} ${node.x},${(node.y + parent.y) / 2} ${node.x},${node.y}`;
        },
        nodeTransform: parent => {
            const node = {
                x: parent.x + (parent.x - (parent.x * 0.6)),
                y: parent.y + (parent.y * 0.2),
            };
            return `translate(${node.x},${node.y})`;
        },
        positionClass: 'node--leaf',
    },
    'Farm Four': {
        linkPath: parent => {
            const node = {
                x: parent.x + (parent.x - (parent.x * 0.2)),
                y: parent.y + (parent.y * 0.2),
            };
            return `M${parent.x},${parent.y}C${parent.x},${(node.y + parent.y) / 2} ${node.x},${(node.y + parent.y) / 2} ${node.x},${node.y}`;
        },
        nodeTransform: parent => {
            const node = {
                x: parent.x + (parent.x - (parent.x * 0.2)),
                y: parent.y + (parent.y * 0.2),
            };
            return `translate(${node.x},${node.y})`;
        },
        positionClass: 'node--internal',
    },
    'YCO': {
        linkPath: parent => {
            const node = {
                x: parent.x * 0.6,
                y: parent.y + (parent.y * 0.1),
            };
            return `M${parent.x},${parent.y}C${parent.x},${(node.y + parent.y) / 2} ${node.x},${(node.y + parent.y) / 2} ${node.x},${node.y}`;
        },
        nodeTransform: parent => {
            const node = {
                x: parent.x * 0.6,
                y: parent.y + (parent.y * 0.1),
            };
            return `translate(${node.x},${node.y})`;
        },
        positionClass: 'node--leaf',
    },
}