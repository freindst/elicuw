$('.confirmation').on('click', function () {
    return confirm('Are you sure?');
});

function checkPass()
{
  //Store the password field objects into variables ...
  var pass1 = document.getElementById('password');
  var pass2 = document.getElementById('re_password');
  //Store the Confimation Message Object ...
  var message = document.getElementById('confirmMessage');
  //Set the colors we will be using ...
  var goodColor = "#66cc66";
  var badColor = "#ff6666";
  //Compare the values in the password field 
  //and the confirmation field
  if(pass1.value == pass2.value){
      //The passwords match. 
      //Set the color to the good color and inform
      //the user that they have entered the correct password 
      pass2.style.backgroundColor = goodColor;
      message.style.color = goodColor;
      message.innerHTML = "Passwords Match!"
  }else{
      //The passwords do not match.
      //Set the color to the bad color and
      //notify the user.
      pass2.style.backgroundColor = badColor;
      message.style.color = badColor;
      message.innerHTML = "Passwords Do Not Match!"
  }
}

$("#sign_up").submit(function( event ) {
	var err = $('.err')
	if ($('#username').val().length==0) {
		err.prepend($('<div role="alert" class="alert alert-danger"><span aria-hidden="true" class="glyphicon glyphicon-exclamation-sign"></span><span class="sr-only">Error:</span>  Username cannot be empty!</div>'));
		event.preventDefault();
		
	} else if ($('#email').val().length==0) {
		err.prepend($('<div role="alert" class="alert alert-danger"><span aria-hidden="true" class="glyphicon glyphicon-exclamation-sign"></span><span class="sr-only">Error:</span>  E-mail cannot be empty!</div>'));
		event.preventDefault();
	} else if ($('#password').val().length==0) {
		err.prepend($('<div role="alert" class="alert alert-danger"><span aria-hidden="true" class="glyphicon glyphicon-exclamation-sign"></span><span class="sr-only">Error:</span>  Password cannot be emty!</div>'));
		event.preventDefault();
	} else if ($('#password').val() != $('#re_password').val()) {
		err.prepend($('<div role="alert" class="alert alert-danger"><span aria-hidden="true" class="glyphicon glyphicon-exclamation-sign"></span><span class="sr-only">Error:</span>  Passwords do not match!</div>'));
		event.preventDefault();
	} else {
		return;
	}
})
