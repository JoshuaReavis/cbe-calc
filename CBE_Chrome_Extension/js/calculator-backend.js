<<<<<<< HEAD
function parseClassesCBE(info) {
  //console.log("readFromPageCBE()");
  var classList = [];
  var localData = String(info.data);
  var lines = localData.split('\n');
  var headers = [
    'ECON',
    'ACCT',
    'DSCI',
    'MIS',
    'FIN',
    'MKTG',
    'OPS',
    'MGMT',
    'IBUS',
    'HRM'
  ];
  var grades = [
    'A',
    'A-',
    'KA',
    'KA-',
    'B',
    'B+',
    'B-',
    'K',
    'K*',
    'KB',
    'KB+',
    'KB-',
    'C',
    'C+',
    'C-',
    'KC',
    'KC+',
    'KC-',
    'D',
    'D+',
    'D-',
    'KD',
    'KD+',
    'KD-',
    'F',
    'KF',
    'S',
    'U',
    'KZ',
    'Z'
  ];
  for(var i = 0 ; i < lines.length ; i++){
    //split on space or group of spaces and store in lineArray
    var lineArray = lines[i].trim().split(/\s+/);
    if(headers.indexOf(lineArray[0]) >= 0){
      var tempName = (lineArray[0] + ' ' + lineArray[1]).substring(0, 8)
      var tempGrade;
      var tempCredits;
      /*
      for(var j = 0 ; j < grades.length ; j++){
        if((lineArray.indexOf(grades[j]) >= 0) || (lineArray.indexOf('K' + grades[j]) >= 0)){
          tempGrade = lineArray[j];
          break;
        }
      }*/
      var realGrade = false;
      for(var ind = 5; ind < lineArray.length; ind++){
        if(grades.indexOf(lineArray[ind])>=0){
          tempGrade = lineArray[ind];

          //Class has a 'K' preceeding the grade
          if(tempGrade[0] === 'K' || (tempGrade[0] === 'K' && tempGrade[1] === '*')) {
            //tempGrade = tempGrade.substring(1,tempGrade.length);
            //console.log("K was hit, tempgrade=" + tempGrade);
          }

          //If class is pass/fail, break loop and ignore it
          if((tempGrade[0] === 'S') || (tempGrade[0] === 'U')){
            break;
          }

          //credits are located one before the grade.
          tempCredits = lineArray[ind-1];
          realGrade = true;
          break;
        }
      }

      if(realGrade){
        for(var j = 0 ; j < classList.length ; j++){
          if(classList[j].name === tempName){
            classList[j].composite = 'composite';
          }
        }

        classList.push({
          name: tempName,
          grade: tempGrade,
          gpa: getGPAValue(tempGrade).toFixed(1),
          credits: tempCredits
        });
      }
    }
  }

  return classList;
}


function parseClassesMSCM(info) {
  //console.debug("readFromPageMSCM()");
  var classList = [];
  var localData = String(info.data);
  var lines = localData.split('\n');
  var validclasses = {
    'MATH': ['157'],
    'DSCI': ['205'],
    'ACCT': ['240','245'],
    'ECON':['206','207'],
    'MIS': ['220'],
    'MGMT':['271'],
    'PHYS':['114'],
    'CHEM': ['121']
  }
  var grades = [
    'A',
    'A-',
    'K',
    'K*',
    'KA',
    'KA-',
    'B',
    'B+',
    'B-',
    'KB',
    'KB+',
    'KB-',
    'C',
    'C+',
    'C-',
    'KC',
    'KC+',
    'KC-',
    'D',
    'D+',
    'D-',
    'KD',
    'KD+',
    'KD-',
    'F',
    'KF',
    'S',
    'U',
    'KZ',
    'Z'
  ];
  for(var i = 0 ; i < lines.length ; i++){
    //split on space or group of spaces and store in lineArray
    var lineArray = lines[i].trim().split(/\s+/);

    if(validclasses.hasOwnProperty(lineArray[0]) && validclasses[lineArray[0]].indexOf(lineArray[1].substring(0,3))>=0){
      var tempName = (lineArray[0] + ' ' + lineArray[1]).substring(0, 8)
      var tempGrade;
      var tempCredits;

      var realGrade = false;
      for(var ind = 5; ind < lineArray.length; ind++){
        if(grades.indexOf(lineArray[ind])>=0){
          tempGrade = lineArray[ind];

          //Class has a 'K' preceeding the grade
          if(tempGrade[0] === 'K' || (tempGrade[0] === 'K' && tempGrade[1] === '*')) {
            tempGrade = tempGrade.substring(1,tempGrade.length);
          }

          //If class is pass/fail, break loop and ignore it
          if((tempGrade[0] === 'S') || (tempGrade[0] === 'U')){
            break;
          }

          //credits are located one before the grade.
          tempCredits = lineArray[ind-1];
          realGrade = true;
          break;
        }
      }

      if(realGrade){
        for(var j = 0 ; j < classList.length ; j++){
          if(classList[j].name === tempName){
            classList[j].composite = 'composite';
          }
        }

        classList.push({
          name: tempName,
          grade: tempGrade,
          gpa: getGPAValue(tempGrade).toFixed(1),
          credits: tempCredits
        });
      }
    }
  }

  return classList;
}

