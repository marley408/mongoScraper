$(function(){


  

  $('.viewNotes').on("click", function(e) {
    e.preventDefault();
    const $id = $(this).data("id"); // `this` refers to the element that triggered the event because we use a normal function expression and not () => {}
    console.log($id);

    
    
    $.ajax({
      method:'GET',
      url: "/articles/" + $id,       
    }).then(function(data){

      console.log(data);

      const notes = data.note;

      const showNotes = function() {
        let allNotes = [];

        if (notes.length !== 0) {
          allNotes = notes.map(function(note) {
            return `<li class="list-group-item">${note.body}</li>`;
          });
        } else {
          return `<li class="list-group-item">No notes yet.</li>`;
        }

        return allNotes.join("");
      }


        //default modal if there are no notes
        const modal = [`
            <div class="modal" tabindex="-1" role="dialog" style="display: block;">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Notes for: ${$id}</h5>           
                  </div>
                  <div class="modal-body">
                    <ul class="list-group note-container">
                      ${showNotes()}
                    </ul>
                    <textarea class="userNote" placeholder="New note goes here" style="padding: 10px; width: 100%; resize:none; margin-top:10px;"></textarea>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger saveNote" data-id="${$id}">Save</button>
                    <button type="button" class="btn btn-secondary closeNote" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
          </div>
          `];


        $("#container").append(modal);
      });


  })


  // functionality for save button on note modal
  $(document).on('click', '.saveNote', function(e){
    e.preventDefault();

    const userNote = $('.userNote').val()
    const articleId = $(this).data("id")

    $.ajax({
      method: 'POST',
      url: "/articles/" + articleId,
      data: {
        body: userNote
      }
    }).then(function(){
      //clear note from textarea
      $('.userNote').val("")

      //remove default note. (In progress)
      // $('.list-group-item').remove()

      //store <li> so we can append it to .note-container section of the modal
      const noteListItem = [`
      <li class="list-group-item">${userNote}</li>
      `]
      //append new note
      $('.note-container').append(noteListItem)


    });
  });

})