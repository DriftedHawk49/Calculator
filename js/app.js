let numpad = document.querySelectorAll("li"); 
let input = ""; // this is a global string variable used to store the input string at all times.
let answer = 0; // This is a global variable used to store final answer




// This function pushes the given parameter into input array to build the equation.
function pushToInput(selection){
    var equationInput = document.querySelector(".input");    
    if(selection!="=" && selection!="CE"){
        if(selection=="x"){
            input+="*";
        }
        else{
            input+=(selection.toString());
        }
        equationInput.innerText = input;
    } 
    
}


// Displays Math error message in the answer field if equation is arithematically wrong.
function mathError(){
    document.querySelector(".answer").innerText = "Math Error";
}


// Function to reset all fields. Called if error is caught or user presses Del Key.
function clearAll(){
    document.querySelector(".answer").innerText = "";
    document.querySelector(".input").innerText = "Enter Your Equation";
    input=[];
}




// This function is responsible for all computation after operand array and operator array are generated.
// this function takes in operator array and operand array as arguements, and then generates the result. 
function parser(operand,operator){
    let result = 0;
    let i=0;

    //for division
    while(i<operator.length){
        if(operator[i]=="/"){
            result = operand[i]/operand[i+1];
            operator.splice(i,1);
            operand.splice(i+1,1);
            operand.splice(i,1,result);
        }
        else{
            i+=1;
        }
    }
 
    // If operation contains only division, function will end here.   
    if(operator.length==0){
        return operand[0];
    }

    //for multiplication
    i=0;
    while(i<operator.length){
        if(operator[i]=="*"){
            result = operand[i]*operand[i+1];
            operator.splice(i,1);
            operand.splice(i+1,1);
            operand.splice(i,1,result);
        }
        else{
            i+=1;
        }
    }


// If operation contains only division & multiplication, function will end here.  
    if(operator.length==0){
        return operand[0];
    }

    //for addition 
    i=0;
    while(i<operator.length){
            result = operand[i]+operand[i+1];
            operator.splice(i,1);
            operand.splice(i+1,1);
            operand.splice(i,1,result);
    }

    //At this stage, operator length should be 0, because we have eliminated all the operators, by performing them
    // But if by user errors, or some discrepancy, it is not empty yet, then it will return null, which will display math error message.
    if(operator.length==0){
        return operand[0];
    }
    else{
        return null;
    }
}



//Funtion which accepts the arithematic equation in string format and generates the result. 
// Calls Parser function which is responsible for ODMAS math rule implication
// and calculates the result. Arith is reponsible for compensation of minus, and generating operand and operator Arrays, 
// and calling Parser function, passing in the operand and operator arrays, and 
function arith(line){
    var strArr = line.split("");
    spliceArray = [];
    operatorArray = [];
    operandArray=[];

    // Minus Settlement and inserting + at right points.
    for(var i=1;i<strArr.length-1;i++){
        if((strArr[i]=="-")){
                    if(strArr[i-1]=="."&&strArr[i+1]=="."){ // For situations like 2.-.2
                                    spliceArray.push(i);
                     }
                    else if((strArr[i-1]=="."&&parseFloat(strArr[i+1])!=NaN)){ //for situations like  4.-2
                                    spliceArray.push(i);
                    }
                    else if((strArr[i+1]=="."&&parseFloat(strArr[i-1])!=NaN)){ //for situations like 4-.2
                        spliceArray.push(i);
                    }
                    else if((parseFloat(strArr[i-1])!=NaN) && (parseFloat(strArr[i+1])!=NaN)){
                                    spliceArray.push(i);
                    }
        }
    }

    // Using splice array to change the original array at correct places.
    var t = 0;
    for(var i of spliceArray){
        strArr.splice(i+t,0,'+');
        t+=1;
    }

    line = strArr.join(""); // joining the array again to form updated equation
    
    // loop to spot any operators (+,* and /) and pushing them into operator array in the same order of occurance.
    //  then replacing them with # to generate operand array in next step.
    for(var i=0;i<strArr.length;i++){
        if(strArr[i]=="+"||strArr[i]=="*"||strArr[i]=="/"){
            operatorArray.push(strArr[i]);
            strArr[i] = "#";
        }
    }
    //generation of Operand array by splitting the string formed by joining previous array and parsFloat-ing every item in array.
    operandArray = ((strArr.join("")).split("#")).map(parseFloat);

    // To check whether the array formed is right by checking for any not a Number value in operand array.
    //Which exists the function and resets everything.
    for(var i of operandArray){
        if(Number.isNaN(i)){
            //Error Handling Functions. Wrong Equation Formed.
            mathError();
            clearAll();
            return;
        }
    }
    // operand array's length should be 1 more than operator array, if it is not , that means the equation is not 
    // arithematically correct.
    if(operandArray.length-1!=operatorArray.length){
        //Error handling
        mathError();
        clearAll();
        return;
    }
    //If everything is right, then Operand array and operator array are passed to Parser function,
    // which returns the answer
    var finalAnswer = parser(operandArray,operatorArray);
    return finalAnswer;


}



// Evaluates Answer after pressing Enter Key By user.
var finalEvaluate = function(){
    try{
        answer = arith(input);
    }
    catch(e){
       console.log(e);
    }

    if(answer===undefined||answer===NaN||answer===null){
        mathError();
    }
    else if(input==""){
        document.querySelector(".answer").innerText = "Field Empty";
    }
    else{
        input = answer.toString();
        document.querySelector(".answer").innerText = answer;

    }
}



// Event Listeners applied on all numpad list items displayed on the UI.
for(let i of numpad){
    i.addEventListener("click",(arg)=>{
        var selection  = arg.target.innerText;
        pushToInput(selection);
    });
}



// Event Listners to keypress on keyboard numpad or numeric keys, whichever is convinient for user.
document.addEventListener("keypress",(arg)=>{
    if(arg.key == "0"||arg.key == "1"||arg.key == "2"||arg.key == "3"||arg.key == "4"||arg.key == "5"||arg.key == "6"||arg.key == "7"||arg.key == "8"||arg.key == "9"||arg.key == "."||arg.key == "/"||arg.key == "*"||arg.key == "-"||arg.key == "+"){
        pushToInput(arg.key);
    }
    else if(arg.key=="Enter"){
        finalEvaluate();
    }
});



// Event Listner for Del key and backspace key, backspace deletes the data, and Del key resets the calculator app, Del key and CE key on UI have same function.
document.addEventListener("keydown",(arg)=>{
    if(input==""){
        document.querySelector(".input").innerText = "Enter Your Equation";
    }

    if(arg.key == "Backspace"){
        if(input.length!=0){
            input = input.substring(0,input.length-1);
            document.querySelector(".input").innerText = input;
        }
    }
    else if(arg.key == "Delete"){
        clearAll();
    }

});















