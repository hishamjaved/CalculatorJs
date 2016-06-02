var calculator={
    screenValue:"",
    values:[],
    expression:"",
    lastOperator:"",
    lastOperationType:"",
    startNewValue:true,
    operators:{unary:["√","1/x"],binary:["+","-","*","/"],unaryBinary:["x^y"]}
};

document.addEventListener("keydown", onKeyDown, false);
// self executing function
(function() {
    //Main calculator div
    var cal = document.getElementsByClassName("calculator")[0];

    //Calculator title
    var title = document.createElement("SPAN");
    title.className="title";
    title.innerText="Calculator";
    cal.appendChild(title);

    //Calculator outer border div
    var outerRec = document.createElement("DIV");
    outerRec.className="outer-div";
    cal.appendChild(outerRec);


    //Calculator result screen
    var expScreen = document.createElement("DIV");
    calculator.expScreen=expScreen;
    expScreen.className="exp-screen";
    expScreen.innerText="";
    outerRec.appendChild(expScreen);

    //Calculator result screen
    var screen = document.createElement("DIV");
    calculator.screen=screen;
    screen.className="screen";
    screen.innerText="0";
    outerRec.appendChild(screen);

    //Button Row
    var row = document.createElement("DIV");
    row.className="row";
    outerRec.appendChild(row);
    addRow(row,{"MC":"clearMemoryRegister()","MR":"memoryRecall()","MS":"saveValueIntoMemory()","M+":"addValue()","M-":"removeValue()"});

    row = document.createElement("DIV");
    row.className="row";
    outerRec.appendChild(row);
    addRow(row,{"⌫":"backspace()","CE":"clearLastEntry()","C":"clearAll(false)","±":"plusMinus()","√":"performOperation('√')"});

    //Button Row
    row = document.createElement("DIV");
    row.className="row";
    outerRec.appendChild(row);
    addRow(row,{"7":"writeValue(7)","8":"writeValue(8)","9":"writeValue(9)","/":"performOperation('/')","x^y":"performOperation('x^y')"});


    //Button Row
    row = document.createElement("DIV");
    row.className="row";
    outerRec.appendChild(row);
    addRow(row,{"4":"writeValue(4)","5":"writeValue(5)","6":"writeValue(6)","*":"performOperation('*')","1/x":"performOperation('1/x')"});

    //Button Row
    row = document.createElement("DIV");
    row.className="row";
    outerRec.appendChild(row);
    addRow(row,{"1":"writeValue(1)","2":"writeValue(2)","3":"writeValue(3)","-":"performOperation('-')","=":"calculate()"});

    //Button Row
    row = document.createElement("DIV");
    row.className="row";
    outerRec.appendChild(row);
    addRow(row,{"0":"writeValue(0)",".":"writeValue(.)","+":"performOperation('+')"});


})();

function addRow(row,rowObject){
    var keys = Object.keys(rowObject);
    var button = null;
    for(var i=0;i<keys.length;i++){
        if(keys[i]=="0")
            button = '<button onclick="'+ rowObject[keys[i]] +'" style="width:6.2em;height:2em;margin:0 0.1em;font-size:0.7em" >'+keys[i]+'</button>';
        else if(keys[i]=="=")
            button = '<button onclick="'+ rowObject[keys[i]] +'" style="width:3em;height:4.6em;position:absolute; margin:0 0.1em;font-size:0.7em" >'+keys[i]+'</button>';
        else
            button = '<button onclick="'+ rowObject[keys[i]] +'" style="width:3em;height:2em;margin:0 0.1em;font-size:0.7em" >'+keys[i]+'</button>';
        row.innerHTML = row.innerHTML+button;
    }
}


function onKeyDown(e) {
    var keyCode = e.keyCode;
    if(keyCode>=96 && keyCode<=105) {
        writeValue(String.fromCharCode(e.keyCode-48));
    }
    else if(keyCode==110)
        writeValue(".");
    else if(keyCode==8){
        backspace();
    }
    else if(keyCode==111){
        divide();
    }
    else if(keyCode==106){
        multiply();
    }
    else if(keyCode==107){
        plus();
    }
    else if(keyCode==109){
        minus();
    }
    else if(keyCode==187 || keyCode==13){
        calculate();
    }
    else if(keyCode==27) {
        clearAll(false);
    }
    return false;
}

function calculate(){
    performOperation("=");
}

function squareRoot(val){
    return Math.sqrt(val);
}

function percentage(val){
    return val;
}

