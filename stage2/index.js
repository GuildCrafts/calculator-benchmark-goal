!(function(){

  var closestButton = function(node){
    while(node && node.nodeName.toLowerCase() !== 'button'){
      node = node.parentNode;
    }
    return node;
  }

  var Calculator = function(node){
    this.node = node;
    this.displayNode = this.node.querySelector('.calculator-display');
    this.defaultDisplayFontSize = this.getDisplayFontSize()

    this.node.addEventListener('click', this.onClick.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    this.value = '';
    this.stagedValue = null;
    this.operation = null;
  }

  Calculator.ACTIONS = [
    'clear',
    'delete',
    'toggle-sign',
    '%',
    '/',
    '*',
    '-',
    '+',
    '=',
    '.',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
  ]

  Calculator.OPERATIONS = {
    '%': function(a,b){ return a / b; },
    '/': function(a,b){ return a / b; },
    '*': function(a,b){ return a * b; },
    '-': function(a,b){ return a - b; },
    '+': function(a,b){ return a + b; },
  }

  Calculator.prototype.onClick = function(event){
    var button = closestButton(event.target);
    if (!button) return;
    if (Calculator.ACTIONS.includes(button.name)) {
      return this.takeAction(button.name)
    }
  };

  Calculator.prototype.onKeyDown = function(event){
    if (event.key === "Enter") event.preventDefault()
    var action = event.key
    if (action === 'Enter') action = '='
    if (action === 'Clear') action = 'clear'
    if (action === "Backspace") action = 'delete'
    if (Calculator.ACTIONS.includes(action)){
      this.simulateClick(action)
      this.takeAction(action)
    }
  };

  Calculator.prototype.simulateClick = function(action){
    var button = this.node.querySelector('*[name="'+action+'"]')
    if (!button) return
    button.classList.add('calculator-button-active')
    setTimeout(function(){
      button.classList.remove('calculator-button-active')
    }, 200)
  }

  Calculator.prototype.takeAction = function(action){
    if (action === 'clear'){
      this.stagedValue = null;
      this.setValue('')
      return
    }

    if (action === 'toggle-sign'){
      this.setValue(Number(this.value) * -1)
      return
    }

    if (action === 'delete'){
      this.setValue(this.value.slice(0,-1))
      return
    }

    if (Calculator.OPERATIONS[action]){
      this.stagedValue = Number(this.value)
      this.setValue('')
      this.operation = action
      return
    }

    if (action === '='){
      if (this.operation){
        this.executeOperation()
      }else{
        this.setValue(Number(this.value))
      }
      return
    }

    if (action === '.'){
      if (this.value.toString().includes('.')) return
      this.setValue(this.value+'.')
      return
    }

    if (action === '0'){
      if (this.value.length === 0 || this.value.startsWith(0)) return
      this.setValue(this.value+'0')
      return
    }

    // if its a number setting action
    if (action.length === 1 && '123456789'.includes(action)){
      this.setValue(this.value+''+action)
      return
    }
    throw new Error('unknown action "'+action+'"')
  };

  Calculator.prototype.setValue = function(value){
    this.value = value+''
    this.setDisplay()
  }

  Calculator.prototype.executeOperation = function(value){
    var value = this.value ? Number(this.value) : this.stagedValue
    value = Calculator.OPERATIONS[this.operation](this.stagedValue, value)
    this.stagedValue = null
    this.setValue(value)
  }

  Calculator.prototype.setDisplay = function(){
    var value = this.value || this.stagedValue || 0;
    this.node.querySelector('.calculator-display > span').innerText = value;
    this.resizeDisplayFont()
  }

  Calculator.prototype.getDisplayFontSize = function(){
    return parseInt(getComputedStyle(this.displayNode)["font-size"],10);
  }

  Calculator.prototype.resizeDisplayFont = function(){
    clearTimeout(this.resizeDisplayFontTimeout)
    var displayTextNode = this.node.querySelector('.calculator-display > span');
    var fontSize = parseInt(getComputedStyle(this.displayNode)["font-size"],10)
    var delta = displayTextNode.offsetWidth - this.displayNode.offsetWidth

    console.info('delta', delta)

    if (delta > 0){
      this.displayNode.style.fontSize = (fontSize-1)+'px'
      console.log('display font size DOWN -> '+(fontSize-1)+'px')
      this.resizeDisplayFontTimeout = setTimeout(this.resizeDisplayFont.bind(this))
      return
    }
    if (fontSize < this.defaultDisplayFontSize && delta < -15){
      this.displayNode.style.fontSize = (fontSize+1)+'px'
      console.log('display font size UP -> '+(fontSize+1)+'px')
      this.resizeDisplayFontTimeout = setTimeout(this.resizeDisplayFont.bind(this))
      return
    }
  }

  var onDOMReady = function(){
    var calculator = new Calculator(document.querySelector('.calculator'))
    window.calculator = calculator; // DEBUG
  };

  document.addEventListener('DOMContentLoaded', onDOMReady, false);

})()
