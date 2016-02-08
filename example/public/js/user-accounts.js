$(function(){

  $('#login').submit(function(){
    var data = {
      username: $('#username').val(),
      password: $('#password').val()
    }
    Http.post('/auth/login',data,showAccount)
    return false
  })

  $('#logout').click(function(){
    Http.post('/auth/logout',{},showLogin)
  })


  Http.get('/auth/instance',showAccount)
})


function showAccount(err,instance) {
  if( err ) return console.log(err);

  if( instance.user ) {
    $('#user_name').text(instance.user.name)
    $('#user_email').text(instance.user.email)

    $('#content_login').slideUp()
    $('#content_account').slideDown()
  }
}

function showLogin(err) {
  if( err ) return console.log(err);

  $('#content_login').slideDown()
  $('#content_account').slideUp()
}