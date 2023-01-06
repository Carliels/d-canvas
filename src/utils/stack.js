export default function Stack() {
    // 栈元素
    this.items = [];
    //1.入栈
    Stack.prototype.push = (element) => {
        this.items.push(element);
    }
    // 2.pop删除栈顶元素,并返回该元素
    Stack.prototype.pop = () => {
        return this.items.pop(); //pop方法删除最后一个元素,并返回删除的该值
    }
    // 3.取出栈顶元素
    Stack.prototype.peek = () => {
        return this.items[this.items.length - 1]
    }
    // 4.判断栈是否为空
    Stack.prototype.isEmpty = () => {
        return this.items.length === 0
    }
    // 5.获取栈的个数
    Stack.prototype.size = () => {
        return this.items.length;
    }
    // 6.输出栈数据,希望这种形式: 20 10 100
    Stack.prototype.toString = () => {
        let Str = ''
        for (let i of this.items) {
        Str += i.version + ' ';
        }
        return Str
    }
}