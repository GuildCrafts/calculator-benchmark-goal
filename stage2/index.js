!(function(){

  var closestButton = function(node){
    while(node && node.nodeName.toLowerCase() !== 'button'){
      node = node.parentNode;
    }
    return node;
  }

  var Calculator = function(node){
    this.node = node;
    this.node.addEventListener('click', this.onClick.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    this.value = '';
    this.operation = null;
  }

  Calculator.ACTIONS = [
    'clear',
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

  Calculator.OPERATIONS = [
    '%',
    '/',
    '*',
    '-',
    '+',
  ]

  Calculator.prototype.isFocused = function(){
    return this.node.classList.contains('calculator-focused');
  };

  Calculator.prototype.focus = function(){
    var focusedCalculatorNodes = document.querySelectorAll('.calculator-focused');
    [].forEach.call(focusedCalculatorNodes, function(node){
      node.classList.remove('calculator-focused');
    })
    this.node.classList.add('calculator-focused');
    this.node.querySelector('button').focus();
  };

  Calculator.prototype.onClick = function(event){
    this.focus();
    var button = closestButton(event.target);
    if (!button) return;
    if (Calculator.ACTIONS.includes(button.name)) {
      return this.takeAction(button.name)
    }
  };

  Calculator.prototype.onKeyDown = function(event){
    if (!this.isFocused()) return
    if (event.key === "Enter") event.preventDefault()
    var action = event.key
    if (action === 'Enter') action = '='
    if (action === 'Clear') action = 'clear'
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
    console.log('ACTION:', action)

    if (action === 'clear'){
      this.setValue('')
      return
    }
    if (action === 'toggle-sign'){

      return
    }
    if (Calculator.OPERATIONS.includes(action)){
      this.operation = action
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
    this.setDisplay(this.value || 0)
  }

  Calculator.prototype.setDisplay = function(value){
    this.node.querySelector('.calculator-display').innerText = value;
  }

  var onDOMReady = function(){
    var calculatorNodes = document.querySelectorAll('.calculator');
    var calculators = [].map.call(calculatorNodes, function(node){
      return new Calculator(node)
    })

    calculators[0].focus()
    window.calculators = calculators; // DEBUG
  };

  document.addEventListener('DOMContentLoaded', onDOMReady, false);

})()