function reciproc(val){
    return 1/val;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


function backspace(){
    if(calculator.screen.innerText.length>0 && !calculator.startNewValue)
        calculator.screen.innerText = calculator.screen.innerText.substr(0,calculator.screen.innerText.length-1);
}

function plusMinus(){
    if(calculator.screen.innerText.length>0 && !calculator.startNewValue)
        calculator.screen.innerText = Number(calculator.screen.innerText)<0? Math.abs(Number(calculator.screen.innerText)): 0 - Number(calculator.screen.innerText);
}

function writeValue(val){
    if(calculator.startNewValue==true){
        calculator.screen.innerText="";
        calculator.startNewValue=false;
    }

    if(val=="." && calculator.screen.innerText.indexOf(".")==-1){
        calculator.screen.innerText = calculator.screen.innerText+val;
    }
    else if(val!=".")
        calculator.screen.innerText = calculator.screen.innerText+val;
    //calculator.screenValue = calculator.screen.innerText;
}

function plus(){
    performOperation("+")
}

function minus(){
    performOperation("-")
}

function multiply(){
    performOperation("*")
}

function divide(){
    performOperation("/")
}

function clearAll(keepResult){
    if(keepResult){
        if(calculator.values.length>0)
            calculator.values=[calculator.values[calculator.values.length-1]];
        calculator.lastOperator="";
        calculator.lastOperationType="UNARY";
    }
    else{
        calculator.screen.innerText="0";
        calculator.values=[];
        calculator.lastOperator="";
        calculator.lastOperationType="";
    }
    calculator.startNewValue=true;
    calculator.expression="";
    calculator.expScreen.innerText="";
}


function performOperation(operator){
    var isUnaryOperator = calculator.operators.unary.indexOf(operator)>-1;
    if(calculator.startNewValue && !isUnaryOperator && operator!="=" && calculator.lastOperationType!='UNARY'){
        //Handling operator change
        if(operator!=calculator.lastOperator){
            var operatorIndex = calculator.expression.lastIndexOf(" ");
            if(operatorIndex>-1){
                calculator.expression = calculator.expression.substr(0,operatorIndex);
                calculator.expression = calculator.expression+" "+operator;
                calculator.expScreen.innerText=calculator.expression;
                calculator.values.splice(calculator.values.length-1,1);
                calculator.values.push(operator);
                calculator.lastOperator = operator;
            }
        }
        return;
    }

    if(calculator.screen.innerText.indexOf(".")==calculator.screen.innerText.length-1)
        calculator.screen.innerText = calculator.screen.innerText.substr(0,calculator.screen.innerText.length-1);

    unaryBinaryOperation();

    if(isUnaryOperator){
        unaryOperation(operator);
    }
    else{
        binaryOperation(operator);
    }

    calculator.startNewValue=true;
    if(operator=="=")
        clearAll(true);
}



function unaryBinaryOperation(){
    if(calculator.values.length>1 &&
        calculator.values[calculator.values.length-1]=="x^y"){
        calculator.screen.innerText = Math.pow(Number(calculator.values[calculator.values.length-2]),Number(calculator.screen.innerText));
        calculator.expression = calculator.expression.substr(0,calculator.expression.lastIndexOf(" "));
        if(calculator.expression.lastIndexOf(" ")>-1){
            calculator.expression = calculator.expression.substr(0,calculator.expression.lastIndexOf(" "));
        }
        else
            calculator.expression = "";
        calculator.values.splice(calculator.values.length-2,2);
        calculator.lastOperationType='UNARYBINARY';
    }
    else if(calculator.values.length==1 && calculator.values[calculator.values.length-1]=="="){
        calculator.values.splice(0,1);
    }
}

function unaryOperation(operator){
    var val = Number(calculator.screen.innerText);

    if(operator=="√")
        calculator.screen.innerText = squareRoot(val);
    else if(operator=="1/x")
        calculator.screen.innerText = reciproc(val);
    calculator.lastOperationType='UNARY';
}

function binaryOperation(operator){
    calculator.values.push(calculator.screen.innerText);
    calculator.values.push(operator);

    if(calculator.values.length<=2)
        calculator.screenValue = calculator.screen.innerText;
    else{
        if(operator!="x^y" || (operator=="=" && calculator.lastOperationType=="UNARYBINARY")){
            if(calculator.lastOperator=="+")
                calculator.screenValue = Number(calculator.screenValue) + Number(calculator.screen.innerText);
            else if(calculator.lastOperator=="-")
                calculator.screenValue = Number(calculator.screenValue) - Number(calculator.screen.innerText);
            else if(calculator.lastOperator=="*")
                calculator.screenValue = Number(calculator.screenValue) * Number(calculator.screen.innerText);
            else if(calculator.lastOperator=="/")
                calculator.screenValue = Number(calculator.screenValue) / Number(calculator.screen.innerText);
        }

    }
    if(operator!="x^y"){
        calculator.lastOperator=operator;
        calculator.lastOperationType='BINARY';
    }
    if(calculator.expression==""){
        calculator.expression=calculator.screen.innerText+" "+operator;
    }
    else{
        calculator.expression+=" "+calculator.screen.innerText+" "+operator;
    }

    calculator.expScreen.innerText=calculator.expression;
    if(operator!="x^y")
        calculator.screen.innerText=calculator.screenValue;

}