function calculateMSCMGPA(classList) {
  /* detect duplicates */
  for(var i = 0 ; i < classList.length ; i++){ //Remove unecessary "composite" flags
    /* don't touch K grade classes */
    if (classList[i].grade === "K" || classList[i].grade === "K*") {
      continue;
    }
    classList[i].composite = "unique";
    for(var j = i+1 ; j < classList.length ; j++){
      if(classList[j].name === classList[i].name){
        classList[i].composite = "composite";
      }
    }
  }

  var gpa = 0.00;
  var credits = 0.00;

  for(var i = 0 ; i < classList.length ; i++){
    if(classList[i].composite === "unique"){
      gpa += (+classList[i].gpa * +classList[i].credits);
      credits +=  +classList[i].credits;
    }
  }

  if(gpa != 0){
    gpa = gpa / credits;
  }

  var gradeInfo = {
    gpa: gpa.toFixed(2),
    credits: credits,
    classList: classList
  };

  return gradeInfo;
}

function calculateCBEGPA(classList) {
  var counter = 0;
  var target = 1;

  /*  detect duplicates */
  for(var i = 0 ; i < classList.length ; i++){ //Remove unecessary "composite" flags
    classList[i].composite = "unique";
    counter = 0;
    /* allow for certain classes to be retaken for credit */
    if((classList[i].name === "IBUS 474") || (classList[i].name === "MGMT 474")){
      target = 2;
    }else{
      target = 1;
    }
    for(var j = i+1 ; j < classList.length ; j++){
      if(classList[j].name === classList[i].name){
        counter++;
        if(counter >= target){
          classList[i].composite = "composite";
        }
      }
    }
  }

  var gpa = 0.00;
  var credits = 0.00; 
  //The number of credits minus credits from classes that were retaken

  for(var i = 0 ; i < classList.length ; i++){
    gpa += (+classList[i].gpa * +classList[i].credits);
    credits += +classList[i].credits;
  }

  if(gpa != 0){
    gpa = gpa / credits;
  }

  var gradeInfo = {
    gpa: gpa.toFixed(2),
    credits: credits,
    classList: classList
  };

  return gradeInfo;
}

