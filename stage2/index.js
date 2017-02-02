!(function(){

  var closestButton = function(node){
    while(node && node.nodeName.toLowerCase() !== 'button'){
      node = node.parentNode;
    }
    return node;
  }

  var Calculator = function(node){
    this.node = node;
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.initialize();
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

  Calculator.prototype.initialize = function(){
    this.node.addEventListener('click', this.onClick);
    this.node.addEventListener('keydown', this.onKeyDown);
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
    if (event.key === "Enter") event.preventDefault()
    var action = event.key
    if (!Calculator.ACTIONS.includes(action)){
      if (action === 'Enter') action = '='
    }
    if (action) {
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
  };

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
