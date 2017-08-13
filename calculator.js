window.onload = function(){
  // initiate the variables and display areas
  var chain = [],result = "";
  var currentNumber = 0, float = false;
  var numberArea = document.getElementById("result");
  var operationsArea = document.getElementById("operations");
  var pendingOperation;
  var operationType = ["divide","times","minus","plus"];

  //function to show the currentNumber on screen
  function show(n) {
    //console.log("pleaseshow : ",n);
    numberArea.textContent = n;
  }
  function displayOp(o) {
    operationsArea.textContent = o;
  }
  function refresh() {
    show(currentNumber);
  }

  // Listen to the key pressed
  var buttonsList = document.getElementsByTagName("button");
  for ( var b = 0 ; b < buttonsList.length ; b++) {
    buttonsList[b].addEventListener("click",handleKeyPress);
  }

  function handleKeyPress(event) {
    if (["1","2","3","4","5","6","7","8","9","0","point"].indexOf(event.target.value) >= 0) {
      // number or point
      sendDigit(event.target.value);
    } else if ( operationType.indexOf(event.target.value) >= 0 ) {
      // operation
      sendOperation(event.target.value);
    } else if ( event.target.value === "AC") {
      // AC
      allClear();
    } else if ( event.target.value === "CE") {
      // CE
      clearEntry();
    } else {
      // We've pressed =
      getResult(chain);
    }
  }

  function sendDigit(digit) {
    // If we're just after a result, we clean it
    if (result !== "") {
      result = "";
      displayOp(0);
    }
    // Not more than 11 digit (point included)
    if (currentNumber.length === 11) {
      show("too much digit");
      setTimeout(function() {
        show(currentNumber);
      }, 2000);
    } else {
      if (digit === "point")
        digit = ".";
      if (!(digit === "." && typeof currentNumber === "string" && currentNumber.indexOf(".") >= 0)) {
        buildNumber(digit);
        show(currentNumber);
      }
    }
  }

  // function to build the currentNumber
  function buildNumber(digitStr) {
    if (digitStr === "reset") {
      currentNumber = 0;
    } else if (typeof currentNumber === "string") {
      currentNumber = currentNumber.concat(digitStr);
    } else if (digitStr === ".") {
      currentNumber = "0.";
    } else {
      currentNumber = digitStr;
    }
  }

  // This function reset the chain of operations, or compute the chain array and show it
  function updateOpChain(opChain) {
    if (opChain === "reset") {
      chain = [];
      displayOp(0);
    } else {
      var signConvertedChain = convertSigns(opChain);
      displayOp(signConvertedChain.join(" "));
    }
  }

  //This fonction place the evaluable sign in place of there word value
  function convertSigns(aChain) {
    var convertedArray = aChain.slice();
    var replacement = ["/","*","-","+"];
    for (var i = 0 ; i < convertedArray.length ; i++) {
      if (operationType.indexOf(convertedArray[i]) >= 0) {
        convertedArray.splice(i,1,replacement[operationType.indexOf(convertedArray[i])]);
      }
    }
    return convertedArray;
  }


  function sendOperation(operation) {

    if (result !== "") {
      // If we just get a result with =, we take it as the firts number to operate on and we rest result
      chain.push(result);
      result = "";
    } else if (currentNumber !== 0) {
      // we store the currentNumber in our chain array
      chain.push(cleanNumber(currentNumber));
    }
    // We reset the currentNumber, push the operation to the chain and refresh the screen
    buildNumber("reset");
    chain = cleanChain(chain);
    chain.push(operation);
    show(currentNumber);
    updateOpChain(chain);
    console.log(chain);
  }

  function clearEntry() {
    buildNumber("reset");
    show(currentNumber);
  }

  function allClear() {
    clearEntry();
    updateOpChain("reset");
  }

  // function to clean number from a potential ending point, before sending it to the chain
  function cleanNumber(num) {
    if (num.charAt(num.length - 1) === ".")
      num = num.slice(num.length - 1);
    return num;
  }

  // Function to clean the chain of a potential final operator before sending it to evaluation
  function cleanChain(chainArr) {
    if (operationType.indexOf(chain[chain.length - 1]) >= 0)
      chainArr.pop();
    return chainArr;
  }

  // Get the result!
  function getResult(chainArr) {
    if (currentNumber != 0)
      chain.push(currentNumber);
    // Get a clean chain array with operators converted to evaluable ones
    var finalChain = convertSigns(cleanChain(chainArr));
    var finalOperation = finalChain.join(" ");
    result = eval(finalOperation);

    // We clean the result, to have not too much digits, before or after the point if it exists one.
    result = cleanResult(result);

    show(result);
    buildNumber("reset");

    displayOp(finalOperation.concat(" = "));
    chain = [];
  }

  function cleanResult(num) {
    var numStr = num.toString();

    var pointIndex = numStr.indexOf(".");
    if (pointIndex === -1) {
      // there is no point, we just prevent to long number to be displayed
      if (numStr.length > 11) {
        return "Too much !";
      } else {
        return num;
      }

    } else {
      // there is a point

      //We clean the zeros at the end of the number
      numStr = takeOutZeros(numStr);

      if (pointIndex > 11)
      // If there are too much number before the point, we say it!
        return "too much";
      else if (numStr.length > 11) {
        // we cut the number of digit if needed
        numStr = numStr.slice(0,10);
      }

      return numStr;
    }
  }

  // Function to get rid of zeros at the end of the number, and of a potential final point as well
  function takeOutZeros(numStr) {
    var endStr = numStr;

    if (endStr.indexOf(".") >= 0) {
      while (endStr.length > 1) {
        if (endStr.charAt[endStr.length - 1] === "0") {
          endStr = endStr.slice(-1);
        } else if (endStr.charAt[endStr.length - 1] === ".") {
          endStr = endStr.slice(-1);
          break;
        } else {
          break;
        }
      }
    }
    return endStr;
  }
};