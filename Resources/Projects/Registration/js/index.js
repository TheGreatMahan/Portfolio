function validate(){
    
    var issues = 0 ;

    var name = document.getElementById("name").value;
    if(name.length === 0){
        document.getElementById("invalidname").innerHTML = "Please Make sure you have a name entered!";
        issues++;
    }
    else
        document.getElementById("invalidname").innerHTML = "";

    
    var email = document.getElementById("email").value;
    function valid(email){
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    if(email.length === 0){
        document.getElementById("invalidemail").innerHTML = "Please Make sure you have an email entered!";
        issues++;
    }
    else if(!valid(email)){
        document.getElementById("invalidemail").innerHTML = "Please enter a valid email address!";
        issues++;
    }
    else
        document.getElementById("invalidemail").innerHTML = "";




    var education = document.getElementById("education").value;
    var edName;
    switch(parseInt(education)){
        case 0: 
            document.getElementById("invalideducation").innerHTML = "Please Select one of the following options inside the dropdown list."
            issues++;
            break;
        
        case 1:
            edName= "Computer Sciences";
            document.getElementById("invalideducation").innerHTML ="";
            break;

        case 2:
            edName= "Engineering";
            document.getElementById("invalideducation").innerHTML ="";
            break;
        
        case 3:
            edName= "Medical Sciences";
            document.getElementById("invalideducation").innerHTML ="";
            break;

        case 4:
            edName= "Culinary";
            document.getElementById("invalideducation").innerHTML ="";
            break;

        case 5:
            edName= "Business";
            document.getElementById("invalideducation").innerHTML ="";
            break;

        case 6:
            edName= "Other";
            document.getElementById("invalideducation").innerHTML ="";
            break;

    }
    
    
    
    
    
    var gender;
    if(document.getElementById("male").checked){
        gender = document.getElementById("male").value;
        document.getElementById("invalidgender").innerHTML = "";
    }
    else if(document.getElementById("female").checked){
        gender = document.getElementById("female").value;
        document.getElementById("invalidgender").innerHTML = "";
    } 
    else{
        gender = "undefined";
        document.getElementById("invalidgender").innerHTML = "Please Identify your gender!";
    }


    


    if(!document.getElementById("TERMS").checked){
        document.getElementById("invalidterms").innerHTML = "You must accept our terms and conditions to be able to progress!";
    }
    else{
        document.getElementById("invalidterms").innerHTML = "";
    }
    


}