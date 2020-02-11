var accountName = document.getElementById('account_name')
var confirmPassword = document.getElementById('confirm_password')
var email = document.getElementById('email')
var form = document.getElementById('register_form')
var password = document.getElementById('password')

function validateInfo () {
  event.preventDefault()

  if (password.value != confirmPassword.value) {
    alert("The passwords don't match!  Verify that you have entered your password correctly!")
    return false
  }

  if (password.value.length < 7) {
    alert('Passwords must contain at least 7 characters.')
    return false
  }

  jQuery.ajax({
    type: 'POST',
    url: '/users/registration-validation',
    data: {
      account_name: accountName.value.trim(),
      email: email.value
    },
    success: function (response) {
      console.log(response)
      form.removeAttribute('onsubmit')
      form.submit()
    },
    error: function (e) {
      alert(e.responseText)
    }
  })
}
