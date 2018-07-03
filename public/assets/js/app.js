$(function(){

  
  //scrape new articles button
  $('.scrape').on('click', function(event){
    event.preventDefault()
    $.ajax({
      method: "GET",
      url: "/api/scrape"
    })
    .then(function(articles){
      console.log(articles)
      //remove content inside .alert-warning
      $(".alert-warning").remove()
      
      const allArticles = []

      // building all html for all articles
      articles.forEach(function(data){
        const articleHtml = `
          <div class="card">
            <div class="card-header">
              <h3>
                <a href=${data.link} class="card-link">${data.title}</a>
              </h3>
              </div>
              <div class="card-body">
              <p class="card-text">${data.summary}</p>
              <button type="button" class="btn btn-danger save">Save Article</button>
            </div>
          </div>
          `
          allArticles.push(articleHtml)
        })

        
        $(".article-container").append(allArticles)
      

    })
  })


  //clear scraped articles 
  $('.clear').on('click', function(event){
    event.preventDefault()

    //store the default div that displays when there are no scraped articles
    const defaultAlert = `     
        <div class="alert alert-warning text-center">
          <h4>You haven't scraped any new articles!</h4>
        </div>
    `

    //clear articles
    $('.card').remove()

    //append defaultAlert to page
    $('.article-container').append(defaultAlert)

  })


  //save articles
  $(document).on('click', '.save', function(event) {
    event.preventDefault();
    const $card = $(event.target).parent().parent();

    console.log($card);

    const title = $card.find("h3").text();
    const summary = $card.find(".card-text").text();
    const link = $card.find("h3 > a").attr("href");

    $.ajax({
      method: "POST",
      url: "/api/save",
      data: {
        title: title,
        summary: summary,
        link: link
      }
    }).then(function(data) {
      console.log(data);
      $card.fadeOut(250, function() {
        $(this).remove();
      })
    }).catch(function(err) {
      console.log(err);
    });

    
  })


  


  


  //delete note


  //delete article & note
  

})