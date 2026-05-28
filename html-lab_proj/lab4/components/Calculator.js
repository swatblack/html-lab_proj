export class Calculator {
    constructor() {
        this.operation = '';
    }

    clear() {
        this.operation = '';
        const output = document.getElementById('calcoutput');
        const outputOp = document.getElementById('calcoutputop');
        if (output) output.innerHTML = '';
        if (outputOp) outputOp.innerHTML = '';
    }

    calculate() {
        if (!this.operation) return;
        
        const hasOperand = /[*\/+-]/.test(this.operation);
        const lastChar = this.operation.charAt(this.operation.length - 1);
        
        if (hasOperand && lastChar !== ' ') {
            const result = eval(this.operation);
            const output = document.getElementById('calcoutput');
            const outputOp = document.getElementById('calcoutputop');
            
            if (output) output.innerHTML = result;
            if (outputOp) outputOp.innerHTML = this.operation;
            this.operation = '';
        }
    }

    addValue(value) {
        const mathOperands = ['*', '/', '+', '-'];
        const last = this.operation.charAt(this.operation.length - 1);
        const secondLast = this.operation.charAt(this.operation.length - 2);
        const lastIsMath = mathOperands.includes(secondLast);
        
        if (mathOperands.includes(value)) {
            if (!lastIsMath && last !== '.' && this.operation.length !== 0) {
                this.operation = this.operation + " " + value + " ";
                const output = document.getElementById('calcoutput');
                if (output) output.innerHTML = this.operation;
            }
        } else if (value === '.') {
            if (last !== '.' && !lastIsMath) {
                this.operation = this.operation + value;
                const output = document.getElementById('calcoutput');
                if (output) output.innerHTML = this.operation;
            }
        } else if (value === '0' && (this.operation.length === 0 || lastIsMath)) {
            this.operation = this.operation + '0.';
            const output = document.getElementById('calcoutput');
            if (output) output.innerHTML = this.operation;
        } else {
            this.operation = this.operation + value;
            const output = document.getElementById('calcoutput');
            if (output) output.innerHTML = this.operation;
        }
    }

    render() {
        const container = document.getElementById('calculator-placeholder');
        if (!container) return;

        container.innerHTML = `
            <div id="calculator">
                <div id="calcdisplayop"><span id="calcoutputop"></span></div>
                <div id="calcdisplay"><span id="calcoutput"></span></div>
                <input type="button" class="calcbutton" id="calcC" value="C">
                <input type="button" class="calcbuttona" value=".">
                <input type="button" class="calcbuttona" value="+">
                <input type="button" class="calcbutton" value="1">
                <input type="button" class="calcbutton" value="2">
                <input type="button" class="calcbutton" value="3">
                <input type="button" class="calcbuttona" value="-">
                <input type="button" class="calcbutton" value="4">
                <input type="button" class="calcbutton" value="5">
                <input type="button" class="calcbutton" value="6">
                <input type="button" class="calcbuttona" value="*">
                <input type="button" class="calcbutton" value="7">
                <input type="button" class="calcbutton" value="8">
                <input type="button" class="calcbutton" value="9">
                <input type="button" class="calcbuttona" value="/">
                <input type="button" class="calcbutton" id="calc0" value="0">
                <input type="button" class="calcbuttona" value="=">
            </div>
        `;

        this.attachEvents();
    }

    attachEvents() {
        const buttons = document.querySelectorAll('#calculator input');
        buttons.forEach(button => {
            if (button.id === 'calcC') {
                button.onclick = () => this.clear();
            } else if (button.value === '=') {
                button.onclick = () => this.calculate();
            } else {
                button.onclick = () => this.addValue(button.value);
            }
        });
    }
}