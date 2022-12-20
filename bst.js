class Node {
    constructor(data){
        this.data = data,
        this.left = null,
        this.right = null
    }
}

class Tree {
    constructor(array) {
        this.root = buildTree(enhanceArray(array));
    }
    prettyPrint (node = this.root, prefix = '', isLeft = true) {
        if (node.right !== null) {
            this.prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
        if (node.left !== null) {
            this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
        }
    }

    find(value, node = this.root) {
        if (node===null || value===node.data){
            return node || console.error("value not found");
        }
        if (value < node.data){
            return this.find(value, node.left);
        } else {
            return this.find(value, node.right);
        }
    }

    insert(value, node = this.root){
        if (node===null){
            return node = new Node(value);
        }
        if (value < node.data){
            node.left=this.insert(value, node.left);
        } else if (value > node.data){
            node.right = this.insert(value, node.right);
        }
        return node;
    }

    delete(value, node = this.root){
        if ((node.left===null || node.right===null) && node.data===value){
            return node.left || node.right;
        } else if (node.left!==null && node.right!==null && node.data===value){
            let closestSuccessor=node.right;
            while (closestSuccessor.left!==null){
                closestSuccessor=closestSuccessor.left;
            }
            let temp=closestSuccessor.data
            this.delete(closestSuccessor.data,node);
            node.data=temp;
            return node;
        }
        if (value < node.data){
            node.left=this.delete(value,node.left);
        } else if (value > node.data){
            node.right=this.delete(value, node.right);
        }
        return node;
    }

    levelOrder(fn, node=this.root){
        if (node===null) return;
        let queue=[];
        queue.push(node);
        let noFnArray=[]
        while(queue.length!=0){
            const current = queue[0];
            if (!fn){
                noFnArray.push(current.data);
            } else  {
                fn(current);
            }
            if (current.left!==null) queue.push(current.left);
            if (current.right!==null) queue.push(current.right);
            queue.shift();;
        }
        if (noFnArray.length!=0){
            return noFnArray;
        }
    }

    inOrder(fn, node=this.root){
        if (!fn){
            if (node===null) return [];
            let left=this.inOrder(null, node.left);
            let center=[node.data];
            let right=this.inOrder(null, node.right);
            return left.concat(center,right);
        } else {
            if (node===null) return;
            this.inOrder(fn, node.left);
            fn(node);
            this.inOrder(fn, node.right);
        }
    }

    preOrder(fn, node=this.root){
        if (!fn){
            if (node===null) return [];
            let center=[node.data];
            let left=this.preOrder(null, node.left);
            let right=this.preOrder(null, node.right);
            return center.concat(left,right);
        } else {
            if (node===null) return;
            fn(node);
            this.preOrder(fn, node.left);
            this.preOrder(fn, node.right);
        }
    }

    postOrder(fn, node=this.root){
        if (!fn){
            if (node===null) return [];
            let left=this.postOrder(null, node.left);
            let right=this.postOrder(null, node.right);
            let center=[node.data];
            return left.concat(right, center);
        } else {
            if (node===null) return;
            this.postOrder(fn, node.left);
            this.postOrder(fn, node.right);
            fn(node);
        }
    }
    
    heightCounter(node){
        if (node===null) return -1;
        let left;
        let right;
        if (node.left!==null && node.right!==null){
            left= 1 + this.heightCounter(node.left);
            right= 1 + this.heightCounter(node.right);
        } else if (node.left!==null){
            return 1 + this.heightCounter(node.left);
        } else if (node.right!==null){
            return 1 + this.heightCounter(node.right);
        } else {
            return 0;
        }
        return (left>=right) ? left : right;
    }

    height(value){
        return this.heightCounter(this.find(value));
    }

    depth(value, node = this.root){
        if (value===node.data){
            return 0;
        }
        if (value < node.data){
            return 1 + this.depth(value, node.left);
        } else {
            return 1 + this.depth(value, node.right);
        }
    }

    isBalanced(){
        const nodes=this.levelOrder();
        for (let i=0; i<nodes.length; i++){
            const leftSubtreeHeight = this.heightCounter(this.find(nodes[i]).left) + 1;
            const rightSubtreeHeight = this.heightCounter(this.find(nodes[i]).right) + 1;
            if (Math.abs(leftSubtreeHeight - rightSubtreeHeight)>1){
                return false;
            }
        }
        return true;
    }

    reBalance(){
        const nodes=this.levelOrder();
        this.root = buildTree(enhanceArray(nodes));
    }
}

function buildTree(array){
    if (array.length==0){
        return null;
    }
    const mid = Number.parseInt((array.length-1)/2);
    let root = new Node(array[mid]);
    root.left = buildTree(array.slice(0,mid));
    root.right = buildTree(array.slice(mid+1));
    return root;
}

function enhanceArray(array){
    function removeDuplicates(array){
        let newArray=[];
        for (let i=0; i<array.length ; i++){
            if (!newArray.includes(array[i])){
                newArray.push(array[i]);
            };
        };
        return newArray;
    };
    function mergeSort(array){
        if (array.length<=1){
            return array
        }
        let mergedArray=[]
        let left = mergeSort(array.slice(0,array.length/2));
        let right = mergeSort(array.slice(array.length/2));
        while (left.length!=0 && right.length!=0){
            if (left[0]<=right[0]){
                const element = left.shift();
                mergedArray.push(element);
            } else {
                const element = right.shift();
                mergedArray.push(element);
            }
        }
        mergedArray.push(...left);
        mergedArray.push(...right);
        return mergedArray;
    }

    return mergeSort(removeDuplicates(array));
}

let testTree = new Tree([1, 7, 4, 23, 8, 9, 4, 19, 44, 3, 5, 7, 2, 9, 67, 6345, 324]);
testTree.prettyPrint();
console.log(testTree.isBalanced());
console.log(testTree.levelOrder());
console.log(testTree.inOrder());
console.log(testTree.preOrder());
console.log(testTree.postOrder());

testTree.insert(150);
testTree.insert(1345);
testTree.insert(280);
testTree.insert(117);
testTree.insert(620);
testTree.prettyPrint();
console.log(testTree.isBalanced());

testTree.reBalance();
testTree.prettyPrint();
console.log(testTree.isBalanced());
console.log(testTree.levelOrder());
console.log(testTree.inOrder());
console.log(testTree.preOrder());
console.log(testTree.postOrder());