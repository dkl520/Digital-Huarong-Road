// 定义一个MinHeap类，用于实现最小堆数据结构  
// 在最小堆中，优先级小的元素排在前面，所以是从小到大排序。
class MinHeap {  
  // 构造函数，初始化堆的数组为空  
  constructor() {  
    this.heap = [];  
  }  
  // 向堆中添加一个节点  
  push(node) {  
    // 将节点添加到堆数组的末尾  
    this.heap.push(node);  
    // 调用heapifyUp方法，确保堆的性质得到维护  
    this.heapifyUp();  
  }  
  
  // 从堆中移除并返回根节点（具有最小优先级的节点）  
  pop() {  
    // 如果堆为空，则返回null  
    if (this.isEmpty()) {  
      return null;  
    }  
  
    // 获取并存储根节点  
    const root = this.heap[0];  
    // 移除堆数组的最后一个节点并将其赋值给根节点  
    const lastNode = this.heap.pop();  
  
    // 如果堆不为空，则将最后一个节点移动到根节点，并调用heapifyDown方法，确保堆的性质得到维护  
    if (this.heap.length > 0) {  
      this.heap[0] = lastNode;  
      this.heapifyDown();  
    }  
  
    // 返回根节点  
    return root;  
  }  
  clear(){
    this.heap = [];  
  }
  // 从下往上调整堆，确保堆的性质得到维护  
  heapifyUp() {  
    // 初始化当前节点为堆数组的最后一个节点  
    let currentIdx = this.heap.length - 1;  
  
    // 当当前节点不是根节点时，循环执行以下操作  
    while (currentIdx > 0) {  
      // 计算当前节点的父节点索引  
      const parentIdx = Math.floor((currentIdx - 1) / 2);  
      // 如果当前节点的优先级小于其父节点的优先级，则交换它们的位置  
      if (this.heap[currentIdx].getPriority() < this.heap[parentIdx].getPriority()) {  
        [this.heap[currentIdx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[currentIdx]];  
        // 更新当前节点为父节点，继续向上调整  
        currentIdx = parentIdx;  
      } else {  
        // 如果当前节点的优先级不小于其父节点的优先级，则停止向上调整  
        break;  
      }  
    }  
  }  
  
  // 从上往下调整堆，确保堆的性质得到维护  
  heapifyDown() {  
    // 初始化当前节点为根节点  
    let currentIdx = 0;  
  
    // 无限循环，直到堆的性质得到满足  
    while (true) {  
      // 计算左孩子节点的索引  
      const leftChildIdx = 2 * currentIdx + 1;  
      // 计算右孩子节点的索引  
      const rightChildIdx = 2 * currentIdx + 2;  
      // 初始化最小孩子节点为当前节点  
      let smallestChildIdx = currentIdx;  
  
      // 如果左孩子节点存在且其优先级小于当前节点的优先级，则更新最小孩子节点为左孩子节点  
      if (leftChildIdx < this.heap.length && this.heap[leftChildIdx].getPriority() < this.heap[smallestChildIdx].getPriority()) {  
        smallestChildIdx = leftChildIdx;  
      }  
  
      // 如果右孩子节点存在且其优先级小于当前节点的优先级，则更新最小孩子节点为右孩子节点  
      if (rightChildIdx < this.heap.length && this.heap[rightChildIdx].getPriority() < this.heap[smallestChildIdx].getPriority()) {  
        smallestChildIdx = rightChildIdx;  
      }  
  
      // 如果最小孩子节点不是当前节点，则交换它们的位置，并继续向下调整  
      if (smallestChildIdx !== currentIdx) {  
        [this.heap[currentIdx], this.heap[smallestChildIdx]] = [this.heap[smallestChildIdx], this.heap[currentIdx]];  
        // 更新当前节点为最小孩子节点，继续向下调整  
        currentIdx = smallestChildIdx;  
      } else {  
        // 如果最小孩子节点是当前节点，则堆的性质已经得到满足，停止向下调整  
        break;  
      }  
    }  
  }  
  
  // 检查堆是否为空  
  isEmpty() {  
    // 如果堆数组的长度为0，则返回true，表示堆为空；否则返回false  
    return this.heap.length === 0;  
  }  
}  
  
// 导出MinHeap类，以便在其他模块中使用  
export default MinHeap;