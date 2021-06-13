// VARIABLES
var menu = document.getElementById('menu');
var converterType = document.querySelector('.converter-type');
var inputType = document.getElementById('input-type');
var inputValue = document.getElementById('input-value');
var convertedList = document.getElementById('converted');

// weight units
var weight = {
  'grams': 1,
  'kilograms': 0.001,
  'milligrams': 1000,
  'pounds': 0.00220462,
  'ounces': 0.035274,
  'tonne': 1e-6,
  'us-ton': 1.1023e-6,
  'stone': 0.000157473
};

// length units
var length = {
  'meters': 1,
  'kilometres': 0.001,
  'milimetres': 1000,
  'miles': 0.000621371,
  'yards': 1.09361,
  'feet': 3.28084,
  'inches': 39.3701,
  'nautical-mile': 0.000539957
};

// time untis
var time = {
  'seconds': 1,
  'milliseconds': 1000,
  'minutes': 1/60,
  'hours': 1/3600,
  'days': 1/86400,
  'weeks': 1/604800,
  'months': 1/2.628e+6,
  'years': 1/3.154e+7,
  'decades': 1/3.154e+8,
  'century': 1/3.154e+9
};

// all units
var units = {
  'weight': weight,
  'length': length,
  'time': time
};

var prevConverter; // selected converter on load
var prevInputType; // selected input type on load


// EVENTS
window.addEventListener('DOMContentLoaded', () => {
  prevConverter = document.querySelector('.converter.selected');
  
  // fill UI for default converter
  fillUI(units[prevConverter.id]).then(updated => {
    inputValue.focus();
  });
  
  // hide output for selected input type
  hideOutputForSelectedInput();
  prevInputType = inputType.value;
});

inputValue.addEventListener('input', () => {
  let input = inputValue.value;
  convertIt(input);
  
  // show output ONLY if a number is provided
  manageOutput();
});

inputType.addEventListener('change', () => {
  var input = inputValue.value;
  convertIt(input);

  // show output for previously selected input type
  prevOutputClass = '.output.output--' + prevInputType;
  document.querySelector(prevOutputClass).style.display = '';
  
  // hide output for selected input type
  hideOutputForSelectedInput();

  // update previous input type
  prevInputType = inputType.value;
});

converterType.querySelectorAll('.converter').forEach((converter) => {
  converter.addEventListener('click', function() {
    // hide menu
    converterType.classList.remove('show');
    
    if(prevConverter == this) {
      inputValue.focus();
      return;
    }
    
    // change active converter class
    prevConverter.classList.remove('selected');
    this.classList.add('selected');
    
    // empty select box & output divs
    inputType.textContent   = '';
    convertedList.textContent   = '';
    
    // fill UI for newly selected converter
    fillUI(units[this.id]).then(updated => {
      inputValue.focus();
      let input = inputValue.value;
      convertIt(input);   
    });
    
    hideOutputForSelectedInput();
    manageOutput();

    prevInputType = inputType.value;
    prevConverter = this;
  });
});

menu.addEventListener('click', () => {
  if(converterType.classList.contains('show')) {
    converterType.classList.remove('show');
  } else {
    converterType.classList.add('show');
  }
});

window.addEventListener('click', (e) => {
  if(!converterType.classList.contains('show')) return;
  if(menu.contains(e.target) || converterType.contains(e.target)) return;
  converterType.classList.remove('show');
});

inputValue.addEventListener('focus', function() {
  this.parentElement.classList.add('focus');
});

inputValue.addEventListener('focusout', function() {
  this.parentElement.classList.remove('focus');
});


// FUNCTIONS
function manageOutput() {
  let conversionResults = document.getElementById('converted');
  
  if(inputValue.value == null || inputValue.value == '') {
    conversionResults.style.display = 'none';
  } else {
    conversionResults.style.display = 'block';
  }
}

function hideOutputForSelectedInput() {
  let currInputType = inputType.value;
  outputClass = '.output.output--' + currInputType;
  document.querySelector(outputClass).style.display = 'none';
}

function convertIt(data) {
  let currInputType = inputType.value;
  let currConverter = units[prevConverter.id];
  let factor1 = currConverter[currInputType];
  
  for(var key in currConverter) {
    if(key == currInputType) continue;
    
    let factor2 = currConverter[key];
    let outputValue = data * (factor2 / factor1);
    
    // limit value to 7 decimal places
    outputValue = Math.round((outputValue + Number.EPSILON) * 1e7) / 1e7;
    
    let outputClass = '.output.output--' + key;
    let outputDiv = document.querySelector(outputClass);
    outputDiv.lastElementChild.innerHTML = outputValue;
  }
}

async function fillUI(unit) {
  // fill header title
  document.getElementById('selected-converter').innerHTML = getKeyByValue(units, unit);
  
  for(var key in unit) {
    // fill input type select box
    var option = document.createElement('option');
    option.value = key;
    option.innerHTML = capitalizeFirstLetter(key);
    inputType.appendChild(option);
    
    // fill output divs
    var outputDiv = document.createElement('div');
    var divClass = 'output--' + key;
    var label = document.createElement('h3');
    var valueHolder = document.createElement('p');

    outputDiv.classList.add('output');
    outputDiv.classList.add(divClass);
    label.classList.add('label');
    label.innerHTML = key;
    valueHolder.classList.add('output-value');

    outputDiv.append(label, valueHolder);
    convertedList.appendChild(outputDiv);  
  }
  return true;
}

function capitalizeFirstLetter(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getKeyByValue(obj, value) {
  return Object.keys(obj).find(key => obj[key] === value);
}