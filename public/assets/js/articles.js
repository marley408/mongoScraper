$(function(){


  // this function will handle to following:
  // if there are no saved articles, display default div containing message "You haven't saved any articles!" 
  // if there are articles remove default div and show article card(s)

  $('.viewNotes').on("click", function(e) {
    e.preventDefault();
    const $id = $(this).data("id"); // `this` refers to the element that triggered the event because we use a normal function expression and not () => {}
    const modal = [`
        <div class="modal" tabindex="-1" role="dialog" style="display: block;">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Notes for: ${$id}</h5>           
              </div>
              <div class="modal-body">
                <ul class="list-group note-container">
                  <li class="list-group-item">No notes yet.</li>
                </ul>
                <textarea placeholder="New note goes here" style="padding: 10px; width: 100%; resize:none; margin-top:10px;"></textarea>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger saveNote">Save</button>
                <button type="button" class="btn btn-secondary closeNote" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
      </div>
      `];
      // make modal pop up on page 
      $("#container").append(modal);
  })

  // $(document).on('click', '.saveNote', function(){

  // })

})