//function to calculate GPA point based on letter grades
function getGPAValue(string){
  //console.log("getGPAValue()");
  var gpa;
  var letter = string.substring(0,1);
  if(string.length >= 2){
        var mod = string.substring(1,2);
        if(!(mod === '+' || mod ==='-')){
          var mod = '';
        }
      }
      if(letter === "a" || letter === 'A'){
        gpa = 4;
      }else if(letter === "b" || letter === 'B'){
        gpa = 3;
      }else if(letter === "c" || letter === 'C'){
        gpa = 2;
      }else if(letter === "d" || letter === 'D'){
        gpa = 1;
      }else if(letter === "f" || letter === 'F'){
        gpa = 0;
      }else if(letter === "z" || letter === 'Z'){
        gpa = 0;
      }else if(letter === "K" || string === 'K*'){
        gpa = 0;
      }else{
        return;
      }

      if(mod === '+' && gpa < 4){
        gpa += 0.3;
      }else if(mod === '-'){
        gpa -= 0.3;
      }
  return gpa;
=======
function parseClassesCBE(info) {
  //console.log("readFromPageCBE()");
  var classList = [];
  var localData = String(info.data);
  var lines = localData.split('\n');
  var headers = [
    'ECON',
    'ACCT',
    'DSCI',
    'MIS',
    'FIN',
    'MKTG',
    'OPS',
    'MGMT',
    'IBUS',
    'HRM'
  ];
  var grades = [
    'A',
    'A-',
    'KA',
    'KA-',
    'B',
    'B+',
    'B-',
    'K',
    'K*',
    'KB',
    'KB+',
    'KB-',
    'C',
    'C+',
    'C-',
    'KC',
    'KC+',
    'KC-',
    'D',
    'D+',
    'D-',
    'KD',
    'KD+',
    'KD-',
    'F',
    'KF',
    'S',
    'U',
    'KZ',
    'Z'
  ];
  for(var i = 0 ; i < lines.length ; i++){
    //split on space or group of spaces and store in lineArray
    var lineArray = lines[i].trim().split(/\s+/);
    if(headers.indexOf(lineArray[0]) >= 0){
      var tempName = (lineArray[0] + ' ' + lineArray[1]).substring(0, 8)
      var tempGrade;
      var tempCredits;
      /*
      for(var j = 0 ; j < grades.length ; j++){
        if((lineArray.indexOf(grades[j]) >= 0) || (lineArray.indexOf('K' + grades[j]) >= 0)){
          tempGrade = lineArray[j];
          break;
        }
      }*/
      var realGrade = false;
      for(var ind = 5; ind < lineArray.length; ind++){
        if(grades.indexOf(lineArray[ind])>=0){
          tempGrade = lineArray[ind];

          //Class has a 'K' preceeding the grade
          if(tempGrade[0] === 'K' || (tempGrade[0] === 'K' && tempGrade[1] === '*')) {
            //tempGrade = tempGrade.substring(1,tempGrade.length);
            //console.log("K was hit, tempgrade=" + tempGrade);
          }

          //If class is pass/fail, break loop and ignore it
          if((tempGrade[0] === 'S') || (tempGrade[0] === 'U')){
            break;
          }

          //credits are located one before the grade.
          tempCredits = lineArray[ind-1];
          realGrade = true;
          break;
        }
      }

      if(realGrade){
        for(var j = 0 ; j < classList.length ; j++){
          if(classList[j].name === tempName){
            classList[j].composite = 'composite';
          }
        }

        classList.push({
          name: tempName,
          grade: tempGrade,
          gpa: getGPAValue(tempGrade).toFixed(1),
          credits: tempCredits
        });
      }
    }
  }

  return classList;
}


function parseClassesMSCM(info) {
  //console.debug("readFromPageMSCM()");
  var classList = [];
  var localData = String(info.data);
  var lines = localData.split('\n');
  var validclasses = {
    'MATH': ['157'],
    'DSCI': ['205'],
    'ACCT': ['240','245'],
    'ECON':['206','207'],
    'MIS': ['220'],
    'MGMT':['271'],
    'PHYS':['114'],
    'CHEM': ['121']
  }
  var grades = [
    'A',
    'A-',
    'K',
    'K*',
    'KA',
    'KA-',
    'B',
    'B+',
    'B-',
    'KB',
    'KB+',
    'KB-',
    'C',
    'C+',
    'C-',
    'KC',
    'KC+',
    'KC-',
    'D',
    'D+',
    'D-',
    'KD',
    'KD+',
    'KD-',
    'F',
    'KF',
    'S',
    'U',
    'KZ',
    'Z'
  ];
  for(var i = 0 ; i < lines.length ; i++){
    //split on space or group of spaces and store in lineArray
    var lineArray = lines[i].trim().split(/\s+/);

    if(validclasses.hasOwnProperty(lineArray[0]) && validclasses[lineArray[0]].indexOf(lineArray[1].substring(0,3))>=0){
      var tempName = (lineArray[0] + ' ' + lineArray[1]).substring(0, 8)
      var tempGrade;
      var tempCredits;

      var realGrade = false;
      for(var ind = 5; ind < lineArray.length; ind++){
        if(grades.indexOf(lineArray[ind])>=0){
          tempGrade = lineArray[ind];

          //Class has a 'K' preceeding the grade
          if(tempGrade[0] === 'K' || (tempGrade[0] === 'K' && tempGrade[1] === '*')) {
            tempGrade = tempGrade.substring(1,tempGrade.length);
          }

          //If class is pass/fail, break loop and ignore it
          if((tempGrade[0] === 'S') || (tempGrade[0] === 'U')){
            break;
          }

          //credits are located one before the grade.
          tempCredits = lineArray[ind-1];
          realGrade = true;
          break;
        }
      }

      if(realGrade){
        for(var j = 0 ; j < classList.length ; j++){
          if(classList[j].name === tempName){
            classList[j].composite = 'composite';
          }
        }

        classList.push({
          name: tempName,
          grade: tempGrade,
          gpa: getGPAValue(tempGrade).toFixed(1),
          credits: tempCredits
        });
      }
    }
  }

  return classList;
}

function calculateMSCMGPA(classList) {
  /* detect duplicates */
  for(var i = 0 ; i < classList.length ; i++){ //Remove unecessary "composite" flags
    /* don't touch K grade classes */
    if (classList[i].grade === "K" || classList[i].grade === "K*") {
      continue;
    }
    classList[i].composite = "unique";
    for(var j = i+1 ; j < classList.length ; j++){
      if(classList[j].name === classList[i].name){
        classList[i].composite = "composite";
      }
    }
  }

  var gpa = 0.00;
  var credits = 0.00;

  for(var i = 0 ; i < classList.length ; i++){
    if(classList[i].composite === "unique"){
      gpa += (+classList[i].gpa * +classList[i].credits);
      credits +=  +classList[i].credits;
    }
  }

  if(gpa != 0){
    gpa = gpa / credits;
  }

  var gradeInfo = {
    gpa: gpa.toFixed(2),
    credits: credits,
    classList: classList
  };

  return gradeInfo;
}

function calculateCBEGPA(classList) {
  var counter = 0;
  var target = 1;

  /*  detect duplicates */
  for(var i = 0 ; i < classList.length ; i++){ //Remove unecessary "composite" flags
    classList[i].composite = "unique";
    counter = 0;
    /* allow for certain classes to be retaken for credit */
    if((classList[i].name === "IBUS 474") || (classList[i].name === "MGMT 474")){
      target = 2;
    }else{
      target = 1;
    }
    for(var j = i+1 ; j < classList.length ; j++){
      if(classList[j].name === classList[i].name){
        counter++;
        if(counter >= target){
          classList[i].composite = "composite";
        }
      }
    }
  }

  var gpa = 0.00;
  var credits = 0.00; 
  //The number of credits minus credits from classes that were retaken

  for(var i = 0 ; i < classList.length ; i++){
    gpa += (+classList[i].gpa * +classList[i].credits);
    credits += +classList[i].credits;
  }

  if(gpa != 0){
    gpa = gpa / credits;
  }

  var gradeInfo = {
    gpa: gpa.toFixed(2),
    credits: credits,
    classList: classList
  };

  return gradeInfo;
}

//function to calculate GPA point based on letter grades
function getGPAValue(string){
  //console.log("getGPAValue()");
  var gpa;
  var letter = string.substring(0,1);
  if(string.length >= 2){
        var mod = string.substring(1,2);
        if(!(mod === '+' || mod ==='-')){
          var mod = '';
        }
      }
      if(letter === "a" || letter === 'A'){
        gpa = 4;
      }else if(letter === "b" || letter === 'B'){
        gpa = 3;
      }else if(letter === "c" || letter === 'C'){
        gpa = 2;
      }else if(letter === "d" || letter === 'D'){
        gpa = 1;
      }else if(letter === "f" || letter === 'F'){
        gpa = 0;
      }else if(letter === "z" || letter === 'Z'){
        gpa = 0;
      }else if(letter === "K" || string === 'K*'){
        gpa = 0;
      }else{
        return;
      }

      if(mod === '+' && gpa < 4){
        gpa += 0.3;
      }else if(mod === '-'){
        gpa -= 0.3;
      }
  return gpa;
>>>>>>> a890869276fa48dc077bbd9f970450f3d9c60672
}