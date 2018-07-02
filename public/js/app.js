$(function(){

  
  //scrape new articles button
  $('.scrape').on('click', function(){
    $.ajax({
      method: "GET",
      url: "/api/articles"
    })
    .then(function(data){
      console.log(data)
      //remove content inside .alert-warning
      $(".alert-warning").remove()
    })
  })


  //clear scrape articles button
  $('.clear').on('click', function(){

  })


  

})